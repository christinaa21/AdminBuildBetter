import { NextRequest } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get the URL and query parameters
    const url = new URL(request.url);
    const grouped = url.searchParams.get('grouped');
   
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
   
    // Forward the request to the actual API with all parameters and headers
    const apiUrl = `http://54.153.132.144:8080/api/v1/materials${grouped ? '?grouped=true' : ''}`;
   
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
    console.error('Error in materials API proxy:', error);
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

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
   
    // We need to forward the FormData
    const formData = await request.formData();
   
    // Forward the request to the actual API
    const response = await fetch('http://54.153.132.144:8080/api/v1/materials', {
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
    console.error('Error in materials POST API proxy:', error);
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

// Add this new handler for PATCH requests
export async function PATCH(request: NextRequest) {
  try {
    // Get the URL to extract material ID from path
    const url = new URL(request.url);
    const pathname = url.pathname;
    const materialId = pathname.split('/').pop(); // Get the last part of the path which should be the material ID
    
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
    console.error('Error in materials PATCH API proxy:', error);
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