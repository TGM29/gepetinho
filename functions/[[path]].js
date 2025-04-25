export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  
  // Responder com uma página HTML simples se a URL for a raiz
  if (url.pathname === '/') {
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gepetinho - Your AI Assistant</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f5f5dc;
            text-align: center;
          }
          .container {
            max-width: 600px;
            padding: 2rem;
          }
          .btn {
            display: inline-block;
            background-color: #18181b;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            text-decoration: none;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Gepetinho</h1>
          <p>Your AI assistant is ready to help you.</p>
          <a href="/signup" class="btn">Get Started</a>
        </div>
      </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
  
  // Para solicitações API
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({
      message: 'API endpoint not implemented in static mode',
      path: params.path
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 501
    });
  }
  
  // Para outras rotas, tenta servir um arquivo estático
  return env.ASSETS.fetch(request);
} 