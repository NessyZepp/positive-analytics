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
