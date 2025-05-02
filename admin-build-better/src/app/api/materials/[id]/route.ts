// File: app/api/materials/[id]/route.ts
// For handling PATCH, GET, DELETE operations on specific material IDs
import { NextRequest } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the material ID from params
    const { id: materialId } = await params;
    
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    
    // Forward the request to the actual API
    const response = await fetch(`http://54.153.132.144:8080/api/v1/materials/${materialId}`, {
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
    console.error('Error in material GET by ID API proxy:', error);
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
  { params }: { params: { id: string } }
) {
  try {
    // Get the material ID from params
    const materialId = params.id;
    
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    
    // Extract the form data
    const formData = await request.formData();
    
    // Forward the request to the actual API
    const response = await fetch(`http://54.153.132.144:8080/api/v1/materials/${materialId}`, {
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
    console.error('Error in material PATCH API proxy:', error);
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