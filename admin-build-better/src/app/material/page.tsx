'use client'

import React, { useState, useRef } from 'react';
import NavigationBar from '@/components/NavigationBar';
import MaterialCard from '@/components/MaterialCard';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { H3, Title } from '@/components/Typography';
import Button from '@/components/Button';

interface Material {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  subcategory?: string;
}

interface MaterialSubCategory {
  name: string;
  materials: Material[];
}

interface MaterialCategory {
  title: string;
  subcategories: MaterialSubCategory[];
}

const Material: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [materialCategories, setMaterialCategories] = useState<MaterialCategory[]>([
    {
      title: "Atap",
      subcategories: [
        {
          name: "Atap",
          materials: [
            {
              id: '1',
              name: 'Genting',
              imageUrl: '/Genting.png',
              category: 'atap'
            },
            {
              id: '2',
              name: 'Bitumen',
              imageUrl: '/Bitumen.png',
              category: 'atap'
            },
            {
              id: '3',
              name: 'Metal',
              imageUrl: '/Metal.png',
              category: 'atap'
            },
            {
              id: '4',
              name: 'Dak Beton',
              imageUrl: '/DakBeton.png',
              category: 'atap'
            }
          ]
        },
        {
          name: "Struktur Atap",
          materials: [
            {
              id: '5',
              name: 'Baja Ringan',
              imageUrl: '/BajaRingan.png',
              category: 'struktur_atap'
            },
            {
              id: '6',
              name: 'Kayu',
              imageUrl: '/Kayu.png',
              category: 'struktur_atap'
            },
            {
              id: '7',
              name: 'Dak Beton',
              imageUrl: '/DakBetonStruktur.png',
              category: 'struktur_atap'
            }
          ]
        },
        {
          name: "Plafon",
          materials: [
            {
              id: '8',
              name: 'PVC',
              imageUrl: '/PVC.png',
              category: 'plafon'
            },
            {
              id: '9',
              name: 'Kayu',
              imageUrl: '/KayuPlafon.png',
              category: 'plafon'
            },
            {
              id: '10',
              name: 'Gipsum',
              imageUrl: '/Gipsum.png',
              category: 'plafon'
            },
            {
              id: '11',
              name: 'Multiplek',
              imageUrl: '/Multiplek.png',
              category: 'plafon'
            }
          ]
        }
      ]
    },
    {
      title: "Dinding",
      subcategories: [
        {
          name: "Pelapis Dinding",
          materials: [
            {
              id: '12',
              name: 'Wallpaper',
              imageUrl: '/Wallpaper.png',
              category: 'pelapis_dinding'
            },
            {
              id: '13',
              name: 'Vinyl',
              imageUrl: '/Vinyl.png',
              category: 'pelapis_dinding'
            },
            {
              id: '14',
              name: 'Cat',
              imageUrl: '/Cat.png',
              category: 'pelapis_dinding'
            },
            {
              id: '15',
              name: 'Kamprot',
              imageUrl: '/Kamprot.png',
              category: 'pelapis_dinding'
            },
            {
              id: '16',
              name: 'Keramik',
              imageUrl: '/KeramikDinding.png',
              category: 'pelapis_dinding'
            }
          ]
        },
        {
          name: "Struktur Dinding",
          materials: [
            {
              id: '21',
              name: 'Bata',
              imageUrl: '/Bata.png',
              category: 'struktur_dinding'
            },
            {
              id: '22',
              name: 'Batako',
              imageUrl: '/Batako.png',
              category: 'struktur_dinding'
            }
          ]
        }
      ]
    },
    {
      title: "Lantai",
      subcategories: [
        {
          name: "Pelapis",
          materials: [
            {
              id: '23',
              name: 'Keramik',
              imageUrl: '/KeramikLantai.png',
              category: 'pelapis_lantai'
            },
            {
              id: '24',
              name: 'Granit',
              imageUrl: '/GranitLantai.png',
              category: 'pelapis_lantai'
            },
            {
              id: '25',
              name: 'Parquet',
              imageUrl: '/Parquet.png',
              category: 'pelapis_lantai'
            }
          ]
        }
      ]
    }
  ]);

  const handleEdit = (id: string) => {
    console.log(`Edit material with id: ${id}`);
    // Navigate to edit page or open edit modal
  };

  const handleAddMaterial = () => {
    console.log('Add new material');
    window.location.href = "/material/add";
  };

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
        {materialCategories.map((category, index) => (
          <div key={index} className="mb-12">
            <Title className="text-custom-olive-50 mb-4">Material - {category.title}</Title>
            
            {category.subcategories.map((subcategory, subIndex) => (
              <div key={subIndex} className="mb-8">
                <div className="text-custom-olive-50 mb-2">{subcategory.name}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {subcategory.materials.map((material) => (
                      <MaterialCard 
                        key={material.id}
                        material={material}
                        onEdit={handleEdit}
                      />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Material;