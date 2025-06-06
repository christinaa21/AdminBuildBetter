// File: app/api/konsultasi/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
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
    
    // Log for debugging
    console.log(`Approving consultation ID: ${consultationID}`);

    // Forward the request to the actual API
    const response = await fetch(`https://build-better.site/api/v1/consultations/${consultationID}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // The backend doesn't require Content-Type for this endpoint
      },
      // No body needed for approve endpoint
    });

    // IMPROVEMENT: Check if the backend response is OK before parsing JSON
    if (!response.ok) {
        // Try to parse error from backend, otherwise use generic message
        const errorData = await response.text(); // Use .text() to avoid JSON parse errors
        console.error('Backend API Error (Approve):', response.status, errorData);
        return NextResponse.json({
            code: response.status,
            status: 'BACKEND_API_ERROR',
            error: `Failed to approve consultation. Backend responded with: ${errorData || response.statusText}`,
        }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Error in approve POST API proxy:', error);
    return NextResponse.json({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      error: 'An error occurred while processing your request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}