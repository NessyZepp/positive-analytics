import { format, subDays } from 'date-fns';

export function transformChannelData(channelInfo, followers, stream, videos, clips) {
  // Basic channel info with positive framing
  const transformed = {
    username: channelInfo.display_name,
    profileImage: channelInfo.profile_image_url,
    description: channelInfo.description || "A unique creator with a story to tell",
    
    // Community metrics
    community: {
      followers: followers,
      followerText: createPositiveFollowerText(followers),
      engagementRate: calculateEngagementRate(videos, followers),
      engagementText: "Your content creates meaningful connections",
      loyaltyScore: calculateLoyaltyScore(videos),
      loyaltyText: "You've built a dedicated community that returns to your content"
    },
    
    // Content metrics
    content: {
      totalStreams: videos.length,
      totalStreamText: `You've shared ${videos.length} experiences with your community`,
      averageViewers: calculateAverageViewers(videos),
      viewerText: "Your content brings people together",
      popularCategory: findPopularCategory(videos),
      categoryText: "You've found your creative niche"
    },
    
    // Growth metrics
    growth: {
      recentViews: calculateRecentViews(videos),
      viewsText: "People are discovering your unique content",
      clipViews: calculateTotalClipViews(clips),
      clipText: "Your memorable moments are being shared",
      returnRate: calculateReturnRate(videos),
      returnText: "Your content keeps viewers coming back for more"
    },
    
    // Current status
    isLive: stream ? true : false,
    currentViewers: stream ? stream.viewer_count : 0,
    currentGame: stream ? stream.game_name : null
  };
  
  return transformed;
}

function createPositiveFollowerText(followers) {
  if (followers < 100) {
    return `You've built a dedicated starting community of ${followers} supporters!`;
  } else if (followers < 1000) {
    return `Your growing community of ${followers} followers believes in your content!`;
  } else {
    const thousands = (followers / 1000).toFixed(1);
    return `You've inspired an impressive ${thousands}k people to join your journey!`;
  }
}

function calculateEngagementRate(videos, followers) {
  if (!videos.length || !followers) return 0;
  
  const totalViews = videos.reduce((sum, video) => sum + (video.view_count || 0), 0);
  return Math.min(((totalViews / videos.length) / followers) * 100, 100).toFixed(1);
}

function calculateLoyaltyScore(videos) {
  if (!videos.length) return 0;
  
  // This is a simplified calculation - in a real app you'd use more data points
  const viewsToFollowerRatio = videos.map(v => v.view_count).sort((a, b) => b - a);
  const consistency = viewsToFollowerRatio.length > 1 ? 
    viewsToFollowerRatio[0] / viewsToFollowerRatio[viewsToFollowerRatio.length - 1] : 1;
  
  return Math.min(((consistency * 0.7) + 0.3) * 100, 100).toFixed(0);
}

function calculateAverageViewers(videos) {
  if (!videos.length) return 0;
  return Math.round(videos.reduce((sum, video) => sum + (video.view_count || 0), 0) / videos.length);
}

function findPopularCategory(videos) {
  if (!videos.length) return "N/A";
  
  const categories = {};
  videos.forEach(video => {
    const category = video.game_name || "Just Chatting";
    categories[category] = (categories[category] || 0) + 1;
  });
  
  return Object.entries(categories).sort((a, b) => b[1] - a[1])[0][0];
}

function calculateRecentViews(videos) {
  if (!videos.length) return 0;
  
  const recentDate = subDays(new Date(), 30);
  const recentVideos = videos.filter(v => new Date(v.created_at) >= recentDate);
  
  return recentVideos.reduce((sum, video) => sum + (video.view_count || 0), 0);
}

function calculateTotalClipViews(clips) {
  if (!clips.length) return 0;
  return clips.reduce((sum, clip) => sum + (clip.view_count || 0), 0);
}

function calculateReturnRate(videos) {
  // In a real app, this would use more sophisticated data
  // This is a placeholder calculation
  if (videos.length < 3) return 70;
  
  const viewCounts = videos.map(v => v.view_count || 0).sort((a, b) => b - a);
  const avgTop = viewCounts.slice(0, Math.ceil(viewCounts.length / 3))
    .reduce((sum, count) => sum + count, 0) / Math.ceil(viewCounts.length / 3);
  const avgBottom = viewCounts.slice(-Math.floor(viewCounts.length / 3))
    .reduce((sum, count) => sum + count, 0) / Math.floor(viewCounts.length / 3);
  
  if (avgBottom === 0) return 75;
  const ratio = Math.min(avgTop / avgBottom, 3);
  
  // Convert to a percentage between 65-95
  return Math.round(65 + (ratio / 3) * 30);
}
