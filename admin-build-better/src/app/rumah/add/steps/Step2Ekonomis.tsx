import React, { useEffect, useState } from 'react';

// Define the material interface based on expected API response
interface Material {
  id: string;
  name: string;
  category: string;
  subcategory: string;
}

// Define the MaterialCategory interface to match what's used in AddHousePage
interface MaterialSubCategory {
  subCategory: string;
  materials: Material[];
}

interface MaterialCategory {
  category: string;
  subCategories: MaterialSubCategory[];
}

// Define the props interface with correct types
interface Step2EkonomisProps {
  formData: {
    budget: string;
    materials0: string[];  // Keep as string[] - will store comma-separated values
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  materials?: Record<string, Material[]>;
  setMaterials?: React.Dispatch<React.SetStateAction<MaterialCategory[]>>;
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

const Step2Ekonomis: React.FC<Step2EkonomisProps> = ({ 
  formData, 
  handleChange,
  errors, 
  setErrors,
  materials,
  setMaterials
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  
  // Fetch materials if they haven't been loaded yet
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!materials || Object.keys(materials).length === 0) {
        try {
          setLoading(true);
          const response = await fetch('/api/materials?grouped=true');
          if (!response.ok) {
            throw new Error('Failed to fetch materials');
          }
          const data = await response.json();
          
          // Assuming data is in the format we need
          if (setMaterials) {
            setMaterials(data.data || []);
          }
        } catch (error) {
          console.error('Error fetching materials:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMaterials();
  }, [materials, setMaterials]);

  // Get materials for a specific category and subcategory
  const getMaterialOptions = (category: string, subcategory: string) => {
    if (!materials) return [];
    
    // Find materials that match the category and subcategory
    const categoryMaterials = materials[category] || [];
    return categoryMaterials.filter(material => 
      material.subcategory.toLowerCase() === subcategory.toLowerCase()
    );
  };

  // Helper to get current selected values as array
  const getCurrentValues = (index: number): string[] => {
    const value = formData.materials0[index] || '';
    return value ? value.split(',') : [];
  };

  // Handle checkbox change for materials
  const handleCheckboxChange = (index: number, materialId: string, checked: boolean) => {
    const currentValues = getCurrentValues(index);
    
    let newValues: string[];
    if (checked) {
      // Add the value if it's not already in the array
      newValues = [...currentValues, materialId].filter((v, i, a) => a.indexOf(v) === i);
    } else {
      // Remove the value
      newValues = currentValues.filter(id => id !== materialId);
    }
    
    // Join the values and create a synthetic event
    const valueToSend = newValues.join(',');
    const fieldName = `materials0[${index}]`;
    
    const syntheticEvent = {
      target: {
        name: fieldName,
        value: valueToSend
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    // Call the parent's handleChange function
    handleChange(syntheticEvent);
    
    // Clear error for this field if there are selections
    if (newValues.length > 0) {
      const matchingCategory = materialCategories.find(item => item.index === index);
      if (matchingCategory) {
        const errorKey = `materials0_${matchingCategory.subcategory.replace(/\s+/g, '')}`;
        if (errors[errorKey]) {
          const newErrors = {...errors};
          delete newErrors[errorKey];
          setErrors(newErrors);
        }
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
      <h2 className="text-lg font-medium text-custom-green-500 mb-6">Rentang Budget</h2>
      
      {/* Rentang Budget Ekonomis */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Ekonomis (per m2)
          {errors.budget && <span className="text-red-500 text-sm ml-2">*{errors.budget}</span>}
        </label>
        <input
          type="text"
          name="budget"
          value={formData.budget}
          onChange={handleBudgetChange}
          placeholder="Tulis disini. Contoh format penulisan: 1000000 - 2000000"
          className={`w-full border ${errors.budget ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
        />
      </div>
      
      {/* Materials Checkboxes */}
      {loading ? (
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
                  const errorKey = `materials0_${item.subcategory.replace(/\s+/g, '')}`;
                  const materialOptions = getMaterialOptions(item.category, item.subcategory);
                  const index = item.index;
                  const currentValues = getCurrentValues(index);
                  
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
                                  id={`material-${index}-${material.id}`}
                                  checked={currentValues.includes(material.id)}
                                  onChange={(e) => handleCheckboxChange(index, material.id, e.target.checked)}
                                  className="mr-2 h-4 w-4 accent-custom-green-200 border-gray-300 rounded"
                                />
                                <label 
                                  htmlFor={`material-${index}-${material.id}`}
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

export default Step2Ekonomis;