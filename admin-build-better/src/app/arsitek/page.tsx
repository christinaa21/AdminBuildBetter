/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import NavigationBar from '@/components/NavigationBar';
import ArchitectCard from '@/components/ArchitectCard';
import { FaSearch, FaPlus, FaTimes } from 'react-icons/fa';
import { Caption, H3, Title } from '@/components/Typography';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

interface Architect {
  id: string;
  username: string;
  photo: string;
  experience: number;
  portfolio: string;
  city: string;
  rateOnline: string; 
  rateOffline: string; 
}

interface ApiArchitect {
  id: string;
  email: string;
  password: string;
  username: string;
  photo: string;
  province: string;
  city: string;
  phoneNumber: string;
  experience: number;
  rateOnline: number;
  rateOffline: number;
  portfolio: string;
  createdAt: string;
  updatedAt: string;
}

const Arsitek: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [architectToDelete, setArchitectToDelete] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [architects, setArchitects] = useState<Architect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to format rate as "Rpxxxrb"
  const formatRate = (rate: number): string => {
    if (rate >= 1000) {
      return `Rp${Math.floor(rate / 1000)}rb`;
    }
    return `Rp${rate}`;
  };

  // Function to transform API data into the format needed for ArchitectCard
  // Moved outside useCallback to avoid recreation on each render
  const transformApiData = useCallback((apiData: ApiArchitect[]): Architect[] => {
    return apiData.map(architect => ({
      id: architect.id,
      username: architect.username,
      photo: architect.photo || '/blank-profile.png',
      experience: architect.experience,
      portfolio: architect.portfolio,
      city: architect.city,
      rateOnline: formatRate(architect.rateOnline),
      rateOffline: formatRate(architect.rateOffline)
    }));
  }, []);

  // Fetch architects from API
  const fetchArchitects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/');
        return;
      }
      
      // Use Next.js API route as a proxy to avoid CORS issues
      const response = await fetch('/api/arsitek', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.code === 200) {
        // Transform and store the architect data
        setArchitects(transformApiData(result.data));
      } else if (response.status === 401 || response.status === 403) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/');
      } else {
        setError('Failed to load architects. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching architects:', error);
      setError('An error occurred while fetching architects. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [router, transformApiData]);

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if no token is found
      router.push('/');
      return;
    }
    
    fetchArchitects();
  }, [fetchArchitects]);

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

  const handleView = (id: string) => {
    console.log(`View architect with id: ${id}`);
    router.push(`/arsitek/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setArchitectToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (architectToDelete) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        
        // Call the API to delete the architect
        const response = await fetch(`/api/arsitek/${architectToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Handle possible empty responses
        let result;
        try {
          const text = await response.text();
          result = text ? JSON.parse(text) : { code: response.status };
        } catch (e) {
          console.warn('Failed to parse JSON response:', e);
          // Fallback to using HTTP status
          result = { code: response.status };
        }
        
        if (response.ok) {
          // Filter out the deleted architect from the architects array
          setArchitects(architects.filter(architect => architect.id !== architectToDelete));
          closeDeleteModal();
        } else if (response.status === 401 || response.status === 403) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          router.push('/');
        } else {
          setError(`Failed to delete architect (${response.status}). Please try again later.`);
        }
      } catch (error) {
        console.error('Error deleting architect:', error);
        setError('An error occurred while deleting the architect. Please try again later.');
      } finally {
        setIsLoading(false);
        closeDeleteModal();
      }
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setArchitectToDelete(null);
  };

  const handleAddArchitect = () => {
    console.log('Add new architect');
    router.push("/arsitek/add");
  };

  // Find the architect name for the delete confirmation message
  const architectToDeleteName = architectToDelete 
    ? architects.find(architect => architect.id === architectToDelete)?.username 
    : '';

  // Filter architects based on search term
  const filteredArchitects = architects.filter(architect => 
    architect.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    architect.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (isLoading && architects.length === 0) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-8 flex justify-center items-center">
          <div className="text-center">
            <p className="text-custom-olive-50 text-lg">Loading architects...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && architects.length === 0) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              title='Try Again'
              variant='primary'
              onPress={fetchArchitects}
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
          <H3 className="mb-6 text-custom-green-300">Ingin menambahkan arsitek?</H3>
          <div className="flex justify-center">
            <Button
                title='Tambah Arsitek'
                variant='primary'
                icon={<FaPlus className="text-sm"/>}
                onPress={handleAddArchitect}
            />
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mt-10 mb-8 max-w-4xl mx-auto">
          <FaSearch className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari arsitek"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-12 pr-4 text-custom-olive-50 rounded-full border border-custom-gray-200 focus:outline-none focus:ring-1 focus:ring-custom-green-300"
          />
        </div>
        
        {/* Architect Cards Grid - Changed from flex flex-col to grid */}
        {filteredArchitects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredArchitects.map((architect) => (
              <ArchitectCard 
                key={architect.id} 
                architect={architect} 
                onView={handleView}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'No architects found matching your search.' : 'No architects available.'}
            </p>
          </div>
        )}
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
              <p className="text-custom-olive-50">Apakah Anda yakin ingin menghapus {architectToDeleteName}?</p>
              <Caption className="text-custom-gray-200 mt-2">Tindakan ini tidak dapat dibatalkan.</Caption>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arsitek;