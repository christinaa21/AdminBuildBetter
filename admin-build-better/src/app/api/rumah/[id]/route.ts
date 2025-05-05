import { NextRequest } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the material ID from params
    const { id: suggestionID } = await params;
    
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    
    // Forward the request to the actual API
    const response = await fetch(`http://54.153.132.144:8080/api/v1/suggestions/${suggestionID}`, {
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
    console.error('Error in suggestion GET by ID API proxy:', error);
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
    // Get the suggestion ID from params
    const { id: suggestionID } = await params;
    
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
    const jsonData: any = {};
    
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
      // Handle numeric fields
      else if (key === 'houseNumber' || key === 'landArea' || key === 'buildingArea' || 
                key === 'floor' || key === 'rooms' || key === 'buildingHeight' || 
                key === 'defaultBudget') {
        jsonData[key] = Number(value);
      }
      else {
        // Handle other string fields
        jsonData[key] = value.toString();
      }
    }
    
    // Only add non-empty arrays to the final object
    if (budgetMinArray.filter(item => item !== 0).length > 0) {
      jsonData.budgetMin = budgetMinArray.filter(item => item !== 0);
    }
    if (budgetMaxArray.filter(item => item !== 0).length > 0) {
      jsonData.budgetMax = budgetMaxArray.filter(item => item !== 0);
    }
    if (materials0Array.filter(item => item !== "").length > 0) {
      jsonData.materials0 = materials0Array.filter(item => item !== "");
    }
    if (materials1Array.filter(item => item !== "").length > 0) {
      jsonData.materials1 = materials1Array.filter(item => item !== "");
    }
    if (materials2Array.filter(item => item !== "").length > 0) {
      jsonData.materials2 = materials2Array.filter(item => item !== "");
    }

    // Log the final JSON data being sent to the API
    console.log('Sending JSON to API:', JSON.stringify(jsonData, null, 2));
    
    // Forward the request to the actual API with JSON
    const response = await fetch(`http://54.153.132.144:8080/api/v1/suggestions/${suggestionID}`, {
      method: 'PATCH',
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
    console.error('Error in suggestion PATCH API proxy:', error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the suggestion ID from the route params
    const suggestionID = params.id;
    
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
    
    // Get the response data (safely handle JSON parsing)
    let data;
    
    try {
      // Only try to parse JSON if there's content
      const text = await response.text();
      data = text ? JSON.parse(text) : { code: response.status, status: response.ok ? 'SUCCESS' : 'ERROR' };
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      // Provide a fallback response
      data = { 
        code: response.status, 
        status: response.ok ? 'SUCCESS' : 'ERROR',
        message: 'Operation completed, but no valid JSON response was received'
      };
    }
    
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
      error: 'An error occurred while processing your request',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
}