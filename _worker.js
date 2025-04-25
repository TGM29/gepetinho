export default {
  async fetch(request, env, ctx) {
    // Extract URL and pathname
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Check if this is an API request
    if (pathname.startsWith('/api/')) {
      // Forward to Functions (uncomment when Functions are set up)
      // return env.ASSETS.fetch(request);
      return new Response(JSON.stringify({ error: 'API not implemented in static mode' }), {
        headers: { 'content-type': 'application/json' },
        status: 501
      });
    }
    
    try {
      // Handle asset requests directly (JS, CSS, images)
      if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        const response = await env.ASSETS.fetch(request);
        if (response.status !== 404) {
          return response;
        }
      }
      
      // If it's not an asset, check if there's an HTML file for this route
      const htmlRequest = new Request(
        new URL(pathname.endsWith('/') ? `${pathname}index.html` : `${pathname}.html`, url),
        request
      );
      
      let response = await env.ASSETS.fetch(htmlRequest);
      
      // If no specific HTML file exists, serve the index.html as a SPA fallback
      if (response.status === 404) {
        response = await env.ASSETS.fetch(new URL('/index.html', url));
        
        // If even index.html doesn't exist, return a simple 404
        if (response.status === 404) {
          return new Response('Page Not Found', { status: 404 });
        }
      }
      
      return response;
    } catch (e) {
      // If anything goes wrong, return a 500 error
      return new Response(`Server Error: ${e.message || e.toString()}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
}; 