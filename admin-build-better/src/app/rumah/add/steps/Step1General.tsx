import React, { useEffect } from 'react';

interface Step1GeneralProps {
  formData: {
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
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFileChange: (fieldName: string, files: FileList | null) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isEditing?: boolean;
  originalFiles?: {
    object: string | null;
    houseImageFront: string | null;
    houseImageSide: string | null;
    houseImageBack: string | null;
    floorplans: string[] | null;
  };
}

const Step1General: React.FC<Step1GeneralProps> = ({ 
  formData, 
  handleChange, 
  handleFileChange, 
  errors, 
  setErrors,
  isEditing = false,
  originalFiles 
}) => {
  // Simplified numeric input handler
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Allow empty values or valid numeric inputs (including decimal points)
    // This regex allows empty strings, valid integers, and valid decimals (including intermediate states)
    const regex = /^$|^[0-9]*\.?[0-9]*$/;
    
    if (regex.test(value)) {
      handleChange(e);
      
      // Clear error for this field if there is a value
      if (value !== '') {
        const newErrors = {...errors};
        delete newErrors[name];
        setErrors(newErrors);
      }
    }
  };

  // Modified file display logic
  const getFileName = (field: 'object' | 'houseImageFront' | 'houseImageSide' | 'houseImageBack'): string => {
    if (formData[field]) return (formData[field] as File).name;
    if (isEditing && originalFiles?.[field]) return originalFiles[field]!.split('/').pop() || '';
    return "Unggah disini";
  };  

  // Modified floorplan display logic
  const getFloorplanName = (index: number): string => {
    if (formData.floorplans[index]) return formData.floorplans[index]!.name;
    if (isEditing && originalFiles?.floorplans?.[index]) 
      return originalFiles.floorplans[index]!.split('/').pop() || '';
    return "Unggah disini";
  };

  // Modified to only validate floor plan fields when floor count changes
  useEffect(() => {
    if (formData.floor) {
      // Only validate floor plan fields, not the entire form
      validateFloorPlans();
    }
  }, [formData.floor]);

