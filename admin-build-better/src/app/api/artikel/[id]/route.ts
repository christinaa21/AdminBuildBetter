// File: app/api/artikel/[id]/route.ts
import { NextRequest } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the artikel ID from params
    const { id: artikelId } = await params;
    
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    
    // Forward the request to the actual API
    const response = await fetch(`https://build-better.site/api/v1/articles/${artikelId}`, {
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
    console.error('Error in artikel GET by ID API proxy:', error);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the artikel ID from params
    const { id: artikelId } = await params;
    
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    
    // Extract the form data
    const formData = await request.formData();
    
    // Forward the request to the actual API
    const response = await fetch(`https://build-better.site/api/v1/articles/${artikelId}`, {
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
    console.error('Error in artikel PATCH API proxy:', error);
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