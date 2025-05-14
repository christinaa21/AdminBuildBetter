/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// File: app/api/rumah/route.ts
import { NextRequest } from "next/server";

export async function GET(request: Request) {
    try {
        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('Authorization');

        // Forward the request to the actual API
        const apiUrl = `http://54.153.132.144:8080/api/v1/suggestions`;

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

        // Log the content type of incoming request for debugging
        console.log('Incoming Content-Type:', request.headers.get('Content-Type'));

        // Extract form data
        const formData = await request.formData();
        
        // Log what's in the form data for debugging
        console.log('FormData entries:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${typeof value === 'object' ? 'File object' : value}`);
        }

        // Create JSON object with the specific structure expected by the API
        const jsonData: any = {
            houseNumber: 0,
            landArea: 0,
            buildingArea: 0,
            buildingHeight: 0,
            style: "",
            floor: 0,
            rooms: 0,
            designer: "",
            defaultBudget: 1,
            windDirection: "west",
            budgetMin: [],
            budgetMax: [],
            materials0: [],
            materials1: [],
            materials2: []
        };
        
        // Collect array fields data
        const budgetMinArray: number[] = [];
        const budgetMaxArray: number[] = [];
        const materials0Array: string[] = [];
        const materials1Array: string[] = [];
        const materials2Array: string[] = [];
        
        // Process all form data entries
        for (const [key, value] of formData.entries()) {
            // Handle array fields
            if (key.startsWith('budgetMin[')) {
                const indexMatch = key.match(/\[(\d+)\]/);
                if (indexMatch && indexMatch[1]) {
                    const index = parseInt(indexMatch[1]);
                    // Make sure the array is big enough
                    while (budgetMinArray.length <= index) {
                        budgetMinArray.push(0);
                    }
                    budgetMinArray[index] = Number(value);
                }
            } 
            else if (key.startsWith('budgetMax[')) {
                const indexMatch = key.match(/\[(\d+)\]/);
                if (indexMatch && indexMatch[1]) {
                    const index = parseInt(indexMatch[1]);
                    // Make sure the array is big enough
                    while (budgetMaxArray.length <= index) {
                        budgetMaxArray.push(0);
                    }
                    budgetMaxArray[index] = Number(value);
                }
            }
            else if (key.startsWith('materials0[')) {
                const indexMatch = key.match(/\[(\d+)\]/);
                if (indexMatch && indexMatch[1]) {
                    const index = parseInt(indexMatch[1]);
                    // Make sure the array is big enough
                    while (materials0Array.length <= index) {
                        materials0Array.push("");
                    }
                    materials0Array[index] = value.toString();
                }
            }
            else if (key.startsWith('materials1[')) {
                const indexMatch = key.match(/\[(\d+)\]/);
                if (indexMatch && indexMatch[1]) {
                    const index = parseInt(indexMatch[1]);
                    // Make sure the array is big enough
                    while (materials1Array.length <= index) {
                        materials1Array.push("");
                    }
                    materials1Array[index] = value.toString();
                }
            }
            else if (key.startsWith('materials2[')) {
                const indexMatch = key.match(/\[(\d+)\]/);
                if (indexMatch && indexMatch[1]) {
                    const index = parseInt(indexMatch[1]);
                    // Make sure the array is big enough
                    while (materials2Array.length <= index) {
                        materials2Array.push("");
                    }
                    materials2Array[index] = value.toString();
                }
            }
            // Handle regular fields
            else if (key === 'houseNumber' || key === 'landArea' || key === 'buildingArea' || 
                     key === 'floor' || key === 'rooms' || key === 'buildingHeight') {
                jsonData[key] = Number(value);
            }
            else if (key === 'defaultBudget') {
                jsonData[key] = Number(value);
            } 
            else {
                // Handle other string fields
                jsonData[key] = value.toString();
            }
        }
        
        // Assign the arrays to the final object
        jsonData.budgetMin = budgetMinArray.filter(item => item !== 0);
        jsonData.budgetMax = budgetMaxArray.filter(item => item !== 0);
        jsonData.materials0 = materials0Array.filter(item => item !== "");
        jsonData.materials1 = materials1Array.filter(item => item !== "");
        jsonData.materials2 = materials2Array.filter(item => item !== "");

        // Log the final JSON data being sent to the API
        console.log('Sending JSON to API:', JSON.stringify(jsonData, null, 2));
        
        // Forward the request to the actual API with JSON
        const response = await fetch('http://54.153.132.144:8080/api/v1/suggestions', {
            method: 'POST',
            headers: {
                ...(authHeader ? { 'Authorization': authHeader } : {}),
                'Content-Type': 'application/json',  // Set proper content type for JSON
                'Accept': 'application/json'
            },
            body: JSON.stringify(jsonData),
        });

        // Log response details for debugging
        console.log('API Response Status:', response.status);
        console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));

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
        console.error('Error in suggestions POST API proxy:', error);
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
      // Get the URL to extract suggestion ID from path
      const url = new URL(request.url);
      const pathname = url.pathname;
      const suggestionID = pathname.split('/').pop(); // Get the last part of the path which should be the suggestion ID
      
      // Get the authorization header from the incoming request
      const authHeader = request.headers.get('Authorization');
      
      // Extract the form data
      const formData = await request.formData();
      
      // Forward the request to the actual API
      const response = await fetch(`http://54.153.132.144:8080/api/v1/suggestions/${suggestionID}`, {
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
      console.error('Error in suggestions PATCH API proxy:', error);
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
        // Get the URL to extract suggestion ID from path
        const url = new URL(request.url);
        const pathname = url.pathname;
        const suggestionID = pathname.split('/').pop(); // Get the last part of the path which should be the suggestion ID
        
        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('Authorization');
        
        // Forward the request to the actual API
        const apiUrl = `http://54.153.132.144:8080/api/v1/suggestions/${suggestionID}`;
        
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
        console.error('Error in suggestions DELETE API proxy:', error);
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