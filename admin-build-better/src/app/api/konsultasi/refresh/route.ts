/* eslint-disable @typescript-eslint/no-unused-vars */
// File: app/api/konsultasi/refresh/route.ts
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
   
    // Forward the request to the actual API
    const response = await fetch('https://build-better.site/api/v1/consultations/refresh', {
      method: 'POST',
      headers: {
        ...(authHeader ? { 'Authorization': authHeader } : {})
      },
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
    console.error('Error in consultations POST API proxy:', error);
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