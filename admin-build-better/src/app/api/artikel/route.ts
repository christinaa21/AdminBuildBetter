/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// File: app/api/artikel/route.ts
import { NextRequest } from "next/server";

export async function GET(request: Request) {
    try {
        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('Authorization');

        // Forward the request to the actual API
        const apiUrl = `https://build-better.site/api/v1/articles`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                ...(authHeader ? { 'Authorization': authHeader} : {})
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
        console.error('Error in suggestions API proxy:', error);
        return new Response(JSON.stringify({
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            error: 'An error occured while processing your request'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
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
    const response = await fetch('https://build-better.site/api/v1/articles', {
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
    console.error('Error in articles POST API proxy:', error);
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

export async function DELETE(request: NextRequest) {
    try {
        // Get the URL to extract article ID from path
        const url = new URL(request.url);
        const pathname = url.pathname;
        const suggestionID = pathname.split('/').pop(); // Get the last part of the path which should be the article ID
        
        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('Authorization');
        
        // Forward the request to the actual API
        const apiUrl = `https://build-better.site/api/v1/articles/${suggestionID}`;
        
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                ...(authHeader ? { 'Authorization': authHeader} : {})
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
        console.error('Error in articles DELETE API proxy:', error);
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