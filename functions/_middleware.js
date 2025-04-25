export async function onRequest(context) {
  // Return the original request
  return await context.next();
} 