  // New function to validate only floor plans
  const validateFloorPlans = () => {
    if (!formData.floor || Number(formData.floor) <= 0) return;
    
    const newErrors = {...errors};
    
    // Clear any existing floor plan errors first
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith('floorplans[')) {
        delete newErrors[key];
      }
    });
    
    // Add errors for missing floor plans
    for (let i = 0; i < Number(formData.floor); i++) {
      const hasOriginal = originalFiles?.floorplans?.[i];
      const hasNew = formData.floorplans[i];
      
      if (!hasOriginal && !hasNew) {
        newErrors[`floorplans[${i}]`] = `Denah lantai ${i+1} wajib diunggah`;
      }
    }
    
    setErrors(newErrors);
  };

  // Custom function to handle floorplan updates properly
  const handleFloorplanChange = (index: number, files: FileList | null) => {
    if (files && files.length > 0) {
      // Extract the floorplan index from the field name
      const newErrors = {...errors};
      delete newErrors[`floorplans[${index}]`];
      setErrors(newErrors);
      
      // Now call the parent's handleFileChange with the correctly formatted field name
      handleFileChange(`floorplans[${index}]`, files);
    }
  };

  // Create floor plan upload fields based on floor count
  const renderFloorPlanUploads = () => {
    if (!formData.floor || Number(formData.floor) === 0) return null;
    
    const uploads = [];
    for (let i = 0; i < Number(formData.floor); i++) {
      uploads.push(
        <div className="mb-6" key={`floorplan-${i}`}>
          <label className="block text-custom-green-400 mb-2">
            Denah Lantai {i+1}
            {errors[`floorplans[${i}]`] && (
              <span className="text-red-500 text-sm ml-2">*{errors[`floorplans[${i}]`]}</span>
            )}
          </label>
          <label className={`w-full flex items-center justify-between border ${errors[`floorplans[${i}]`] ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 text-custom-green-300 cursor-pointer`}>
            <span>
              {getFloorplanName(i)}
            </span>
            <input
              type="file"
              name={`floorplans[${i}]`}
              accept="image/*"
              onChange={(e) => handleFloorplanChange(i, e.target.files)}
              className="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </label>
        </div>
      );
    }
    return uploads;
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-custom-green-500 mb-6">Preferensi Desain</h2>
      
      {/* House Number */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Nomor Rumah di Sheet
          {errors.houseNumber && <span className="text-red-500 text-sm ml-2">*{errors.houseNumber}</span>}
        </label>
        <input
          type="text"
          name="houseNumber"
          value={formData.houseNumber}
          onChange={handleNumericChange}
          placeholder="Tulis disini"
          className={`w-full border ${errors.houseNumber ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
        />
      </div>

      {/* Land Area */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Luas Lahan (m2)
          {errors.landArea && <span className="text-red-500 text-sm ml-2">*{errors.landArea}</span>}
        </label>
        <input
          type="text"
          name="landArea"
          value={formData.landArea}
          onChange={handleNumericChange}
          placeholder="Tulis disini"
          className={`w-full border ${errors.landArea ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
        />
      </div>

      {/* Building Area */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Luas Bangunan (m2)
          {errors.buildingArea && <span className="text-red-500 text-sm ml-2">*{errors.buildingArea}</span>}
        </label>
        <input
          type="text"
          name="buildingArea"
          value={formData.buildingArea}
          onChange={handleNumericChange}
          placeholder="Tulis disini"
          className={`w-full border ${errors.buildingArea ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
        />
      </div>

      {/* Building Height */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Tinggi Bangunan (m)
          {errors.buildingHeight && <span className="text-red-500 text-sm ml-2">*{errors.buildingHeight}</span>}
        </label>
        <input
          type="text"
          name="buildingHeight"
          value={formData.buildingHeight}
          onChange={handleNumericChange}
          placeholder="Tulis disini"
          className={`w-full border ${errors.buildingHeight ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
        />
      </div>
      
      {/* Design Style */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Gaya Desain
          {errors.style && <span className="text-red-500 text-sm ml-2">*{errors.style}</span>}
        </label>
        <div className="relative">
          <select
            name="style"
            value={formData.style}
            onChange={(e) => {
              handleChange(e);
              if (e.target.value) {
                const newErrors = {...errors};
                delete newErrors.style;
                setErrors(newErrors);
              }
            }}
            className={`w-full border ${errors.style ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none`}
          >
            <option value="" disabled>Pilih disini</option>
            <option value="Modern">Modern</option>
            <option value="Skandinavia">Skandinavia</option>
            <option value="Industrialis">Industrialis</option>
            <option value="Klasik">Klasik</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Number of floor */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Jumlah Lantai
          {errors.floor && <span className="text-red-500 text-sm ml-2">*{errors.floor}</span>}
        </label>
        <div className="relative">
          <select
            name="floor"
            value={formData.floor}
            onChange={(e) => {
              handleChange(e);
              if (e.target.value) {
                const newErrors = {...errors};
                delete newErrors.floor;
                setErrors(newErrors);
              }
            }}
            className={`w-full border ${errors.floor ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none`}
          >
            <option value="" disabled>Pilih disini</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Number of Rooms */}
      <div className="mb-8">
        <label className="block text-custom-green-400 mb-2">
          Jumlah Kamar
          {errors.rooms && <span className="text-red-500 text-sm ml-2">*{errors.rooms}</span>}
        </label>
        <div className="relative">
          <select
            name="rooms"
            value={formData.rooms}
            onChange={(e) => {
              handleChange(e);
              if (e.target.value) {
                const newErrors = {...errors};
                delete newErrors.rooms;
                setErrors(newErrors);
              }
            }}
            className={`w-full border ${errors.rooms ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none`}
          >
            <option value="" disabled>Pilih disini</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-medium text-custom-green-500 mb-6">Unggah Desain</h2>
      
      {/* 3D Rumah */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          3D Rumah
          {errors.object && <span className="text-red-500 text-sm ml-2">*{errors.object}</span>}
        </label>
        <label className={`w-full flex items-center justify-between border ${errors.object ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 text-custom-green-300 cursor-pointer`}>
          <span>
            {getFileName('object')}
          </span>
          <input
            type="file"
            name="object"
            accept=".glb"
            onChange={(e) => {
              handleFileChange('object', e.target.files);
              if (e.target.files && e.target.files.length > 0) {
                const newErrors = {...errors};
                delete newErrors.object;
                setErrors(newErrors);
              }
            }}
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </label>
      </div>
      
      {/* Desain Rumah - Tampak Depan */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Desain Rumah - Tampak Depan
          {errors.houseImageFront && <span className="text-red-500 text-sm ml-2">*{errors.houseImageFront}</span>}
        </label>
        <label className={`w-full flex items-center justify-between border ${errors.houseImageFront ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 text-custom-green-300 cursor-pointer`}>
          <span>
            {getFileName('houseImageFront')}
          </span>
          <input
            type="file"
            name="houseImageFront"
            accept="image/*"
            onChange={(e) => {
              handleFileChange('houseImageFront', e.target.files);
              if (e.target.files && e.target.files.length > 0) {
                const newErrors = {...errors};
                delete newErrors.houseImageFront;
                setErrors(newErrors);
              }
            }}
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </label>
      </div>
      
      {/* Desain Rumah - Tampak Samping */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Desain Rumah - Tampak Samping
          {errors.houseImageSide && <span className="text-red-500 text-sm ml-2">*{errors.houseImageSide}</span>}
        </label>
        <label className={`w-full flex items-center justify-between border ${errors.houseImageSide ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 text-custom-green-300 cursor-pointer`}>
          <span>
            {getFileName('houseImageSide')}
          </span>
          <input
            type="file"
            name="houseImageSide"
            accept="image/*"
            onChange={(e) => {
              handleFileChange('houseImageSide', e.target.files);
              if (e.target.files && e.target.files.length > 0) {
                const newErrors = {...errors};
                delete newErrors.houseImageSide;
                setErrors(newErrors);
              }
            }}
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </label>
      </div>

      {/* Desain Rumah - Tampak Belakang */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Desain Rumah - Tampak Belakang
          {errors.houseImageBack && <span className="text-red-500 text-sm ml-2">*{errors.houseImageBack}</span>}
        </label>
        <label className={`w-full flex items-center justify-between border ${errors.houseImageBack ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 text-custom-green-300 cursor-pointer`}>
          <span>
            {getFileName('houseImageBack')}
          </span>
          <input
            type="file"
            name="houseImageBack"
            accept="image/*"
            onChange={(e) => {
              handleFileChange('houseImageBack', e.target.files);
              if (e.target.files && e.target.files.length > 0) {
                const newErrors = {...errors};
                delete newErrors.houseImageBack;
                setErrors(newErrors);
              }
            }}
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </label>
      </div>

      {/* Dynamic Floor Plans based on number of floors */}
      {renderFloorPlanUploads()}

      {/* Architect Name */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Nama Arsitek
          {errors.designer && <span className="text-red-500 text-sm ml-2">*{errors.designer}</span>}
        </label>
        <input
          type="text"
          name="designer"
          value={formData.designer}
          onChange={(e) => {
            handleChange(e);
            if (e.target.value) {
              const newErrors = {...errors};
              delete newErrors.designer;
              setErrors(newErrors);
            }
          }}
          placeholder="Tulis disini"
          className={`w-full border ${errors.designer ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
        />
      </div>
    </div>
  );
};

export default Step1General;