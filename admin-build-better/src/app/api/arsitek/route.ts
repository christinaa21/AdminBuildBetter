/* eslint-disable @typescript-eslint/no-unused-vars */
// File: app/api/arsitek/route.ts
import { NextRequest } from "next/server";

export async function GET(request: Request) {
    try {
        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('Authorization');

        // Forward the request to the actual API
        const apiUrl = `https://build-better.site/api/v1/architects`;

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
        console.error('Error in architects API proxy:', error);
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

export async function POST(request: NextRequest) {
    try {
        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('Authorization');

        // Extract form data
        const formData = await request.formData();
        
        // Log what's in the form data for debugging
        console.log('FormData entries:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Create JSON data from FormData
        const jsonData = {
            email: formData.get('email'),
            username: formData.get('username'),
            province: formData.get('province'),
            city: formData.get('city')
        };

        // Forward the request to the actual API
        const response = await fetch('https://build-better.site/api/v1/architects', {
            method: 'POST',
            headers: {
                'Authorization': authHeader || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData),
        });

        // Log response details for debugging
        console.log('API Response Status:', response.status);

        // Get the response data
        let data;
        try {
            data = await response.json();
        } catch (e) {
            const text = await response.text();
            console.error('Failed to parse JSON:', text);
            throw new Error('Invalid JSON response from server');
        }

        // Return the response with appropriate headers
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error in architects POST API proxy:', error);
        return new Response(JSON.stringify({
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            error: 'An error occurred while processing your request',
            details: error instanceof Error ? error.message : String(error)
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function PATCH(request: NextRequest) {
    try {
      // Get the URL to extract architect ID from path
      const url = new URL(request.url);
      const pathname = url.pathname;
      const architectID = pathname.split('/').pop(); // Get the last part of the path which should be the architect ID
      
      // Get the authorization header from the incoming request
      const authHeader = request.headers.get('Authorization');
      
      // Extract the form data
      const formData = await request.formData();
      
      // Convert FormData to JSON
      const jsonData = {
        email: formData.get('email'),
        username: formData.get('username'),
        province: formData.get('province'),
        city: formData.get('city')
      };
      
      // Forward the request to the actual API
      const response = await fetch(`https://build-better.site/api/v1/architects/${architectID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': authHeader || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData),
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
      console.error('Error in architects PATCH API proxy:', error);
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
        // Get the URL to extract architect ID from path
        const url = new URL(request.url);
        const pathname = url.pathname;
        const architectID = pathname.split('/').pop(); // Get the last part of the path which should be the architect ID
        
        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('Authorization');
        
        // Forward the request to the actual API
        const apiUrl = `https://build-better.site/api/v1/architects/${architectID}`;
        
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
        console.error('Error in architects DELETE API proxy:', error);
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