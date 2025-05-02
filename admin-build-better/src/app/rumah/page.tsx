'use client'

import React, { useState, useRef, useEffect } from 'react';
import NavigationBar from '@/components/NavigationBar';
import HouseCard from '@/components/HouseCard';
import { FaSearch, FaPlus, FaTimes } from 'react-icons/fa';
import { Caption, H3, Title } from '@/components/Typography';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [houses, setHouses] = useState<House[]>([
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
  ]);

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeDeleteModal();
      }
    };

    if (showDeleteModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDeleteModal]);

  const handleEdit = (id: string) => {
    console.log(`Edit house with id: ${id}`);
    // Navigate to edit page or open edit modal
  };

  const handleDeleteClick = (id: string) => {
    setHouseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (houseToDelete) {
      console.log(`Deleting house with id: ${houseToDelete}`);
      // Filter out the deleted house from the houses array
      setHouses(houses.filter(house => house.id !== houseToDelete));
      closeDeleteModal();
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setHouseToDelete(null);
  };

  const handleAddHouse = () => {
    console.log('Add new house');
    window.location.href = "/rumah/add";
  };

  // Find the house name for the delete confirmation message
  const houseToDeleteName = houseToDelete 
    ? houses.find(house => house.id === houseToDelete)?.name 
    : '';

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
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-custom-white-50 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <Title className="text-custom-olive-100">Konfirmasi Hapus</Title>
              <button 
                onClick={closeDeleteModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-custom-olive-50">Apakah Anda yakin ingin menghapus {houseToDeleteName}?</p>
              <Caption className="text-custom-gray-200 mt-2">Tindakan ini tidak dapat dibatalkan.</Caption>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rumah;