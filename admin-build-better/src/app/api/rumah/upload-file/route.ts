// app/api/rumah/upload-file/route.ts
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get('Authorization');
       
        // Forward the FormData which should contain suggestionId, file, and type
        const formData = await request.formData();
       
        // Log what's being sent
        const suggestionId = formData.get('suggestionId');
        const fileType = formData.get('type');
        const file = formData.get('file');
       
        console.log(`Processing ${fileType} upload for suggestion ID: ${suggestionId}`);
        if (file instanceof File) {
            console.log(`File: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
        } else {
            console.log('No file found in the request');
        }
        
        // Create a new FormData to send to the API
        const apiFormData = new FormData();
        
        // Add the ID field with the suggestionId value
        apiFormData.append('id', suggestionId?.toString() || '');
        
        // Add the file type
        if (fileType) {
            apiFormData.append('type', fileType.toString());
        }
        
        // Add the file
        if (file) {
            apiFormData.append('file', file);
        }
       
        // Forward to the actual API endpoint
        const response = await fetch('https://build-better.site/api/v1/suggestions/upload-file', {
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
       
        console.log(`Upload file response: ${response.status} ${response.statusText}`);
       
        // Return the response
        return new Response(JSON.stringify(responseData), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error in upload-file API proxy:', error);
        return new Response(JSON.stringify({
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            error: `An error occurred while uploading file: ${error instanceof Error ? error.message : String(error)}`
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}