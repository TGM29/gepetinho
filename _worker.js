export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle API requests specially
    if (url.pathname.startsWith('/api/')) {
      // Could direct to Functions here if set up
      return new Response('API endpoint', { status: 200 });
    }
    
    try {
      // Try to serve the requested file from static storage
      const path = url.pathname === '/' ? '/index.html' : url.pathname;
      
      // For static files, try to serve from __STATIC_CONTENT
      if (path.match(/\.(js|css|png|jpg|svg|ico)$/)) {
        const response = await env.__STATIC_CONTENT.fetch(new Request(url));
        if (response.status !== 404) {
          return response;
        }
      }

      // For route paths, try to directly fetch the .html version
      let response = await env.__STATIC_CONTENT.fetch(
        new Request(new URL(path.endsWith('.html') ? path : `${path}.html`, url))
      );
      
      // If that fails, serve index.html as a fallback
      if (response.status === 404) {
        response = await env.__STATIC_CONTENT.fetch(
          new Request(new URL('/index.html', url))
        );
      }
      
      return response;
    } catch (e) {
      return new Response('Error: ' + (e.message || e.toString()), { status: 500 });
    }
  }
}; 