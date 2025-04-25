export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      try {
        // Dynamic import of the appropriate module based on the route
        const module = await import('./app' + url.pathname + '/route.js');
        if (module && typeof module.POST === 'function' && request.method === 'POST') {
          return await module.POST(request, env, ctx);
        }
        if (module && typeof module.GET === 'function' && request.method === 'GET') {
          return await module.GET(request, env, ctx);
        }
        return new Response('Method not allowed', { status: 405 });
      } catch (e) {
        console.error('API error:', e);
        return new Response('Internal Server Error', { status: 500 });
      }
    }
    
    // For other routes, serve the Next.js app
    try {
      // Serve static assets from KV
      if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        const response = await env.__STATIC_CONTENT.fetch(request);
        if (response.status !== 404) {
          return response;
        }
      }
      
      // Try to serve the specific page
      let response = await env.__STATIC_CONTENT.fetch(
        new Request(`${url.origin}${url.pathname}.html`, request)
      );
      
      // If page not found, serve index.html
      if (response.status === 404) {
        response = await env.__STATIC_CONTENT.fetch(
          new Request(`${url.origin}/index.html`, request)
        );
      }
      
      return response;
    } catch (e) {
      console.error('Worker error:', e);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
}; 