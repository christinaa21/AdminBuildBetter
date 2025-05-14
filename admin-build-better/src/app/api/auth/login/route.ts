// File: app/api/auth/login/route.ts
// For App Router in Next.js 13+

export async function POST(request: Request) {
    try {
      // Get the request body
      const body = await request.json();
  
      // Forward the request to the actual API
      const response = await fetch('https://build-better.site/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      // Get the response data
      const data = await response.json();
  
      // Return the response with appropriate headers
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error in login API proxy:', error);
      return new Response(JSON.stringify({ 
        code: 500, 
        status: 'INTERNAL_SERVER_ERROR', 
        error: 'An error occurred while processing your request' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }