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
      city: consultation.city,
      location: consultation.location,
      startDate: consultation.startDate,
      endDate: consultation.endDate,
      createdAt: consultation.createdAt
    }));
    
    return sortConsultations(transformed);
  }, [sortConsultations]);

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
      // // Simulate API delay
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // // Use mock data instead of API call
      // setConsultations(sortConsultations(mockConsultations));
      
      
      // Uncomment this section when you want to use real API
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Use Next.js API route as a proxy to avoid CORS issues
      const response = await fetch('/api/konsultasi', {
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
    
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError('An error occurred while fetching consultations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [router, transformApiData]);

  // Check for authentication on component mount (disabled for testing with mock data)
  useEffect(() => {
    // Skip authentication check for testing with mock data
    // setConsultations(sortConsultations(mockConsultations));
    // setIsLoading(false);
    
    // Uncomment this section when you want to use real authentication
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
      consultation.city.toLowerCase().includes(searchLower) ||
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