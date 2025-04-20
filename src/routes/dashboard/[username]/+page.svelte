// src/routes/+page.svelte - Simple homepage
<script>
  import { goto } from '$app/navigation';
  
  let username = '';
  let loading = false;
  let error = null;
  
  function handleSubmit() {
    if (!username) {
      error = 'Please enter a Twitch username';
      return;
    }
    
    error = null;
    loading = true;
    
    // Extract username from URL if pasted full URL
    if (username.includes('twitch.tv/')) {
      username = username.split('twitch.tv/')[1].split('/')[0].split('?')[0];
    }
    
    goto(`/dashboard/${username}`);
  }
</script>

<svelte:head>
  <title>Twitch Positivity - See Your Impact</title>
</svelte:head>

<main>
  <div class="container">
    <h1>Twitch Positivity</h1>
    <p class="tagline">See the true impact of your content</p>
    
    <form on:submit|preventDefault={handleSubmit}>
      <div class="input-group">
        <input 
          type="text" 
          bind:value={username} 
          placeholder="Enter your Twitch username or URL"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Show My Impact'}
        </button>
      </div>
      
      {#if error}
        <p class="error">{error}</p>
      {/if}
    </form>
    
    <div class="features">
      <div class="feature">
        <h3>Encouraging Insights</h3>
        <p>See your stats presented in a positive, motivating way</p>
      </div>
      <div class="feature">
        <h3>Growth Focused</h3>
        <p>Understand your progress without the pressure of raw numbers</p>
      </div>
      <div class="feature">
        <h3>Sharable Results</h3>
        <p>Download and share your impact with your community</p>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #6441a5 0%, #2a0845 100%);
    color: white;
    padding: 2rem;
  }
  
  .container {
    max-width: 800px;
    text-align: center;
  }
  
  h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
  
  .tagline {
    font-size: 1.5rem;
    margin-bottom: 3rem;
    opacity: 0.9;
  }
  
  .input-group {
    display: flex;
    max-width: 600px;
    margin: 0 auto;
  }
  
  input {
    flex: 1;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px 0 0 4px;
  }
  
  button {
    padding: 1rem 2rem;
    background: #f1c40f;
    color: #333;
    font-weight: bold;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  button:hover {
    background: #f39c12;
  }
  
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .error {
    color: #ff6b6b;
    margin-top: 1rem;
  }
  
  .features {
    display: flex;
    justify-content: space-between;
    margin-top: 4rem;
    gap: 2rem;
  }
  
  .feature {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  .feature h3 {
    margin-top: 0;
  }
  
  @media (max-width: 768px) {
    .features {
      flex-direction: column;
    }
    
    .input-group {
      flex-direction: column;
    }
    
    input, button {
      width: 100%;
      border-radius: 4px;
    }
    
    button {
      margin-top: 1rem;
    }
  }
</style>

// src/routes/dashboard/[username]/+page.js - Data loader
export const load = ({ params }) => {
  return {
    username: params.username
  };
};

// src/routes/dashboard/[username]/+page.svelte - Simplified dashboard
<script>
  import { onMount } from 'svelte';
  
  export let data;
  const { username } = data;
  
  let loading = true;
  let error = null;
  let dashboardData = null;
  let activeTab = 'community';
  
  // Mock data for initial testing - no API calls yet
  onMount(() => {
    setTimeout(() => {
      dashboardData = {
        username: username,
        profileImage: 'https://placehold.co/100x100',
        description: 'A Twitch creator with passion and dedication',
        isLive: false,
        community: {
          followers: 720,
          followerText: "You've built a dedicated community of 720 supporters!",
          engagementRate: 12.5,
          engagementText: "Your content creates meaningful connections",
          loyaltyScore: 85,
          loyaltyText: "You've built a dedicated community that returns to your content"
        },
        content: {
          totalStreams: 24,
          totalStreamText: "You've shared 24 experiences with your community",
          averageViewers: 35,
          viewerText: "Your content brings people together",
          popularCategory: "Just Chatting",
          categoryText: "You've found your creative niche"
        },
        growth: {
          recentViews: 2400,
          viewsText: "People are discovering your unique content",
          clipViews: 6200,
          clipText: "Your memorable moments are being shared",
          returnRate: 75,
          returnText: "Your content keeps viewers coming back for more"
        }
      };
      loading = false;
    }, 1500); // Simulate loading delay
  });
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
    <div class="error-container">
      <h2>Oops! Something went wrong</h2>
      <p>{error}</p>
      <a href="/">Try another username</a>
    </div>
  {:else if dashboardData}
    <div class="dashboard-container">
      <header>
        <div class="profile">
          <img src={dashboardData.profileImage} alt={dashboardData.username} />
          <div>
            <h1>{dashboardData.username}</h1>
            <p>{dashboardData.description}</p>
            {#if dashboardData.isLive}
              <span class="live-badge">LIVE NOW</span>
            {/if}
          </div>
        </div>
        <div class="actions">
          <button class="share-btn">Download Report</button>
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
          <div class="tab-panel">
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
              <div class="chart-placeholder">
                <div class="placeholder-circle">
                  <div class="placeholder-inner">{dashboardData.community.engagementRate}%</div>
                </div>
                <div class="placeholder-legend">
                  <div class="legend-item">
                    <span class="legend-color engaged"></span>
                    <span>Engaged Viewers</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color casual"></span>
                    <span>Casual Viewers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {:else if activeTab === 'content'}
          <div class="tab-panel">
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
          <div class="tab-panel">
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
              <div class="growth-placeholder">
                <div class="growth-bar start"></div>
                <div class="growth-bar current"></div>
                <div class="growth-bar future"></div>
                <div class="growth-labels">
                  <span>Start</span>
                  <span>Present</span>
                  <span>Future</span>
                </div>
              </div>
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
    margin-bottom: 1.5rem;
  }
  
  .chart-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
  }
  
  .placeholder-circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: conic-gradient(#6441a5 0% 12.5%, #e9ecef 12.5% 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .placeholder-inner {
    background: white;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: #6441a5;
  }
  
  .placeholder-legend {
    display: flex;
    gap: 2rem;
    margin-top: 1.5rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .legend-color {
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }
  
  .legend-color.engaged {
    background: #6441a5;
  }
  
  .legend-color.casual {
    background: #e9ecef;
  }
  
  .growth-placeholder {
    height: 250px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 2rem;
  }
  
  .growth-bar {
    width: 80px;
    background: #6441a5;
    border-radius: 4px 4px 0 0;
  }
  
  .growth-bar.start {
    height: 150px;
  }
  
  .growth-bar.current {
    height: 200px;
  }
  
  .growth-bar.future {
    height: 250px;
    opacity: 0.7;
  }
  
  .growth-labels {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
    margin-top: 1rem;
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
