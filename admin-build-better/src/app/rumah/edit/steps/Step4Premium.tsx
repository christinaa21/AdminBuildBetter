import React from 'react';

// Define the material interface based on expected API response
interface Material {
  id: string;
  name: string;
  category: string;
  subcategory: string;
}

// Define the props interface
interface Step4PremiumProps {
  formData: {
    budget2: string;
    materials2: string[];  // Array of comma-separated strings
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  materials?: Record<string, Material[]>;
}

// Material categories structure
const materialCategories = [
  {category: "Atap", subcategory: "Atap", index: 0},
  {category: "Atap", subcategory: "Struktur Atap", index: 1},
  {category: "Atap", subcategory: "Plafon", index: 2},
  {category: "Dinding", subcategory: "Pelapis Dinding", index: 3},
  {category: "Dinding", subcategory: "Struktur Dinding", index: 4},
  {category: "Lantai", subcategory: "Pelapis", index: 5},
  {category: "Bukaan", subcategory: "Pintu", index: 6},
  {category: "Bukaan", subcategory: "Daun Jendela", index: 7},
  {category: "Bukaan", subcategory: "Frame Jendela", index: 8},
  {category: "Balok-Kolom", subcategory: "Struktur Balok-Kolom", index: 9}
];

const Step4Premium: React.FC<Step4PremiumProps> = ({ 
  formData, 
  handleChange,
  errors, 
  setErrors,
  materials
}) => {
  // Get materials for a specific category and subcategory
  const getMaterialOptions = (category: string, subcategory: string) => {
    if (!materials) return [];
    
    // Find materials that match the category and subcategory
    const categoryMaterials = materials[category] || [];
    return categoryMaterials.filter(material => 
      material.subcategory.toLowerCase() === subcategory.toLowerCase()
    );
  };

  // Check if a material ID is selected in the form data for a specific index
  const isMaterialSelected = (index: number, materialId: string): boolean => {
    return formData.materials2.includes(materialId);
  };

  // Handle checkbox change for materials
  const handleCheckboxChange = (materialId: string, checked: boolean) => {
    // Create a copy of the current materials array
    let newMaterials = [...formData.materials2];
    
    if (checked) {
      // Add the value if it's not already in the array
      if (!newMaterials.includes(materialId)) {
        newMaterials.push(materialId);
      }
    } else {
      // Remove the value
      newMaterials = newMaterials.filter(id => id !== materialId);
    }
    
    // Create a synthetic event
    const syntheticEvent = {
      target: {
        name: 'materials2',
        value: newMaterials
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    // Call the parent's handleChange function
    handleChange(syntheticEvent);
    
    // Clear error for this field if there are selections
    if (newMaterials.length > 0) {
      const errorKeys = Object.keys(errors).filter(key => key.startsWith('materials2_'));
      if (errorKeys.length > 0) {
        const newErrors = {...errors};
        errorKeys.forEach(key => delete newErrors[key]);
        setErrors(newErrors);
      }
    }
  };

  // For budget input
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    
    // Clear error if value is provided
    if (e.target.value && errors.budget) {
      const newErrors = {...errors};
      delete newErrors.budget;
      setErrors(newErrors);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-custom-green-500 mb-6">Rentang Budget Premium</h2>
      
      {/* Rentang Budget Premium */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Premium (per m2)
          {errors.budget2 && <span className="text-red-500 text-sm ml-2">*{errors.budget2}</span>}
        </label>
        <input
          type="text"
          name="budget2"
          value={formData.budget2}
          onChange={handleBudgetChange}
          placeholder="Tulis disini. Contoh format penulisan: 3000000 - 5000000"
          className={`w-full border ${errors.budget2 ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
        />
      </div>
      
      {/* Materials Checkboxes */}
      {!materials ? (
        <div className="text-center py-4">Loading materials...</div>
      ) : (
        <>
          {/* Group by main categories for better UI organization */}
          {["Atap", "Dinding", "Lantai", "Bukaan", "Balok-Kolom"].map((mainCategory) => (
            <div key={mainCategory} className="mb-8">
              <h3 className="text-md font-medium text-custom-green-400 mb-4">{mainCategory}</h3>
              
              {/* Show subcategories for this main category */}
              {materialCategories
                .filter(item => item.category === mainCategory)
                .map((item) => {
                  const errorKey = `materials2_${item.subcategory.replace(/\s+/g, '')}`;
                  const materialOptions = getMaterialOptions(item.category, item.subcategory);
                  
                  return (
                    <div className="mb-6" key={`${item.category}-${item.subcategory}`}>
                      <label className="block text-custom-green-400 mb-2">
                        {item.subcategory}
                        {errors[errorKey] && <span className="text-red-500 text-sm ml-2">*{errors[errorKey]}</span>}
                      </label>
                      
                      <div className={`border ${errors[errorKey] ? 'border-red-500' : 'border-gray-200'} rounded-md p-3 max-h-64 overflow-y-auto`}>
                        {materialOptions.length === 0 ? (
                          <p className="text-gray-500 text-sm">No materials available</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {materialOptions.map((material) => (
                              <div key={material.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`material2-${material.id}`}
                                  checked={isMaterialSelected(item.index, material.id)}
                                  onChange={(e) => handleCheckboxChange(material.id, e.target.checked)}
                                  className="mr-2 h-4 w-4 accent-custom-green-200 border-gray-300 rounded"
                                />
                                <label 
                                  htmlFor={`material2-${material.id}`}
                                  className="text-gray-700 text-md cursor-pointer"
                                >
                                  {material.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Step4Premium;