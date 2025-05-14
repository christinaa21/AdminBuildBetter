// app/api/rumah/upload-floorplans/route.ts
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get('Authorization');
       
        // Forward the FormData which should contain suggestionId and floorplans
        const formData = await request.formData();
       
        // Log what's being sent
        const suggestionId = formData.get('suggestionId');
        console.log(`Processing floorplans upload for suggestion ID: ${suggestionId}`);
       
        // Check if there are floorplans in the request
        let floorplansCount = 0;
        formData.forEach((value, key) => {
            if (key === 'floorplans') {
                floorplansCount++;
                if (value instanceof File) {
                    console.log(`Floorplan file: ${value.name}, size: ${value.size} bytes`);
                }
            }
        });
        console.log(`Found ${floorplansCount} floorplans in the request`);
        
        // Create a new FormData to send to the API
        const apiFormData = new FormData();
        
        // Add the ID field with the suggestionId value
        apiFormData.append('id', suggestionId?.toString() || '');
        
        // Copy all floorplans from the original formData but change the field name to 'files'
        // This is the key fix - rename 'floorplans' to 'files' as expected by the backend API
        formData.getAll('floorplans').forEach(file => {
            apiFormData.append('files', file);  // Changed from 'floorplans' to 'files'
        });
       
        // Forward to the actual API endpoint
        const response = await fetch('https://build-better.site/api/v1/suggestions/upload-floorplans', {
            method: 'POST',
            headers: {
                ...(authHeader ? { 'Authorization': authHeader } : {})
            },
            body: apiFormData,
        });
       
        // Get response data
        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = {
                code: response.status,
                status: response.statusText,
                message: await response.text()
            };
        }
       
        console.log(`Upload floorplans response: ${response.status} ${response.statusText}`);
       
        // Return the response
        return new Response(JSON.stringify(responseData), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error in upload-floorplans API proxy:', error);
        return new Response(JSON.stringify({
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            error: `An error occurred while uploading floorplans: ${error instanceof Error ? error.message : String(error)}`
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}