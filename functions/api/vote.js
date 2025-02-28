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

  const backendURL = 'https://voting.mutuist.com/api/vote/post';

  try {
    let requestBody = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      requestBody = await request.text();
    }

    // Forward the request to the backend
    const backendResponse = await fetch(backendURL, {
      method: request.method,
      headers: request.headers,
      body: requestBody,
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with ${backendResponse.status}`);
    }

    // Clone the response so that it's no longer immutable
    const newResponse = new Response(backendResponse.body, backendResponse);

    // Set CORS headers
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return newResponse;
  } catch (error) {
    const errorResponse = { error: error.message };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
}