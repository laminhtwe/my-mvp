export async function onRequest(context) {
  console.log('onRequest called');
  const { request } = context;

  // URL of your voting-app Worker
  const workerUrl = process.env.NODE_ENV === 'development' ? "http://127.0.0.1:8787" : "https://voting-app.hackerinverse.workers.dev";

  // Handle CORS preflight (OPTIONS) requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Forward the request to the Worker, preserving method, headers, and body (only for POST)
  const response = await fetch(workerUrl + new URL(request.url).pathname + new URL(request.url).search, {
    method: request.method,
    headers: request.headers,
    body: request.method === 'POST' ? request.body : null, // Only send body for POST
  });

  // Return the response from the Worker, preserving status and headers, and add CORS headers
  return new Response(response.body, {
    status: response.status,
    headers: {
      ...response.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    },
  });
}