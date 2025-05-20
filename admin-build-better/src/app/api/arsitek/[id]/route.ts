// File: app/api/arsitek/[id]/route.ts
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: architectID } = await params;
    
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');

    // Forward the request to the actual API
    const apiUrl = `https://build-better.site/api/v1/architects/${architectID}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
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
    console.error('Error in single architect GET API proxy:', error);
    return new Response(JSON.stringify({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      error: 'An error occurred while processing your request'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: architectID } = await params;
    
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    
    // Extract the form data
    const formData = await request.formData();
    
    // Forward the request to the actual API
    const response = await fetch(`https://build-better.site/api/v1/architects/${architectID}`, {
      method: 'PATCH',
      headers: {
        ...(authHeader ? { 'Authorization': authHeader } : {})
      },
      body: formData,
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
    console.error('Error in single architect PATCH API proxy:', error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: architectID } = await params;
    
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    
    // Forward the request to the actual API
    const apiUrl = `https://build-better.site/api/v1/architects/${architectID}`;
    
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        ...(authHeader ? { 'Authorization': authHeader } : {})
      },
    });
    
    // Get the response data
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.warn('Failed to parse JSON response:', e);
      data = {};
    }
    
    // Return the response with appropriate headers
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in single architect DELETE API proxy:', error);
    return new Response(JSON.stringify({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      error: 'An error occurred while processing your request'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
}