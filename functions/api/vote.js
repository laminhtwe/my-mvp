// functions/api/vote.js
export async function onRequest(context) {
  // Contents of context object
  const {
    request, // incoming Request object
    env, // environment variables
    params, // if filename includes [id] parameter
    waitUntil, // method to ensure background tasks are completed
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context;

  const url = new URL(request.url);
  const endpoint = url.pathname;

  if (endpoint.startsWith('/api/vote/')) {
    try {
      // Extract the vote from the request body
      const requestBody = await request.json();
      const vote = requestBody.vote;

      // Construct the backend URL
      const backendURL = `https://voting-app.hackerinverse.workers.dev${endpoint}`;

      // Forward the request to the backend
      const backendResponse = await fetch(backendURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vote })
      });

      if (!backendResponse.ok) {
        throw new Error(`Backend responded with ${backendResponse.status}`);
      }

      const data = await backendResponse.json();

      const response = new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Allow any origin
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow these methods
          'Access-Control-Allow-Headers': 'Content-Type', // Allow these headers
        },
      });

      return response;
    } catch (error) {
      const errorResponse = { error: error.message };
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
  } else {
    // Handle other requests
    return new Response('Not Found', { status: 404 });
  }
}