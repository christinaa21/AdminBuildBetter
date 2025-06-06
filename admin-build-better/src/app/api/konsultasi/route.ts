/* eslint-disable @typescript-eslint/no-unused-vars */
// File: app/api/konsultasi/route.ts

export async function GET(request: Request) {
    try {
        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('Authorization');

        // Forward the request to the actual API
        const apiUrl = `https://build-better.site/api/v1/consultations?includeCancelled=true`;

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
        console.error('Error in consultation API proxy:', error);
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