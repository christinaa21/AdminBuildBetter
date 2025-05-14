/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { H2 } from '@/components/Typography';
import Button from '@/components/Button';
import ProgressSteps from '@/components/ProgressSteps';
import NavigationBar from '@/components/NavigationBar';

// Step components
import Step1General from './steps/Step1General';
import Step2Ekonomis from './steps/Step2Ekonomis';
import Step3Original from './steps/Step3Original';
import Step4Premium from './steps/Step4Premium';

// Define Material interface
interface Material {
  id: string;
  name: string;
  category: string;
  subcategory: string;
}

// Define MaterialCategory interface for structured material data
interface MaterialSubCategory {
  subCategory: string;
  materials: Material[];
}

interface MaterialCategory {
  category: string;
  subCategories: MaterialSubCategory[];
}

// Define the comprehensive form data interface that includes all fields from all steps
interface FormData {
  // Step 1: General (updated to match Step1General component)
  houseNumber: number | string;
  landArea: number | string;
  buildingArea: number | string;
  buildingHeight: number | string;
  style: string;
  floor: number | string;
  rooms: number | string;
  windDirection: string[];
  object: File | null;
  houseImageFront: File | null;
  houseImageSide: File | null;
  houseImageBack: File | null;
  floorplans: Array<File | null>;
  pdf: File | null;
  designer: string;
  
  // Step 2: Ekonomis
  budget: string;
  materials0: string[];
  
  // Step 3: Original
  budget1: string;
  materials1: string[];
  
  // Step 4: Premium
  budget2: string;
  materials2: string[];
}

