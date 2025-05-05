'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { H2 } from '@/components/Typography';
import Button from '@/components/Button';
import ProgressSteps from '@/components/ProgressSteps';
import NavigationBar from '@/components/NavigationBar';

// Step components - reused from AddHousePage
import Step1General from '../../add/steps/Step1General';
import Step2Ekonomis from '../../add/steps/Step2Ekonomis';
import Step3Original from '../../add/steps/Step3Original';
import Step4Premium from '../../add/steps/Step4Premium';

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
  // Step 1: General
  houseNumber: number | string;
  landArea: number | string;
  buildingArea: number | string;
  buildingHeight: number | string;
  style: string;
  floor: number | string;
  rooms: number | string;
  object: File | null;
  houseImageFront: File | null;
  houseImageSide: File | null;
  houseImageBack: File | null;
  floorplans: Array<File | null>;
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

// Track which fields were modified
interface ModifiedFields {
  nonFileFields: boolean;
  object: boolean;
  houseImageFront: boolean;
  houseImageSide: boolean;
  houseImageBack: boolean;
  floorplans: boolean;
}

const EditHousePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
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

  // Track house ID from URL
  const [houseId, setHouseId] = useState<string>('');

  // Track original house data to compare with edited data
  const [originalHouseData, setOriginalHouseData] = useState<any>(null);

  // Track which fields were modified
  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({
    nonFileFields: false,
    object: false,
    houseImageFront: false,
    houseImageSide: false,
    houseImageBack: false,
    floorplans: false
  });

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
    object: null,
    houseImageFront: null,
    houseImageSide: null,
    houseImageBack: null,
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

  // Check for authentication and get houseId on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get ID from route params
    if (params?.id) {
      setHouseId(params.id as string);
      fetchHouseData(params.id as string, token);
    } else {
      router.push('/rumah');
    }
  }, [router, params?.id]);

  // Fetch house data by ID
  const fetchHouseData = async (id: string, token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rumah/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch house data');
      }

      const result = await response.json();
      if (result.code === 200) {
        const houseData = result.data;
        setOriginalHouseData(houseData);
        
        // Format budget ranges
        const budgets = {
          budget: `${formatCurrency(houseData.budgetMin[0])}-${formatCurrency(houseData.budgetMax[0])}`,
          budget1: `${formatCurrency(houseData.budgetMin[1])}-${formatCurrency(houseData.budgetMax[1])}`,
          budget2: `${formatCurrency(houseData.budgetMin[2])}-${formatCurrency(houseData.budgetMax[2])}`
        };

        // Extract materials
        const materials0 = extractMaterialIds(houseData.materials0);
        const materials1 = extractMaterialIds(houseData.materials1);
        const materials2 = extractMaterialIds(houseData.materials2);

        // Populate form data
        setFormData({
          houseNumber: houseData.houseNumber,
          landArea: houseData.landArea,
          buildingArea: houseData.buildingArea,
          buildingHeight: houseData.buildingHeight,
          style: houseData.style,
          floor: houseData.floor,
          rooms: houseData.rooms,
          object: null, // File objects will be null initially since we only have URLs
          houseImageFront: null,
          houseImageSide: null,
          houseImageBack: null,
          floorplans: Array(houseData.floor || 0).fill(null),
          designer: houseData.designer,
          budget: budgets.budget,
          materials0: materials0,
          budget1: budgets.budget1,
          materials1: materials1,
          budget2: budgets.budget2,
          materials2: materials2
        });

        // Now fetch materials for the form
        fetchMaterials(token);
      } else {
        setError('Failed to load house data. Please try again later.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching house data:', error);
      setError('An error occurred while fetching house data. Please try again later.');
      setIsLoading(false);
    }
  };

  // Helper function to format currency
  const formatCurrency = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Helper function to extract material IDs from materials object
  const extractMaterialIds = (materialsObj: any): string[] => {
    const materialIds: string[] = [];
    
    if (!materialsObj) return Array(10).fill('');

    // Iterate through categories and subcategories to extract material IDs
    Object.keys(materialsObj).forEach(category => {
      Object.keys(materialsObj[category]).forEach(subCategory => {
        const material = materialsObj[category][subCategory];
        if (material && material.id) {
          materialIds.push(material.id);
        }
      });
    });

    // Ensure we have 10 slots (padded with empty strings if needed)
    const paddedIds = [...materialIds];
    while (paddedIds.length < 10) {
      paddedIds.push('');
    }

    return paddedIds;
  };

  // Fetch materials data when component mounts using useCallback for proper dependency management
  const fetchMaterials = useCallback(async (token: string) => {
    setError(null);
    
    try {
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
          const newArray = [...prev[arrayName as keyof FormData] as string[]];
          // Update the value at the specified index
          newArray[index] = value;
          
          return {
            ...prev,
            [arrayName]: newArray
          };
        });

        // Mark non-file fields as modified
        setModifiedFields(prev => ({
          ...prev,
          nonFileFields: true
        }));
        
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
        
        // Mark non-file fields as modified
        setModifiedFields(prev => ({
          ...prev,
          nonFileFields: true
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

      // Mark non-file fields as modified
      setModifiedFields(prev => ({
        ...prev,
        nonFileFields: true
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

        // Mark floorplans as modified
        setModifiedFields(prev => ({
          ...prev,
          floorplans: true
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

    // Mark the specific file field as modified
    setModifiedFields(prev => ({
      ...prev,
      [fieldName]: true
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
        
        // Files validation is different for edit - they're not required if we already have them
        // We only validate if the user selected a new number of floors but didn't upload all floorplans
        if (modifiedFields.nonFileFields && 
            formData.floor && 
            Number(formData.floor) > originalHouseData.floor && 
            formData.floorplans.length < Number(formData.floor)) {
          // Check if we're missing any floorplans
          for (let i = 0; i < Number(formData.floor); i++) {
            // Only validate new floorplans (original count to new count)
            if (i >= originalHouseData.floor && !formData.floorplans[i]) {
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
      
      // Step 1: Update non-file fields if they were modified
      if (modifiedFields.nonFileFields) {
        // Parse budget ranges
        const budget = parseBudgetRange(convertedFormData.budget);
        const budget1 = parseBudgetRange(convertedFormData.budget1);
        const budget2 = parseBudgetRange(convertedFormData.budget2);
        
        // Create FormData for the PATCH API call
        const formDataForPatch = new FormData();
        
        // Add regular fields
        formDataForPatch.append('houseNumber', String(convertedFormData.houseNumber));
        formDataForPatch.append('landArea', String(convertedFormData.landArea));
        formDataForPatch.append('buildingArea', String(convertedFormData.buildingArea));
        formDataForPatch.append('buildingHeight', String(convertedFormData.buildingHeight));
        formDataForPatch.append('style', convertedFormData.style);
        formDataForPatch.append('floor', String(convertedFormData.floor));
        formDataForPatch.append('rooms', String(convertedFormData.rooms));
        formDataForPatch.append('designer', convertedFormData.designer);
        formDataForPatch.append('defaultBudget', String(originalHouseData.defaultBudget || 1));
        
        // Add array fields - budgets
        for (let i = 0; i < 3; i++) {
          const budgetMinValue = [budget.min, budget1.min, budget2.min][i];
          const budgetMaxValue = [budget.max, budget1.max, budget2.max][i];
          if (budgetMinValue) formDataForPatch.append(`budgetMin[${i}]`, String(budgetMinValue));
          if (budgetMaxValue) formDataForPatch.append(`budgetMax[${i}]`, String(budgetMaxValue));
        }
        
        // Add array fields - materials
        const materialsArrays = [
          convertedFormData.materials0.filter(Boolean),
          convertedFormData.materials1.filter(Boolean),
          convertedFormData.materials2.filter(Boolean)
        ];
        
        materialsArrays.forEach((materialsArray, arrayIndex) => {
          materialsArray.forEach((materialId: string | Blob, index: any) => {
            formDataForPatch.append(`materials${arrayIndex}[${index}]`, materialId);
          });
        });
        
        console.log('Updating non-file fields with PATCH using FormData');
        
        const patchResponse = await fetch(`/api/rumah/${houseId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataForPatch,
        });
        
        if (!patchResponse.ok) {
          if (patchResponse.status === 401 || patchResponse.status === 403) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            router.push('/login');
            return;
          }
          const errorResponse = await patchResponse.json();
          console.error('API Error:', errorResponse);
          throw new Error(`Failed to update house data: ${errorResponse.error || patchResponse.statusText}`);
        }
        
        console.log('Non-file fields updated successfully');
      }
      
      // Step 2: Upload files that were modified
      
      // Handle floorplan uploads if modified
      if (modifiedFields.floorplans && formData.floorplans.some(file => file !== null)) {
        const floorplanFormData = new FormData();
        floorplanFormData.append('suggestionId', houseId);
        
        // Track which floors have new floorplans
        const floorplanUpdates: number[] = [];
        
        // Append files with the same field name 'floorplans' in order
        formData.floorplans.forEach((file, index) => {
          if (file !== null) {
            floorplanFormData.append('floorplans', file); // Use consistent field name
            floorplanUpdates.push(index);
            console.log(`Added floorplan for floor ${index}: ${file.name}`);
          }
        });
        
        console.log(`Uploading ${floorplanUpdates.length} floorplans`);
        
        const floorplanResponse = await fetch('/api/rumah/upload-floorplans', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: floorplanFormData,
        });
        
        if (!floorplanResponse.ok) {
          if (floorplanResponse.status === 401 || floorplanResponse.status === 403) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            router.push('/login');
            return;
          }
          console.error('Failed to upload floorplans:', await floorplanResponse.json());
        } else {
          console.log('Floorplans uploaded successfully');
        }
      }
      
      // Handle single file uploads if modified
      const fileUploads = [
        { field: 'object', modified: modifiedFields.object, type: 'house_object' },
        { field: 'houseImageFront', modified: modifiedFields.houseImageFront, type: 'house_image_front' },
        { field: 'houseImageSide', modified: modifiedFields.houseImageSide, type: 'house_image_side' },
        { field: 'houseImageBack', modified: modifiedFields.houseImageBack, type: 'house_image_back' }
      ];
      
      for (const upload of fileUploads) {
        const file = convertedFormData[upload.field] as File | null;
        if (upload.modified && file) {
          const fileFormData = new FormData();
          fileFormData.append('suggestionId', houseId);
          fileFormData.append('file', file);
          fileFormData.append('type', upload.type);
          
          console.log(`Uploading ${upload.type}: ${file.name} (${file.size} bytes)`);
          
          const fileResponse = await fetch('/api/rumah/upload-file', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: fileFormData,
          });
          
          if (!fileResponse.ok) {
            if (fileResponse.status === 401 || fileResponse.status === 403) {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              router.push('/login');
              return;
            }
            console.error(`Failed to upload ${upload.type}:`, await fileResponse.json());
          } else {
            console.log(`${upload.type} uploaded successfully`);
          }
        }
      }
      
      // All updates completed, redirect to house listing page
      router.push('/rumah');
      
    } catch (error) {
      console.error('Error updating house data:', error);
      alert('Terjadi kesalahan saat memperbarui data rumah. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading message while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <div className="container mx-auto px-4 py-6 flex-1 flex justify-center items-center">
          <div className="text-center">
            <p className="text-custom-olive-50 text-lg">Loading house data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Show error message if fetching data failed
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <div className="container mx-auto px-4 py-6 flex-1">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              title='Back to Houses'
              variant='primary'
              onPress={() => router.push('/rumah')}
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
            isEditing={true}
            originalFiles={{
              object: originalHouseData?.object || null,
              houseImageFront: originalHouseData?.houseImageFront || null,
              houseImageSide: originalHouseData?.houseImageSide || null,
              houseImageBack: originalHouseData?.houseImageBack || null,
              floorplans: originalHouseData?.floorplans || null
            }}
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
          <H2 className="text-custom-green-500 mb-8">Edit Rumah</H2>
          
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

export default EditHousePage;