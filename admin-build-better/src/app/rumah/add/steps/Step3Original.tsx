import React from 'react';

// Define the material interface based on expected API response
interface Material {
  id: string;
  name: string;
  category: string;
  subcategory: string;
}

// Define the props interface
interface Step3OriginalProps {
  formData: {
    budget1: string;
    materials1: string[];
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

const Step3Original: React.FC<Step3OriginalProps> = ({ 
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

  // Handle field change and clear associated error
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleChange(e);
    
    // Clear error for this field if it exists
    if (e.target.value && e.target.name.startsWith('materials1[')) {
      const index = e.target.name.match(/\[(\d+)\]/)?.[1];
      if (index) {
        const matchingCategory = materialCategories.find(item => item.index === parseInt(index));
        if (matchingCategory) {
          const errorKey = `materials1_${matchingCategory.subcategory.replace(/\s+/g, '')}`;
          if (errors[errorKey]) {
            const newErrors = {...errors};
            delete newErrors[errorKey];
            setErrors(newErrors);
          }
        }
      }
    } else if (e.target.name === 'budget1' && e.target.value && errors.budget1) {
      const newErrors = {...errors};
      delete newErrors.budget1;
      setErrors(newErrors);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-custom-green-500 mb-6">Rentang Budget Original</h2>
      
      {/* Rentang Budget Original */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">
          Original (per m2)
          {errors.budget1 && <span className="text-red-500 text-sm ml-2">*{errors.budget1}</span>}
        </label>
        <input
          type="text"
          name="budget1"
          value={formData.budget1}
          onChange={handleFieldChange}
          placeholder="Tulis disini. Contoh format penulisan: 2000000 - 3000000"
          className={`w-full border ${errors.budget1 ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
        />
      </div>
      
      {/* Materials Dropdowns */}
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
                  const errorKey = `materials1_${item.subcategory.replace(/\s+/g, '')}`;
                  const materialOptions = getMaterialOptions(item.category, item.subcategory);
                  
                  return (
                    <div className="mb-6" key={`${item.category}-${item.subcategory}`}>
                      <label className="block text-custom-green-400 mb-2">
                        {item.subcategory}
                        {errors[errorKey] && <span className="text-red-500 text-sm ml-2">*{errors[errorKey]}</span>}
                      </label>
                      <div className="relative">
                        <select
                          name={`materials1[${item.index}]`}
                          value={formData.materials1[item.index] || ''}
                          onChange={handleFieldChange}
                          className={`w-full border ${errors[errorKey] ? 'border-red-500' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none`}
                        >
                          <option value="" disabled>Pilih disini</option>
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

export default Step3Original;