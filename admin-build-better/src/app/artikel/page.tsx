/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import NavigationBar from '@/components/NavigationBar';
import ArtikelCard from '@/components/ArtikelCard';
import { FaSearch, FaPlus, FaTimes } from 'react-icons/fa';
import { Caption, H3, Title } from '@/components/Typography';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

interface Artikel {
  id: string;
  author: string;
  title: string;
  banner: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Artikel: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [artikelToDelete, setArtikelToDelete] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [artikels, setArtikels] = useState<Artikel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch artikels from API
  const fetchArtikels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Use Next.js API route as a proxy to avoid CORS issues
      const response = await fetch('/api/artikel', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.code === 200) {
        // Store the artikel data
        setArtikels(result.data);
      } else if (response.status === 401 || response.status === 403) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/login');
      } else {
        setError('Failed to load articles. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('An error occurred while fetching articles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if no token is found
      router.push('/login');
      return;
    }
    
    fetchArtikels();
  }, [router, fetchArtikels]);

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
    console.log(`Edit artikel with id: ${id}`);
    router.push(`/artikel/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setArtikelToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (artikelToDelete) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        
        // Call the API to delete the artikel
        const response = await fetch(`/api/artikel/${artikelToDelete}`, {
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
          // Filter out the deleted artikel from the artikels array
          setArtikels(artikels.filter(artikel => artikel.id !== artikelToDelete));
          closeDeleteModal();
        } else if (response.status === 401 || response.status === 403) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          router.push('/login');
        } else {
          setError(`Failed to delete article (${response.status}). Please try again later.`);
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        setError('An error occurred while deleting the article. Please try again later.');
      } finally {
        setIsLoading(false);
        closeDeleteModal();
      }
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setArtikelToDelete(null);
  };

  const handleAddArtikel = () => {
    console.log('Add new artikel');
    router.push("/artikel/add");
  };

  // Find the artikel title for the delete confirmation message
  const artikelToDeleteTitle = artikelToDelete 
    ? artikels.find(artikel => artikel.id === artikelToDelete)?.title 
    : '';

  // Filter artikels based on search term
  const filteredArtikels = artikels.filter(artikel => 
    artikel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artikel.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (isLoading && artikels.length === 0) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-8 flex justify-center items-center">
          <div className="text-center">
            <p className="text-custom-olive-50 text-lg">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && artikels.length === 0) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              title='Try Again'
              variant='primary'
              onPress={fetchArtikels}
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
          <H3 className="mb-6 text-custom-green-300">Ingin menambahkan artikel?</H3>
          <div className="flex justify-center">
            <Button
                title='Tambah Artikel'
                variant='primary'
                icon={<FaPlus className="text-sm"/>}
                onPress={handleAddArtikel}
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
        
        {/* Artikel Cards Grid */}
        {filteredArtikels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredArtikels.map((artikel) => (
              <ArtikelCard 
                key={artikel.id} 
                artikel={artikel} 
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'No articles found matching your search.' : 'No articles available.'}
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
              <p className="text-custom-olive-50">Apakah Anda yakin ingin menghapus artikel ini?</p>
              <Caption className="text-custom-gray-200 mt-2">"{artikelToDeleteTitle}"</Caption>
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

export default Artikel;