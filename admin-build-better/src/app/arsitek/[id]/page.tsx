'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import { H2, H3, Body, Caption } from '@/components/Typography';
import Button from '@/components/Button';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaArrowLeft, FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';

interface ApiArchitect {
  id: string;
  email: string | null;
  password: string;
  username: string | null;
  photo: string | null;
  province: string | null;
  city: string | null;
  phoneNumber: string | null;
  experience: number | null;
  rateOnline: number | null;
  rateOffline: number | null;
  portfolio: string | null;
  createdAt: string;
  updatedAt: string;
}

const ArchitectDetail = () => {
  const router = useRouter();
  const params = useParams();
  const architectId = params.id as string;
  
  const [architect, setArchitect] = useState<ApiArchitect | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format rate as "Rp X.XXX.XXX"
  const formatCurrency = (amount: number | null): string => {
    if (amount === null) return 'Tidak tersedia';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch architect details from API
  const fetchArchitectDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      const response = await fetch(`/api/arsitek/${architectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.code === 200) {
        setArchitect(result.data);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        router.push('/login');
      } else {
        setError('Failed to load architect details. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching architect details:', error);
      setError('An error occurred while fetching architect details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [architectId, router]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchArchitectDetails();
  }, [fetchArchitectDetails, router]);

  const handleBack = () => {
    router.back();
  };

  const formatExperience = (years: number | null) => {
    if (years === null) return 'Tidak tersedia';
    return years === 1 ? '1 tahun' : `${years} tahun`;
  };
  
  const getWhatsAppLink = (phoneNumber: string | null) => {
    if (!phoneNumber) return '';
    // Clean the phone number to ensure it works with WhatsApp
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    // Add Indonesia country code if not present
    const formattedNumber = cleanNumber.startsWith('0') 
      ? `62${cleanNumber.substring(1)}` 
      : cleanNumber.startsWith('62') 
        ? cleanNumber 
        : `62${cleanNumber}`;
    
    return `https://wa.me/${formattedNumber}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-4 md:px-8 flex justify-center items-center">
          <div className="text-center">
            <p className="text-custom-olive-50 text-lg">Loading architect details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !architect) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-4 md:px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Architect not found'}</p>
            <div className="flex justify-center gap-4">
              <Button
                title='Go Back'
                variant='outline'
                icon={<FaArrowLeft className="text-sm"/>}
                onPress={handleBack}
              />
              <Button
                title='Try Again'
                variant='primary'
                onPress={fetchArchitectDetails}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavigationBar />
      
      <main className="container mx-auto py-8 px-4 md:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-custom-green-300 p-6">
            <div className="flex flex-col md:flex-row items-center">
              {/* Back Button */}
              <button 
                onClick={handleBack}
                className="text-white hover:text-gray-200 mr-4 self-start md:self-center"
              >
                <FaArrowLeft size={24} />
              </button>
              
              <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-4 border-white mb-4 md:mb-0 md:mr-6">
                <Image
                  src={architect?.photo || '/blank-profile.png'}
                  alt={architect?.username || 'Architect'}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                <H2 className="text-white">{architect?.username || 'Nama tidak tersedia'}</H2>
                <div className="flex items-center justify-center md:justify-start text-white mt-1">
                  <FaMapMarkerAlt className="mr-2" />
                  <Body>{architect?.city || 'Kota tidak tersedia'}{architect?.province ? `, ${architect.province}` : ''}</Body>
                </div>
                <div className="flex items-center justify-center md:justify-start text-white mt-1">
                  <FaBriefcase className="mr-2" />
                  <Body>{formatExperience(architect?.experience)}</Body>
                </div>
              </div>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
                {architect?.email && (
                  <Button
                    title='Email'
                    variant='outline'
                    icon={<FaEnvelope className="text-sm"/>}
                    onPress={() => window.location.href = `mailto:${architect.email}`}
                  />
                )}
                {architect?.phoneNumber && (
                  <Button
                    title='WhatsApp'
                    variant='outline'
                    icon={<FaWhatsapp className="text-sm"/>}
                    onPress={() => window.open(getWhatsAppLink(architect.phoneNumber), '_blank')}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Architect Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <div className="mb-6">
                  <H3 className="text-custom-olive-100 mb-4">Informasi Kontak</H3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaEnvelope className="text-custom-green-300 mr-3" />
                      <div>
                        <Caption className="text-custom-gray-200">Email</Caption>
                        <Body className="text-custom-olive-50">{architect?.email || 'Tidak tersedia'}</Body>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-custom-green-300 mr-3" />
                      <div>
                        <Caption className="text-custom-gray-200">Nomor Telepon</Caption>
                        <Body className="text-custom-olive-50">{architect?.phoneNumber || 'Tidak tersedia'}</Body>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-custom-green-300 mr-3" />
                      <div>
                        <Caption className="text-custom-gray-200">Lokasi</Caption>
                        <Body className="text-custom-olive-50">
                          {architect?.city || 'Kota tidak tersedia'}
                          {architect?.province ? `, ${architect.province}` : ''}
                        </Body>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <H3 className="text-custom-olive-100 mb-4">Tarif Konsultasi</H3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Caption className="text-custom-gray-200">Konsultasi via Chat</Caption>
                      <Body className="text-custom-olive-50 font-semibold">{formatCurrency(architect?.rateOnline)}</Body>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Caption className="text-custom-gray-200">Konsultasi Tatap Muka</Caption>
                      <Body className="text-custom-olive-50 font-semibold">{formatCurrency(architect?.rateOffline)}</Body>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div>
                <H3 className="text-custom-olive-100 mb-4">Portfolio</H3>
                {architect?.portfolio ? (
                  <div className="prose max-w-none text-custom-olive-50">
                    <p>
                      {architect.portfolio.startsWith('http') ? (
                        <a 
                          href={architect.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-custom-green-300 hover:underline"
                        >
                          {architect.portfolio}
                        </a>
                      ) : (
                        architect.portfolio
                      )}
                      </p>
                  </div>
                ) : (
                  <p className="text-custom-gray-200 italic">Portfolio tidak tersedia</p>
                )}
                
                <div className="mt-6">
                  <H3 className="text-custom-olive-100 mb-4">Informasi Lainnya</H3>
                  <div className="space-y-3">
                    <div>
                      <Caption className="text-custom-gray-200">Pengalaman</Caption>
                      <Body className="text-custom-olive-50">{formatExperience(architect?.experience)}</Body>
                    </div>
                    <div>
                      <Caption className="text-custom-gray-200">Bergabung Sejak</Caption>
                      <Body className="text-custom-olive-50">
                        {architect?.createdAt ? new Date(architect.createdAt).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        }) : 'Tidak tersedia'}
                      </Body>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArchitectDetail;