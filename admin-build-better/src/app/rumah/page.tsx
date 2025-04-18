'use client'

import React, { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import HouseCard from '@/components/HouseCard';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { H2, H3, Title } from '@/components/Typography';
import Button from '@/components/Button';

interface House {
  id: string;
  name: string;
  imageUrl: string;
  size: string;
  style: string;
  floors: number;
  bedrooms: number;
}

const Rumah: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Example data
  const houses: House[] = [
    {
      id: '1',
      name: 'Rumah 1',
      imageUrl: '/house1.jpg',
      size: '42-60 m2',
      style: 'skandinavia',
      floors: 1,
      bedrooms: 2
    },
    {
      id: '2',
      name: 'Rumah 2',
      imageUrl: '/house2.jpg',
      size: '42-60 m2',
      style: 'skandinavia',
      floors: 1,
      bedrooms: 2
    },
    {
      id: '3',
      name: 'Rumah 3',
      imageUrl: '/house3.jpg',
      size: '42-60 m2',
      style: 'skandinavia',
      floors: 1,
      bedrooms: 2
    },
    {
      id: '4',
      name: 'Rumah 4',
      imageUrl: '/house4.jpg',
      size: '42-60 m2',
      style: 'skandinavia',
      floors: 1,
      bedrooms: 2
    },
  ];

  const handleEdit = (id: string) => {
    console.log(`Edit house with id: ${id}`);
    // Navigate to edit page or open edit modal
  };

  const handleDelete = (id: string) => {
    console.log(`Delete house with id: ${id}`);
    // Show confirmation dialog and delete if confirmed
  };

  const handleAddHouse = () => {
    console.log('Add new house');
    // Navigate to add house page or open add house modal
  };

  return (
    <div className="min-h-screen">
      <NavigationBar />
      
      <main className="container mx-auto py-8 px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <H3 className="mb-6 text-custom-green-300">Ingin menambahkan desain rumah?</H3>
          <div className="flex justify-center">
            <Button
                title='Tambah Rumah'
                variant='primary'
                icon={<FaPlus className="text-sm"/>}
                onPress={handleAddHouse}
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
        
        {/* House Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {houses.map((house) => (
            <HouseCard 
              key={house.id} 
              house={house} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Rumah;