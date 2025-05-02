'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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

// Define the comprehensive form data interface that includes all fields from all steps
interface FormData {
  // Step 1: General
  architectName: string;
  landArea: string;
  designStyle: string;
  floors: string;
  rooms: string;
  houseDesignFile: File | null;
  floorPlanFile: File | null;
  frontDesignFile: File | null;
  sideDesignFile: File | null;
  backDesignFile: File | null;
  floorPlan2File: File | null;
  
  // Step 2: Ekonomis
  budgetPerMeter?: string;
  roofType?: string;
  roofStructure?: string;
  ceiling?: string;
  wallCovering?: string;
  wallStructure?: string;
  floorCovering?: string;
  doorType?: string;
  windowGlass?: string;
  windowFrame?: string;
  foundationType?: string;
  foundationMaterial?: string;
  structureMaterial?: string;
  
  // Step 3: Original
  originalBudgetPerMeter?: string;
  originalRoofType?: string;
  originalRoofStructure?: string;
  originalCeiling?: string;
  originalWallCovering?: string;
  originalWallStructure?: string;
  originalFloorCovering?: string;
  originalDoorType?: string;
  originalWindowGlass?: string;
  originalWindowFrame?: string;
  originalFoundationType?: string;
  originalFoundationMaterial?: string;
  originalStructureMaterial?: string;
  
  // Step 4: Premium
  premiumBudgetPerMeter?: string;
  premiumRoofType?: string;
  premiumRoofStructure?: string;
  premiumCeiling?: string;
  premiumWallCovering?: string;
  premiumWallStructure?: string;
  premiumFloorCovering?: string;
  premiumDoorType?: string;
  premiumWindowGlass?: string;
  premiumWindowFrame?: string;
  premiumFoundationType?: string;
  premiumFoundationMaterial?: string;
  premiumStructureMaterial?: string;
}

const AddHousePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const steps = ['Informasi Dasar', 'Material Ekonomis', 'Material Original', 'Material Premium'];

  // Main form state - all fields from all steps
  const [formData, setFormData] = useState<FormData>({
    // Step 1: General
    architectName: '',
    landArea: '',
    designStyle: '',
    floors: '',
    rooms: '',
    houseDesignFile: null,
    floorPlanFile: null,
    frontDesignFile: null,
    sideDesignFile: null,
    backDesignFile: null,
    floorPlan2File: null,
    
    // Step 2: Ekonomis (other fields will have undefined values by default)
    budgetPerMeter: '',
    roofType: '',
    roofStructure: '',
    ceiling: '',
    wallCovering: '',
    wallStructure: '',
    floorCovering: '',
    doorType: '',
    windowGlass: '',
    windowFrame: '',
    foundationType: '',
    foundationMaterial: '',
    structureMaterial: '',
    
    // Step 3: Original
    originalBudgetPerMeter: '',
    originalRoofType: '',
    originalRoofStructure: '',
    originalCeiling: '',
    originalWallCovering: '',
    originalWallStructure: '',
    originalFloorCovering: '',
    originalDoorType: '',
    originalWindowGlass: '',
    originalWindowFrame: '',
    originalFoundationType: '',
    originalFoundationMaterial: '',
    originalStructureMaterial: '',
    
    // Step 4: Premium
    premiumBudgetPerMeter: '',
    premiumRoofType: '',
    premiumRoofStructure: '',
    premiumCeiling: '',
    premiumWallCovering: '',
    premiumWallStructure: '',
    premiumFloorCovering: '',
    premiumDoorType: '',
    premiumWindowGlass: '',
    premiumWindowFrame: '',
    premiumFoundationType: '',
    premiumFoundationMaterial: '',
    premiumStructureMaterial: ''
  });

  // Handle form field changes for any step
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle file uploads
  const handleFileChange = (fieldName: string, files: FileList | null): void => {
    if (!files || files.length === 0) return;
    
    setFormData({
      ...formData,
      [fieldName]: files[0], // Only take the first file
    });
  };

  // Move to next step
  const handleNextStep = (): void => {
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

  // Submit the form data to your backend
  const handleSubmit = async (): Promise<void> => {
    // Create FormData for API submission
    const data = new FormData();
    
    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        data.append(key, value);
      }
    });
    
    // Append file fields
    if (formData.houseDesignFile) data.append('houseDesignFile', formData.houseDesignFile);
    if (formData.floorPlanFile) data.append('floorPlanFile', formData.floorPlanFile);
    if (formData.frontDesignFile) data.append('frontDesignFile', formData.frontDesignFile);
    if (formData.sideDesignFile) data.append('sideDesignFile', formData.sideDesignFile);
    if (formData.backDesignFile) data.append('backDesignFile', formData.backDesignFile);
    if (formData.floorPlan2File) data.append('floorPlan2File', formData.floorPlan2File);
    
    try {
      // Replace with your API endpoint
      const response = await fetch('/api/houses', {
        method: 'POST',
        body: data,
      });
      
      if (response.ok) {
        // Redirect on success
        window.location.href = '/rumah';
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Render the current step
  const renderStep = (): React.ReactNode => {
    switch (currentStep) {
      case 0:
        return (
          <Step1General 
            formData={formData} 
            handleChange={handleChange}
            handleFileChange={handleFileChange}
          />
        );
      case 1:
        return (
          <Step2Ekonomis 
            formData={formData} 
            handleChange={handleChange} 
          />
        );
      case 2:
        return (
          <Step3Original 
            formData={formData} 
            handleChange={handleChange} 
          />
        );
      case 3:
        return (
          <Step4Premium 
            formData={formData} 
            handleChange={handleChange} 
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHousePage;