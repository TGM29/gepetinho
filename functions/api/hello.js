export async function onRequest(context) {
  return new Response(JSON.stringify({
    message: 'Hello from Gepetinho API!',
    status: 'ok'
  }), {
    headers: {
      'content-type': 'application/json'
    }
  });
} 