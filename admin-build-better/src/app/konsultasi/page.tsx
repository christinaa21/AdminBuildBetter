/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import NavigationBar from '@/components/NavigationBar';
import ConsultationCard from '@/components/ConsultationCard';
import { FaSearch } from 'react-icons/fa';
import { H3 } from '@/components/Typography';
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
  userCity: string;
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
  userCity: string;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

const Konsultasi: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status mapping for Indonesian labels and sorting priority
  const statusMapping = {
    'waiting-for-confirmation': { label: 'menunggu konfirmasi', priority: 1 },
    'waiting-for-payment': { label: 'menunggu pembayaran', priority: 2 },
    'scheduled': { label: 'dijadwalkan', priority: 3 },
    'in-progress': { label: 'berlangsung', priority: 4 },
    'ended': { label: 'berakhir', priority: 5 },
    'cancelled': { label: 'dibatalkan', priority: 6 }
  };

  // Type mapping for Indonesian labels
  const typeMapping = {
    'online': 'chat',
    'offline': 'tatap muka'
  };

  // Function to sort consultations
  const sortConsultations = useCallback((consultations: Consultation[]): Consultation[] => {
    return [...consultations].sort((a, b) => {
      // Get date without time for comparison
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      
      // Set time to 00:00:00 to compare only dates
      dateA.setHours(0, 0, 0, 0);
      dateB.setHours(0, 0, 0, 0);
      
      const dateOnlyA = dateA.getTime();
      const dateOnlyB = dateB.getTime();
      
      // First sort by created date (newest date first)
      if (dateOnlyA !== dateOnlyB) {
        return dateOnlyB - dateOnlyA; // Newest date first
      }
      
      // If same date, sort by status priority
      const statusA = statusMapping[a.status as keyof typeof statusMapping]?.priority || 999;
      const statusB = statusMapping[b.status as keyof typeof statusMapping]?.priority || 999;
      
      return statusA - statusB;
    });
  }, []);

  // Function to transform API data into the format needed for ConsultationCard
  const transformApiData = useCallback((apiData: ApiConsultation[]): Consultation[] => {
    const transformed = apiData.map(consultation => ({
      id: consultation.id,
      userName: consultation.userName,
      architectName: consultation.architectName,
      type: consultation.type,
      total: consultation.total,
      status: consultation.status,
      reason: consultation.reason,
      userCity: consultation.userCity,
      location: consultation.location,
      startDate: consultation.startDate,
      endDate: consultation.endDate,
      createdAt: consultation.createdAt
    }));
    
    return sortConsultations(transformed);
  }, [sortConsultations]);

  // Function to refresh consultation statuses
  const refreshConsultations = async (token: string): Promise<boolean> => {
    try {
      const refreshResponse = await fetch('/api/konsultasi/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const refreshResult = await refreshResponse.json();
      
      if (refreshResponse.ok && refreshResult.code === 200) {
        console.log('Consultations refreshed successfully');
        return true;
      } else {
        console.warn('Failed to refresh consultations:', refreshResult.error || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.warn('Error refreshing consultations:', error);
      return false;
    }
  };

  // Fetch consultations from API
  const fetchConsultations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Step 1: Refresh consultations first
      await refreshConsultations(token);
      
      // Step 2: Fetch consultations using Next.js API route as a proxy to avoid CORS issues
      const response = await fetch('/api/konsultasi', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.code === 200) {
        // Transform and store the consultation data
        setConsultations(transformApiData(result.data));
        console.log(result.data)
      } else if (response.status === 401 || response.status === 403) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/login');
      } else {
        setError('Failed to load consultations. Please try again later.');
      }
    
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError('An error occurred while fetching consultations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [router, transformApiData]);

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if no token is found
      router.push('/login');
      return;
    }
    
    fetchConsultations();
    
  }, [fetchConsultations, router]);

  const handleEdit = (id: string) => {
    console.log(`View consultation with id: ${id}`);
    router.push(`/konsultasi/${id}`);
  };

  // Filter consultations based on search term with improved mapping
  const filteredConsultations = consultations.filter(consultation => {
    const searchLower = searchTerm.toLowerCase();
    
    // Get Indonesian status label
    const statusLabel = statusMapping[consultation.status as keyof typeof statusMapping]?.label || consultation.status;
    
    // Get Indonesian type label
    const typeLabel = typeMapping[consultation.type as keyof typeof typeMapping] || consultation.type;
    
    return (
      consultation.userName.toLowerCase().includes(searchLower) ||
      consultation.architectName.toLowerCase().includes(searchLower) ||
      consultation.userCity.toLowerCase().includes(searchLower) ||
      consultation.status.toLowerCase().includes(searchLower) ||
      statusLabel.toLowerCase().includes(searchLower) ||
      consultation.type.toLowerCase().includes(searchLower) ||
      typeLabel.toLowerCase().includes(searchLower)
    );
  });

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
            placeholder="Cari konsultasi berdasarkan nama, arsitek, kota, status, atau tipe konsultasi"
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
                onEdit={handleEdit}
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
    </div>
  );
};

export default Konsultasi;