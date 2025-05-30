// File: app/api/konsultasi/[id]/approve/route.ts
import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: consultationID } = await params;

    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
   
    // We need to forward the FormData
    const formData = await request.formData();
   
    // Forward the request to the actual API
    const response = await fetch(`https://build-better.site/api/v1/consultations/${consultationID}/approve`, {
      method: 'POST',
      headers: {
        ...(authHeader ? { 'Authorization': authHeader } : {})
      },
      body: formData, // Send the FormData directly
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
    console.error('Error in approve POST API proxy:', error);
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