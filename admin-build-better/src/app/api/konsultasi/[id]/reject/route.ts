// File: app/api/konsultasi/[id]/reject/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: {params: Promise<{ id: string }> }
) {
  try {
    const { id: consultationID } = await params;
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({
        code: 401,
        status: 'UNAUTHORIZED',
        error: 'Authorization header is missing',
      }, { status: 401 });
    }

    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({
        code: 400,
        status: 'BAD_REQUEST',
        error: 'Message is required for rejection',
      }, { status: 400 });
    }

    // Log for debugging
    console.log(`Rejecting consultation ID: ${consultationID} with message: "${message}"`);
   
    // Forward the request to the actual API
    const response = await fetch(`https://build-better.site/api/v1/consultations/${consultationID}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ message }),
    });

    // IMPROVEMENT: Check if the backend response is OK before parsing JSON
    if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend API Error (Reject):', response.status, errorData);
        return NextResponse.json({
            code: response.status,
            status: 'BACKEND_API_ERROR',
            error: `Failed to reject consultation. Backend responded with: ${errorData || response.statusText}`,
        }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Error in reject POST API proxy:', error);
    return NextResponse.json({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      error: 'An error occurred while processing your request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}