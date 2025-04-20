import adapter from '@sveltejs/adapter-vercel';

const config = {
  kit: {
    // Use the Vercel adapter instead of adapter-auto
    adapter: adapter({
      // Edge runtime - faster cold starts, improved performance
      runtime: 'edge',
      
      // For improved build performance
      split: true,
    })
  }
};

export default config;
