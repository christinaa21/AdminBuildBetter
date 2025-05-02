'use client'

import React, { useState, useRef, useEffect } from 'react';
import NavigationBar from '@/components/NavigationBar';
import MaterialCard from '@/components/MaterialCard';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { H3, Title } from '@/components/Typography';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

interface Material {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  subCategory?: string;
  image?: string;
}

interface MaterialSubCategory {
  subCategory: string;
  materials: Material[];
}

interface MaterialCategory {
  category: string;
  subCategories: MaterialSubCategory[];
}

const Material: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const [materialCategories, setMaterialCategories] = useState<MaterialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if no token is found
      router.push('/login');
      return;
    }
    
    fetchMaterials();
  }, [router]);

  const fetchMaterials = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      // Use Next.js API route as a proxy to avoid CORS issues
      const response = await fetch('/api/materials?grouped=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.code === 200) {
        // Process and store the material data
        setMaterialCategories(result.data);
      } else if (response.status === 401 || response.status === 403) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/login');
      } else {
        setError('Failed to load materials. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('An error occurred while fetching materials. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    console.log(`Edit material with id: ${id}`);
    // Navigate to edit page with material ID
    router.push(`/material/edit/${id}`);
  };

  const handleAddMaterial = () => {
    console.log('Add new material');
    router.push("/material/add");
  };

  // Filter materials based on search term
  const filteredMaterialCategories = materialCategories.map(category => {
    // Filter subcategories containing materials that match the search term
    const filteredSubCategories = category.subCategories
      .map(subcategory => {
        // Filter materials in each subcategory
        const filteredMaterials = subcategory.materials.filter(material =>
          material.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Return subcategory with filtered materials
        return {
          ...subcategory,
          materials: filteredMaterials
        };
      })
      // Only include subcategories that have materials after filtering
      .filter(subcategory => subcategory.materials.length > 0);
    
    // Return category with filtered subcategories
    return {
      ...category,
      subCategories: filteredSubCategories
    };
  }).filter(category => category.subCategories.length > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-8 flex justify-center items-center">
          <div className="text-center">
            <p className="text-custom-olive-50 text-lg">Loading materials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-8">
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

  return (
    <div className="min-h-screen">
      <NavigationBar />
      
      <main className="container mx-auto py-8 px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <H3 className="mb-6 text-custom-green-300">Ingin menambahkan material?</H3>
          <div className="flex justify-center">
            <Button
                title='Tambah Material'
                variant='primary'
                icon={<FaPlus className="text-sm"/>}
                onPress={handleAddMaterial}
            />
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mt-10 mb-8 max-w-4xl mx-auto">
          <FaSearch className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari disini"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-12 pr-4 text-custom-olive-50 rounded-full border border-custom-gray-200 focus:outline-none focus:ring-1 focus:ring-custom-green-300"
          />
        </div>
        
        {/* Material Categories */}
        {filteredMaterialCategories.length > 0 ? (
          filteredMaterialCategories.map((category, index) => (
            <div key={index} className="mb-12">
              <Title className="text-custom-olive-50 mb-4">Material - {category.category}</Title>
              
              {category.subCategories.map((subcategory, subIndex) => (
                <div key={subIndex} className="mb-8">
                  <div className="text-custom-olive-50 mb-2">{subcategory.subCategory}</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {subcategory.materials.map((material) => (
                      <MaterialCard 
                        key={material.id}
                        material={{
                          id: material.id,
                          name: material.name,
                          imageUrl: material.image || '', // Use image URL from API
                          category: material.category
                        }}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'No materials found matching your search.' : 'No materials available.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Material;