const AddHousePage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const steps = ['Informasi Dasar', 'Material Ekonomis', 'Material Original', 'Material Premium'];
  
  // State for materials data from API
  const [materialCategories, setMaterialCategories] = useState<MaterialCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // State for loading status during submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Main form state - all fields from all steps
  const [formData, setFormData] = useState<FormData>({
    // Step 1: General - Using empty strings as initial values for numeric fields
    houseNumber: '',
    landArea: '',
    buildingArea: '',
    buildingHeight: '',
    style: '',
    floor: '',
    rooms: '',
    windDirection: [],
    object: null,
    houseImageFront: null,
    houseImageSide: null,
    houseImageBack: null,
    pdf: null,
    floorplans: [],
    designer: '',
    
    // Step 2: Ekonomis
    budget: '',
    materials0: Array(10).fill(''),
    
    // Step 3: Original
    budget1: '',
    materials1: Array(10).fill(''),
    
    // Step 4: Premium
    budget2: '',
    materials2: Array(10).fill(''),
  });

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if no token is found
      router.push('/login');
    }
  }, [router]);

  // Fetch materials data when component mounts using useCallback for proper dependency management
  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Use Next.js API route as a proxy to avoid CORS issues
      const response = await fetch('/api/materials?grouped=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch materials');
      }
      
      const result = await response.json();
      
      if (result.code === 200) {
        // Process and store the material data
        setMaterialCategories(result.data);
      } else {
        setError('Failed to load materials. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('An error occurred while fetching materials. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Fetch materials on component mount
  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Convert the hierarchical material categories into a flat record for easy access
  const processMaterialsForComponents = useCallback(() => {
    const materialsRecord: Record<string, Material[]> = {};
    
    materialCategories.forEach(category => {
      category.subCategories.forEach(subCat => {
        // Create or append to the category entry
        const categoryKey = category.category;
        if (!materialsRecord[categoryKey]) {
          materialsRecord[categoryKey] = [];
        }
        
        // Add materials from this subcategory, excluding image data
        subCat.materials.forEach(material => {
          materialsRecord[categoryKey].push({
            id: material.id,
            name: material.name,
            category: material.category,
            subcategory: subCat.subCategory,
          });
        });
      });
    });
    
    return materialsRecord;
  }, [materialCategories]);
  
  // Process materials for component use
  const processedMaterials = processMaterialsForComponents();

  // Handle form field changes for any step
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    // Handle array fields (materials0, materials1, materials2)
    if (name.includes('[') && name.includes(']')) {
      const arrayName = name.split('[')[0]; // e.g., "materials0"
      const indexMatch = name.match(/\[(\d+)\]/);
      
      if (indexMatch && indexMatch[1]) {
        const index = parseInt(indexMatch[1]);
        
        setFormData(prev => {
          // Create a copy of the specific array
          const newArray = [...prev[arrayName as keyof FormData] as any[]];
          // Update the value at the specified index - now value can be an array or string
          newArray[index] = value;
          
          return {
            ...prev,
            [arrayName]: newArray
          };
        });
        return;
      }
    }
    
    // List of numeric fields that should allow decimal input
    const numericFields = ['houseNumber', 'landArea', 'buildingArea', 'buildingHeight', 'floor', 'rooms'];

    if (numericFields.includes(name)) {
      // For numeric fields, validate the input with regex
      // This regex allows empty strings, valid integers, and valid decimals
      const regex = /^$|^[0-9]*\.?[0-9]*$/;
      
      if (regex.test(value)) {
        // If valid, update the state directly as a string
        setFormData(prev => ({
          ...prev,
          [name]: value,
        }));
        
        // Clear error for this field if there is a value
        if (value !== '') {
          const newErrors = {...errors};
          delete newErrors[name];
          setErrors(newErrors);
        }
      }
    } else {
      // For non-numeric fields, update normally
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Function to handle file uploads
  const handleFileChange = (fieldName: string, files: FileList | null): void => {
    if (!files || files.length === 0) return;
    
    // Handle special case for floorplans array
    if (fieldName.startsWith('floorplans[')) {
      const indexMatch = fieldName.match(/\[(\d+)\]/);
      if (indexMatch && indexMatch[1]) {
        const index = parseInt(indexMatch[1]);
        // Create a copy of the current floorplans array
        const newFloorplans = [...formData.floorplans];
        
        // Ensure array is big enough
        while (newFloorplans.length <= index) {
          newFloorplans.push(null);
        }
        
        newFloorplans[index] = files[0];
        
        setFormData(prev => ({
          ...prev,
          floorplans: newFloorplans,
        }));
        
        // Clear error for this field
        const newErrors = {...errors};
        delete newErrors[`floorplans[${index}]`];
        setErrors(newErrors);
        
        return;
      }
    }
    
    // Handle regular file fields
    setFormData(prev => ({
      ...prev,
      [fieldName]: files[0], // Only take the first file
    }));
    
    // Clear error for this field
    const newErrors = {...errors};
    delete newErrors[fieldName];
    setErrors(newErrors);
  };

  // Validate the current step before proceeding
  const validateCurrentStep = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 0: // Step 1: General
        // Validate number fields
        if (!formData.houseNumber || String(formData.houseNumber).trim() === '' || 
            (typeof formData.houseNumber === 'string' && parseFloat(formData.houseNumber) <= 0)) {
          newErrors.houseNumber = "Nomor rumah wajib diisi";
          isValid = false;
        }
        
        if (!formData.landArea || String(formData.landArea).trim() === '' || 
            (typeof formData.landArea === 'string' && parseFloat(formData.landArea) <= 0)) {
          newErrors.landArea = "Luas tanah wajib diisi";
          isValid = false;
        }
        
        if (!formData.buildingArea || String(formData.buildingArea).trim() === '' || 
            (typeof formData.buildingArea === 'string' && parseFloat(formData.buildingArea) <= 0)) {
          newErrors.buildingArea = "Luas bangunan wajib diisi";
          isValid = false;
        }
        
        if (!formData.buildingHeight || String(formData.buildingHeight).trim() === '' || 
            (typeof formData.buildingHeight === 'string' && parseFloat(formData.buildingHeight) <= 0)) {
          newErrors.buildingHeight = "Tinggi bangunan wajib diisi";
          isValid = false;
        }
        
        // Validate selects
        if (!formData.style) {
          newErrors.style = "Gaya desain wajib dipilih";
          isValid = false;
        }
        
        if (!formData.floor || String(formData.floor).trim() === '') {
          newErrors.floor = "Jumlah lantai wajib dipilih";
          isValid = false;
        }
        
        if (!formData.rooms || String(formData.rooms).trim() === '') {
          newErrors.rooms = "Jumlah kamar wajib dipilih";
          isValid = false;
        }
        
        if (formData.windDirection.length === 0) {
          newErrors.windDirection = "Arah mata angin wajib dipilih";
          isValid = false;
        }
        
        // Validate required files
        if (!formData.object) {
          newErrors.object = "3D rumah wajib diunggah";
          isValid = false;
        }
        
        if (!formData.houseImageFront) {
          newErrors.houseImageFront = "Tampak depan wajib diunggah";
          isValid = false;
        }
        
        if (!formData.houseImageSide) {
          newErrors.houseImageSide = "Tampak samping wajib diunggah";
          isValid = false;
        }
        
        if (!formData.houseImageBack) {
          newErrors.houseImageBack = "Tampak belakang wajib diunggah";
          isValid = false;
        }
        
        // Validate floor plans based on floor count
        if (formData.floor && Number(formData.floor) > 0) {
          for (let i = 0; i < Number(formData.floor); i++) {
            if (!formData.floorplans[i]) {
              newErrors[`floorplans[${i}]`] = `Denah lantai ${i+1} wajib diunggah`;
              isValid = false;
            }
          }
        }
        
        // Validate designer
        if (!formData.designer) {
          newErrors.designer = "Nama arsitek wajib diisi";
          isValid = false;
        }
        break;
        
      case 1: // Step 2: Ekonomis
        if (!formData.budget) {
          newErrors.budget = "Rentang budget wajib diisi";
          isValid = false;
        }
        
        // Check if all materials are selected
        formData.materials0.forEach((material, index) => {
          if (!material) {
            newErrors[`materials0[${index}]`] = "Material wajib dipilih";
            isValid = false;
          }
        });
        break;
        
      case 2: // Step 3: Original
        if (!formData.budget1) {
          newErrors.budget1 = "Rentang budget original wajib diisi";
          isValid = false;
        }
        
        // Check if all materials are selected
        formData.materials1.forEach((material, index) => {
          if (!material) {
            newErrors[`materials1[${index}]`] = "Material wajib dipilih";
            isValid = false;
          }
        });
        break;
        
      case 3: // Step 4: Premium
        if (!formData.budget2) {
          newErrors.budget2 = "Rentang budget premium wajib diisi";
          isValid = false;
        }
        
        // Check if all materials are selected
        formData.materials2.forEach((material, index) => {
          if (!material) {
            newErrors[`materials2[${index}]`] = "Material wajib dipilih";
            isValid = false;
          }
        });
        break;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Move to next step
  const handleNextStep = (): void => {
    if (!validateCurrentStep()) {
      // If there are validation errors, don't proceed
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // Move to previous step
  const handlePrevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Parse budget string to min and max values
  const parseBudgetRange = (budgetString: string): { min: number, max: number } => {
    const parts = budgetString.split('-').map(part => parseInt(part.trim().replace(/\D/g, '')));
    return {
      min: parts[0] || 0,
      max: parts[1] || 0
    };
  };

  // Convert form data string values to numbers for submission
  const prepareFormDataForSubmission = (): any => {
    // Fields that need to be converted to numbers
    const numericFields = ['houseNumber', 'landArea', 'buildingArea', 'buildingHeight', 'floor', 'rooms'];
    
    const convertedData: any = { ...formData };
    
    // Convert string values to numbers for these fields
    numericFields.forEach(field => {
      if (convertedData[field] !== '' && convertedData[field] !== null && convertedData[field] !== undefined) {
        convertedData[field] = parseFloat(String(convertedData[field]));
      }
    });

    // Process material arrays to ensure all IDs are in a flat array
    ['materials0', 'materials1', 'materials2'].forEach(materialField => {
      const materialArray = convertedData[materialField];
      if (Array.isArray(materialArray)) {
        const flattenedMaterials: string[] = [];
        
        materialArray.forEach(item => {
          if (Array.isArray(item)) {
            // If the item is an array, add all elements
            flattenedMaterials.push(...item);
          } else if (typeof item === 'string') {
            if (item.includes(',')) {
              // If it's a comma-separated string (legacy format), split and add each part
              flattenedMaterials.push(...item.split(',').filter(Boolean));
            } else if (item) {
              // If it's a single ID, add it
              flattenedMaterials.push(item);
            }
          }
        });
        
        // Replace the original array with the flattened one
        convertedData[materialField] = flattenedMaterials.filter(Boolean);
      }
    });
    
    return convertedData;
  };

  // Submit the form data to your backend
  const handleSubmit = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      
      // Get token for authorization
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Convert string values to numbers before submission
      const convertedFormData = prepareFormDataForSubmission();
      
      // Parse budget ranges
      const budget = parseBudgetRange(convertedFormData.budget);
      const budget1 = parseBudgetRange(convertedFormData.budget1);
      const budget2 = parseBudgetRange(convertedFormData.budget2);
      
      // Prepare JSON data for the initial API call
      const initialData = {
        houseNumber: convertedFormData.houseNumber,
        landArea: convertedFormData.landArea,
        buildingArea: convertedFormData.buildingArea,
        buildingHeight: convertedFormData.buildingHeight,
        style: convertedFormData.style,
        floor: convertedFormData.floor,
        rooms: convertedFormData.rooms,
        windDirection: convertedFormData.windDirection,
        designer: convertedFormData.designer,
        defaultBudget: 1, // As specified, always set to 1
        budgetMin: [budget.min, budget1.min, budget2.min],
        budgetMax: [budget.max, budget1.max, budget2.max],
        materials0: convertedFormData.materials0.filter(Boolean), // Filter out empty strings
        materials1: convertedFormData.materials1.filter(Boolean),
        materials2: convertedFormData.materials2.filter(Boolean)
      };
      
      // Create FormData object for the API that expects FormData
      const formDataToSend = new FormData();
      
      // Append all initial data fields
      Object.entries(initialData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // For arrays, use indexed notation
          value.forEach((item, index) => {
            formDataToSend.append(`${key}[${index}]`, item.toString());
          });
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });
      
      console.log('Sending initial data:', initialData);
      
      const initialResponse = await fetch('/api/rumah', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
      });
      
      if (!initialResponse.ok) {
        if (initialResponse.status === 401 || initialResponse.status === 403) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          router.push('/login');
          return;
        }
        const errorResponse = await initialResponse.json();
        console.error('API Error:', errorResponse);
        throw new Error(`Failed to submit initial house data: ${errorResponse.error || initialResponse.statusText}`);
      }
      
      const initialResult = await initialResponse.json();
      const suggestionId = initialResult.data;
      
      if (!suggestionId) {
        throw new Error('No suggestion ID returned from API');
      }
      
      console.log('Initial house data submitted successfully, ID:', suggestionId);
      
      // Step 2: Upload floorplans if there are any
      if (convertedFormData.floorplans.length > 0 && convertedFormData.floorplans.some((file: File | null) => file !== null)) {
        const floorplanFormData = new FormData();
        floorplanFormData.append('suggestionId', suggestionId);
        
        // Only append valid floorplans with proper naming
        const validFloorplans = convertedFormData.floorplans.filter((file: File | null) => file !== null);
        
        console.log(`Uploading ${validFloorplans.length} floorplans`);
        
        // Important: Use the same field name for each file (not array notation)
        validFloorplans.forEach((file: File, index: number) => {
          if (file !== null) {
            floorplanFormData.append('floorplans', file);
            console.log(`Added floorplan ${index+1}: ${file.name} (${file.size} bytes)`);
          }
        });
        
        const floorplanResponse = await fetch('/api/rumah/upload-floorplans', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: floorplanFormData,
        });
        
        const floorplanResult = await floorplanResponse.json();
        
        if (!floorplanResponse.ok) {
          if (floorplanResponse.status === 401 || floorplanResponse.status === 403) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            router.push('/login');
            return;
          }
          console.error('Failed to upload floorplans:', floorplanResult);
          // Continue with other uploads even if this fails
        } else {
          console.log('Floorplans uploaded successfully:', floorplanResult);
        }
      }
      
      // Step 3: Upload 3D house object if it exists
      if (convertedFormData.object) {
        const objectFormData = new FormData();
        objectFormData.append('suggestionId', suggestionId);
        objectFormData.append('file', convertedFormData.object);
        objectFormData.append('type', 'house_object');
        
        console.log(`Uploading 3D object: ${convertedFormData.object.name} (${convertedFormData.object.size} bytes)`);
        
        const objectResponse = await fetch('/api/rumah/upload-file', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: objectFormData,
        });
        
        const objectResult = await objectResponse.json();
        
        if (!objectResponse.ok) {
          if (objectResponse.status === 401 || objectResponse.status === 403) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            router.push('/login');
            return;
          }
          console.error('Failed to upload house 3D object:', objectResult);
        } else {
          console.log('House 3D object uploaded successfully:', objectResult);
        }
      }
      
      // Step 4-6: Upload house images
      const imageUploads = [
        { field: 'houseImageFront', type: 'house_image_front' },
        { field: 'houseImageSide', type: 'house_image_side' },
        { field: 'houseImageBack', type: 'house_image_back' }
      ];
      
      for (const upload of imageUploads) {
        const file = convertedFormData[upload.field] as File | null;
        if (file) {
          const imageFormData = new FormData();
          imageFormData.append('suggestionId', suggestionId);
          imageFormData.append('file', file);
          imageFormData.append('type', upload.type);
          
          console.log(`Uploading ${upload.type}: ${file.name} (${file.size} bytes)`);
          
          const imageResponse = await fetch('/api/rumah/upload-file', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: imageFormData,
          });
          
          const imageResult = await imageResponse.json();
          
          if (!imageResponse.ok) {
            if (imageResponse.status === 401 || imageResponse.status === 403) {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              router.push('/login');
              return;
            }
            console.error(`Failed to upload ${upload.type}:`, imageResult);
          } else {
            console.log(`${upload.type} uploaded successfully:`, imageResult);
          }
        }
      }
      
      // Step 7: Upload pdf if it exists
      if (convertedFormData.pdf) {
        const pdfFormData = new FormData();
        pdfFormData.append('suggestionId', suggestionId);
        pdfFormData.append('file', convertedFormData.pdf);
        pdfFormData.append('type', 'pdf');
        
        console.log(`Uploading house design pdf: ${convertedFormData.pdf.name} (${convertedFormData.pdf.size} bytes)`);
        
        const pdfResponse = await fetch('/api/rumah/upload-file', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: pdfFormData,
        });
        
        const pdfResult = await pdfResponse.json();
        
        if (!pdfResponse.ok) {
          if (pdfResponse.status === 401 || pdfResponse.status === 403) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            router.push('/login');
            return;
          }
          console.error('Failed to upload house design pdf:', pdfResult);
        } else {
          console.log('House design pdf uploaded successfully:', pdfResult);
        }
      }

      // All uploads completed, redirect to success page
      router.push('/rumah');
      
    } catch (error) {
      console.error('Error submitting house data:', error);
      alert('Terjadi kesalahan saat mengirim data rumah. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading message while fetching materials
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <div className="container mx-auto px-4 py-6 flex-1 flex justify-center items-center">
          <div className="text-center">
            <p className="text-custom-olive-50 text-lg">Loading materials...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Show error message if fetching materials failed
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <div className="container mx-auto px-4 py-6 flex-1">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              title='Try Again'
              variant='primary'
              onPress={fetchMaterials}
            />
          </div>
        </div>
      </div>
    );
  }

  // Render the current step
  const renderStep = (): React.ReactNode => {
    switch (currentStep) {
      case 0:
        return (
          <Step1General 
            formData={formData} 
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 1:
        return (
          <Step2Ekonomis 
            formData={{
              budget: formData.budget,
              materials0: formData.materials0
            }}
            handleChange={handleChange}
            errors={errors}
            setErrors={setErrors}
            materials={processedMaterials}
            setMaterials={setMaterialCategories}
          />
        );
      case 2:
        return (
          <Step3Original 
            formData={{
              budget1: formData.budget1,
              materials1: formData.materials1
            }}
            handleChange={handleChange}
            errors={errors}
            setErrors={setErrors}
            materials={processedMaterials}
          />
        );
      case 3:
        return (
          <Step4Premium 
            formData={{
              budget2: formData.budget2,
              materials2: formData.materials2
            }}
            handleChange={handleChange}
            errors={errors}
            setErrors={setErrors}
            materials={processedMaterials}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          {currentStep === 0 ? (
            <Link href="/rumah" className="inline-flex items-center text-custom-green-300 mb-6">
              <FaArrowLeft className="w-5 h-5 mr-2" />
            </Link>
          ) : (
            <button 
              onClick={handlePrevStep}
              className="inline-flex items-center text-custom-green-300 mb-6"
            >
              <FaArrowLeft className="w-5 h-5 mr-2" />
            </button>
          )}
          
          {/* Page title */}
          <H2 className="text-custom-green-500 mb-8">Tambah Rumah</H2>
          
          {/* Progress steps */}
          <ProgressSteps
            steps={steps}
            currentStep={currentStep}
          />
          
          {/* Form */}
          <div className="mt-8">
            {renderStep()}
            
            {/* Navigation buttons */}
            <div className="flex justify-center mt-8">
              <Button 
                title={currentStep === steps.length - 1 ? "Simpan" : "Selanjutnya"} 
                variant="primary"
                fullWidth
                className="py-3"
                onClick={handleNextStep}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHousePage;
