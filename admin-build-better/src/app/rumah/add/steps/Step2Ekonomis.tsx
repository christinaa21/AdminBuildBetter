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
    materials0: string[];
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
  // For debugging
  const [lastSelected, setLastSelected] = useState<{name: string, value: string} | null>(null);

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

  // Validation function
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.budget) newErrors.budget = "Rentang budget wajib diisi";
    
    // Validate all material selections
    materialCategories.forEach(item => {
      if (!formData.materials0[item.index]) {
        newErrors[`materials0_${item.subcategory.replace(/\s+/g, '')}`] = 
          `Material ${item.subcategory} wajib dipilih`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get materials for a specific category and subcategory
  const getMaterialOptions = (category: string, subcategory: string) => {
    if (!materials) return [];
    
    // Find materials that match the category and subcategory
    const categoryMaterials = materials[category] || [];
    return categoryMaterials.filter(material => 
      material.subcategory.toLowerCase() === subcategory.toLowerCase()
    );
  };

  // Custom handle change function with direct access to formData
  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // For debugging - store the last selection
    setLastSelected({name: e.target.name, value: e.target.value});
    
    // Call the parent's handleChange function
    handleChange(e);
    
    // Clear error for this field if it exists
    if (e.target.value && e.target.name.startsWith('materials0[')) {
      const index = e.target.name.match(/\[(\d+)\]/)?.[1];
      if (index) {
        const matchingCategory = materialCategories.find(item => item.index === parseInt(index));
        if (matchingCategory) {
          const errorKey = `materials0_${matchingCategory.subcategory.replace(/\s+/g, '')}`;
          if (errors[errorKey]) {
            const newErrors = {...errors};
            delete newErrors[errorKey];
            setErrors(newErrors);
          }
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
      
      {/* Materials Dropdowns */}
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
                  const fieldName = `materials0[${item.index}]`;
                  const currentValue = formData.materials0[item.index] || '';
                  
                  return (
                    <div className="mb-6" key={`${item.category}-${item.subcategory}`}>
                      <label className="block text-custom-green-400 mb-2">
                        {item.subcategory}
                        {errors[errorKey] && <span className="text-red-500 text-sm ml-2">*{errors[errorKey]}</span>}
                      </label>
                      <div className="relative">
                        <select
                          name={fieldName}
                          value={currentValue}
                          onChange={handleMaterialChange}
                          className={`w-full border ${errors[errorKey] ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none`}
                        >
                          <option value="">Pilih disini</option>
                          {materialOptions.map((material) => (
                            <option key={material.id} value={material.id}>
                              {material.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
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