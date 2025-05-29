/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import NavigationBar from '@/components/NavigationBar';
import ConsultationCard from '@/components/ConsultationCard';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Caption, H3, Title } from '@/components/Typography';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

interface Consultation {
  id: string;
  userName: string;
  architectName: string;
  type: string;
  total: number | null;
  status: string;
  reason: string | null;
  city: string;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface ApiConsultation {
  id: string;
  userName: string;
  architectName: string;
  roomId: string | null;
  type: string;
  total: number | null;
  status: string;
  reason: string | null;
  city: string;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

const Konsultasi: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [consultationToDelete, setConsultationToDelete] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to transform API data into the format needed for ConsultationCard
  const transformApiData = useCallback((apiData: ApiConsultation[]): Consultation[] => {
    return apiData.map(consultation => ({
      id: consultation.id,
      userName: consultation.userName,
      architectName: consultation.architectName,
      type: consultation.type,
      total: consultation.total,
      status: consultation.status,
      reason: consultation.reason,
      city: consultation.city,
      location: consultation.location,
      startDate: consultation.startDate,
      endDate: consultation.endDate,
      createdAt: consultation.createdAt
    }));
  }, []);

  // Mock data for testing
  const mockConsultations: Consultation[] = [
    {
      id: "62b8a8b0-4d28-47a0-832d-1107d84fda68",
      userName: "Timothy Subekti",
      architectName: "Erensi Ratu Chelsia",
      type: "offline",
      total: 100000,
      status: "waiting-for-payment",
      reason: null,
      city: "Kota Bandung",
      location: "https://g.co/kgs/NKCdLzj",
      startDate: "2025-05-26T16:00:00",
      endDate: "2025-05-26T17:00:00",
      createdAt: "2025-05-23T00:51:05.038771"
    },
    {
      id: "73c9b9c1-5e39-48b1-943e-2218e95feb79",
      userName: "Sarah Amanda",
      architectName: "Budi Santoso",
      type: "online",
      total: 75000,
      status: "scheduled",
      reason: null,
      city: "Kota Jakarta Selatan",
      location: "",
      startDate: "2025-05-30T09:00:00",
      endDate: "2025-05-30T10:00:00",
      createdAt: "2025-05-25T14:20:15.123456"
    },
    {
      id: "84d0c0d2-6f4a-59c2-a54f-3329fa6gec8a",
      userName: "Andi Pratama",
      architectName: "Maya Sari",
      type: "offline",
      total: 150000,
      status: "cancelled",
      reason: "user cancelled the consultation",
      city: "Surabaya",
      location: "https://g.co/kgs/AbCdEfG",
      startDate: "2025-05-28T14:00:00",
      endDate: "2025-05-28T15:30:00",
      createdAt: "2025-05-22T10:30:45.987654"
    },
    {
      id: "95e1d1e3-7g5b-6ad3-b65g-4430gb7hfd9b",
      userName: "Lisa Wijaya",
      architectName: "Rendi Kurniawan",
      type: "online",
      total: null,
      status: "ended",
      reason: null,
      city: "Yogyakarta",
      location: "",
      startDate: "2025-05-20T13:00:00",
      endDate: "2025-05-20T14:00:00",
      createdAt: "2025-05-18T16:45:30.456789"
    },
    {
      id: "a6f2e2f4-8h6c-7be4-c76h-5541hc8ige0c",
      userName: "David Chen",
      architectName: "Siti Nurhaliza",
      type: "offline",
      total: 200000,
      status: "in-progress",
      reason: null,
      city: "Medan",
      location: "https://g.co/kgs/XyZaBc",
      startDate: "2025-05-29T10:00:00",
      endDate: "2025-05-29T12:00:00",
      createdAt: "2025-05-27T08:15:20.789012"
    },
    {
      id: "b7g3f3g5-9i7d-8cf5-d87i-6652id9jhf1d",
      userName: "Nadia Putri",
      architectName: "Ahmad Fauzi",
      type: "online",
      total: 90000,
      status: "waiting-for-confirmation",
      reason: null,
      city: "Makassar",
      location: "",
      startDate: "2025-06-01T15:00:00",
      endDate: "2025-06-01T16:00:00",
      createdAt: "2025-05-28T12:00:00.345678"
    }
  ];

  // Fetch consultations from API (using mock data for testing)
  const fetchConsultations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data instead of API call
      setConsultations(mockConsultations);
      
      /* 
      // Uncomment this section when you want to use real API
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Use Next.js API route as a proxy to avoid CORS issues
      const response = await fetch('/api/consultations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.code === 200) {
        // Transform and store the consultation data
        setConsultations(transformApiData(result.data));
      } else if (response.status === 401 || response.status === 403) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/login');
      } else {
        setError('Failed to load consultations. Please try again later.');
      }
      */
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError('An error occurred while fetching consultations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Check for authentication on component mount (disabled for testing with mock data)
  useEffect(() => {
    // Skip authentication check for testing with mock data
    fetchConsultations();
    
    /* 
    // Uncomment this section when you want to use real authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if no token is found
      router.push('/login');
      return;
    }
    
    fetchConsultations();
    */
  }, [fetchConsultations]);

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
    console.log(`View consultation with id: ${id}`);
    router.push(`/konsultasi/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setConsultationToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (consultationToDelete) {
      setIsLoading(true);
      try {
        // Simulate API delay for delete operation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove from mock data
        setConsultations(consultations.filter(consultation => consultation.id !== consultationToDelete));
        closeDeleteModal();
        
        /* 
        // Uncomment this section when you want to use real API
        const token = localStorage.getItem('authToken');
        
        // Call the API to delete the consultation
        const response = await fetch(`/api/consultations/${consultationToDelete}`, {
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
          // Filter out the deleted consultation from the consultations array
          setConsultations(consultations.filter(consultation => consultation.id !== consultationToDelete));
          closeDeleteModal();
        } else if (response.status === 401 || response.status === 403) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          router.push('/login');
        } else {
          setError(`Failed to delete consultation (${response.status}). Please try again later.`);
        }
        */
      } catch (error) {
        console.error('Error deleting consultation:', error);
        setError('An error occurred while deleting the consultation. Please try again later.');
      } finally {
        setIsLoading(false);
        closeDeleteModal();
      }
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setConsultationToDelete(null);
  };

  // Find the consultation details for the delete confirmation message
  const consultationToDeleteDetails = consultationToDelete 
    ? consultations.find(consultation => consultation.id === consultationToDelete)
    : null;

  // Filter consultations based on search term
  const filteredConsultations = consultations.filter(consultation => 
    consultation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.architectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (isLoading && consultations.length === 0) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-8 flex justify-center items-center">
          <div className="text-center">
            <p className="text-custom-olive-50 text-lg">Loading consultations...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && consultations.length === 0) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              title='Try Again'
              variant='primary'
              onPress={fetchConsultations}
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
        {/* Header Section - Without Add Button */}
        <div className="text-center mb-8">
          <H3 className="mb-6 text-custom-green-300">Daftar Konsultasi</H3>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-8 max-w-4xl mx-auto">
          <FaSearch className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari konsultasi berdasarkan nama, arsitek, kota, atau status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-12 pr-4 text-custom-olive-50 rounded-full border border-custom-gray-200 focus:outline-none focus:ring-1 focus:ring-custom-green-300"
          />
        </div>
        
        {/* Consultation Cards Grid */}
        {filteredConsultations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredConsultations.map((consultation) => (
              <ConsultationCard 
                key={consultation.id} 
                consultation={consultation}
                onEdit={handleView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'No consultations found matching your search.' : 'No consultations available.'}
            </p>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && consultationToDeleteDetails && (
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
              <p className="text-custom-olive-50">
                Apakah Anda yakin ingin menghapus konsultasi {consultationToDeleteDetails.userName} dengan {consultationToDeleteDetails.architectName}?
              </p>
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

export default Konsultasi;