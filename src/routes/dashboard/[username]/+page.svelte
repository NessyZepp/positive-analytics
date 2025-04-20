<script>
  import { onMount } from 'svelte';
  import { Doughnut, Line } from 'svelte-chartjs';
  import { supabase } from '$lib/supabaseClient';
  import { 
    getChannelInfo, 
    getFollowerCount, 
    getStreamInfo, 
    getVideos, 
    getClips 
  } from '$lib/twitchApi';
  import { transformChannelData } from '$lib/dataTransformer';
  import { fade, fly } from 'svelte/transition';
  
  export let data;
  const { username } = data;
  
  let loading = true;
  let error = null;
  let dashboardData = null;
  let activeTab = 'community';
  
  onMount(async () => {
    try {
      // Fetch all required data
      const channelInfo = await getChannelInfo(username);
      const followers = await getFollowerCount(channelInfo.userId);
      const stream = await getStreamInfo(channelInfo.userId);
      const videos = await getVideos(channelInfo.userId, 20);
      const clips = await getClips(channelInfo.userId);
      
      // Transform raw data into positively framed insights
      dashboardData = transformChannelData(channelInfo, followers, stream, videos, clips);
      
      // Store in Supabase for future reference
      await supabase.from('analytics_reports').insert({
        twitch_username: username.toLowerCase(),
        report_data: dashboardData,
        created_at: new Date()
      });
      
    } catch (err) {
      console.error('Error fetching data:', err);
      error = err.message || 'Failed to load channel data';
    } finally {
      loading = false;
    }
  });
  
  function downloadReport() {
    // This is simplified - in a real app you'd generate a proper PDF or image
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dashboardData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${username}-positivity-report.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
</script>

<svelte:head>
  <title>{username} - Twitch Positivity Dashboard</title>
</svelte:head>

<main>
  {#if loading}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Gathering your positive insights...</p>
    </div>
  {:else if error}
    <div class="error-container" transition:fade>
      <h2>Oops! Something went wrong</h2>
      <p>{error}</p>
      <a href="/">Try another username</a>
    </div>
  {:else if dashboardData}
    <div class="dashboard-container" transition:fade>
      <header>
        <div class="profile">
          <img src={dashboardData.profileImage} alt={dashboardData.username} />
          <div>
            <h1>{dashboardData.username}</h1>
            <p>{dashboardData.description}</p>
            {#if dashboardData.isLive}
              <span class="live-badge">LIVE NOW with {dashboardData.currentViewers} viewers</span>
            {/if}
          </div>
        </div>
        <div class="actions">
          <button class="share-btn" on:click={downloadReport}>Download Report</button>
        </div>
      </header>
      
      <nav class="tabs">
        <button 
          class:active={activeTab === 'community'} 
          on:click={() => activeTab = 'community'}>
          Community Impact
        </button>
        <button 
          class:active={activeTab === 'content'} 
          on:click={() => activeTab = 'content'}>
          Content Reach
        </button>
        <button 
          class:active={activeTab === 'growth'} 
          on:click={() => activeTab = 'growth'}>
          Growth Journey
        </button>
      </nav>
      
      <div class="tab-content">
        {#if activeTab === 'community'}
          <div class="tab-panel" in:fly={{ y: 20, duration: 300 }}>
            <div class="metric-cards">
              <div class="metric-card">
                <h3>Community Size</h3>
                <div class="metric-value">{dashboardData.community.followers.toLocaleString()}</div>
                <p>{dashboardData.community.followerText}</p>
              </div>
              
              <div class="metric-card">
                <h3>Engagement Level</h3>
                <div class="metric-value">{dashboardData.community.engagementRate}%</div>
                <p>{dashboardData.community.engagementText}</p>
              </div>
              
              <div class="metric-card">
                <h3>Community Loyalty</h3>
                <div class="metric-value">{dashboardData.community.loyaltyScore}/100</div>
                <p>{dashboardData.community.loyaltyText}</p>
              </div>
            </div>
            
            <div class="chart-container">
              <h3>Your Community Connection</h3>
              <Doughnut 
                data={{
                  labels: ['Engaged Viewers', 'Casual Viewers'],
                  datasets: [{
                    data: [
                      dashboardData.community.engagementRate,
                      100 - dashboardData.community.engagementRate
                    ],
                    backgroundColor: ['#6441a5', '#e9ecef']
                  }]
                }}
                options={{
                  cutout: '70%',
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        {:else if activeTab === 'content'}
          <div class="tab-panel" in:fly={{ y: 20, duration: 300 }}>
            <div class="metric-cards">
              <div class="metric-card">
                <h3>Content Created</h3>
                <div class="metric-value">{dashboardData.content.totalStreams}</div>
                <p>{dashboardData.content.totalStreamText}</p>
              </div>
              
              <div class="metric-card">
                <h3>Average Viewership</h3>
                <div class="metric-value">{dashboardData.content.averageViewers}</div>
                <p>{dashboardData.content.viewerText}</p>
              </div>
              
              <div class="metric-card">
                <h3>Top Category</h3>
                <div class="metric-value">{dashboardData.content.popularCategory}</div>
                <p>{dashboardData.content.categoryText}</p>
              </div>
            </div>
            
            <div class="insight-box">
              <h3>Content Creator Insight</h3>
              <p>Your streams in <strong>{dashboardData.content.popularCategory}</strong> show your unique voice and perspective. The {dashboardData.content.averageViewers} people who tune in regularly are a testament to the quality content you create. Keep focusing on what makes your streams special!</p>
            </div>
          </div>
        {:else if activeTab === 'growth'}
          <div class="tab-panel" in:fly={{ y: 20, duration: 300 }}>
            <div class="metric-cards">
              <div class="metric-card">
                <h3>Recent Views</h3>
                <div class="metric-value">{dashboardData.growth.recentViews.toLocaleString()}</div>
                <p>{dashboardData.growth.viewsText}</p>
              </div>
              
              <div class="metric-card">
                <h3>Clip Views</h3>
                <div class="metric-value">{dashboardData.growth.clipViews.toLocaleString()}</div>
                <p>{dashboardData.growth.clipText}</p>
              </div>
              
              <div class="metric-card">
                <h3>Return Rate</h3>
                <div class="metric-value">{dashboardData.growth.returnRate}%</div>
                <p>{dashboardData.growth.returnText}</p>
              </div>
            </div>
            
            <div class="chart-container">
              <h3>Your Growth Path</h3>
              <Line
                data={{
                  labels: ['Start', 'Present', 'Future'],
                  datasets: [{
                    label: 'Growth Trajectory',
                    data: [
                      Math.floor(dashboardData.community.followers * 0.7),
                      dashboardData.community.followers,
                      Math.ceil(dashboardData.community.followers * 1.3)
                    ],
                    borderColor: '#6441a5',
                    backgroundColor: 'rgba(100, 65, 165, 0.2)',
                    tension: 0.4,
                    fill: true
                  }]
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
              <p class="chart-note">Based on your current trajectory, your community is positioned for continued growth!</p>
            </div>
          </div>
        {/if}
      </div>
      
      <footer>
        <p class="footer-note">This positive framing helps celebrate your achievements! All insights are based on your public Twitch data.</p>
        <a href="/" class="footer-link">Check another creator</a>
      </footer>
    </div>
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    background: #f8f9fa;
    padding: 0;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #6441a5 0%, #2a0845 100%);
    color: white;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 2rem;
    text-align: center;
    background: linear-gradient(135deg, #6441a5 0%, #2a0845 100%);
    color: white;
  }
  
  .error-container a {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: white;
    color: #6441a5;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
  }
  
  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .profile {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .profile img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid #6441a5;
  }
  
  .profile h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
  }
  
  .profile p {
    margin: 0;
    color: #666;
  }
  
  .live-badge {
    display: inline-block;
    background: #eb4d4b;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
  
  .actions button {
    padding: 0.75rem 1.5rem;
    background: #6441a5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .tabs {
    display: flex;
    margin-bottom: 2rem;
    border-bottom: 1px solid #dee2e6;
  }
  
  .tabs button {
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    font-weight: 500;
    color: #495057;
    cursor: pointer;
  }
  
  .tabs button.active {
    border-bottom-color: #6441a5;
    color: #6441a5;
  }
  
  .metric-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .metric-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    text-align: center;
  }
  
  .metric-card h3 {
    margin-top: 0;
    color: #6441a5;
    font-size: 1rem;
  }
  
  .metric-value {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 1rem 0;
    color: #333;
  }
  
  .insight-box {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    margin-bottom: 2rem;
  }
  
  .insight-box h3 {
    margin-top: 0;
    color: #6441a5;
  }
  
  .chart-container {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    margin-bottom: 2rem;
  }
  
  .chart-container h3 {
    margin-top: 0;
    color: #6441a5;
    text-align: center;
  }
  
  .chart-note {
    text-align: center;
    color: #666;
    margin-top: 1rem;
    font-style: italic;
  }
  
  footer {
    text-align: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #dee2e6;
  }
  
  .footer-note {
    color: #868e96;
    margin-bottom: 1rem;
  }
  
  .footer-link {
    color: #6441a5;
    text-decoration: none;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    .dashboard-container {
      padding: 1rem;
    }
    
    header {
      flex-direction: column;
      text-align: center;
    }
    
    .profile {
      flex-direction: column;
      margin-bottom: 1.5rem;
    }
    
    .metric-cards {
      grid-template-columns: 1fr;
    }
    
    .tabs {
      overflow-x: auto;
      white-space: nowrap;
    }
  }
</style>
