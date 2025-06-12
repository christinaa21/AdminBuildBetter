/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import Button from '@/components/Button';
import { Title, H2, Body, Caption } from '@/components/Typography';
import { FaArrowLeft } from 'react-icons/fa';

interface Consultation {
  id: string;
  userName: string;
  architectName: string;
  type: string;
  total: number | null;
  status: string;
  reason: string | null;
  userCity: string;
  architectCity: string;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface PaymentData {
  id: string;
  consultationId: string;
  proofPayment: string;
  uploadProofPayment: number;
  paymentMethod: string;
  sender: string;
}

const ApprovalPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const consultationId = params?.id as string;

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for confirmation buttons
  const [paymentConfirmed, setPaymentConfirmed] = useState<boolean | null>(null);
  const [scheduleConfirmed, setScheduleConfirmed] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status configuration
  const statusConfig = {
    'waiting-for-payment': { 
      backgroundColor: 'bg-yellow-50', 
      dotColor: 'bg-yellow-500', 
      textColor: 'text-custom-olive-50',
      label: 'Menunggu Pembayaran'
    },
    'waiting-for-confirmation': { 
      backgroundColor: 'bg-orange-50', 
      dotColor: 'bg-orange-500', 
      textColor: 'text-custom-olive-50',
      label: 'Menunggu Konfirmasi'
    },
    'cancelled': { 
      backgroundColor: 'bg-red-50', 
      dotColor: 'bg-red-600', 
      textColor: 'text-custom-olive-50',
      label: 'Dibatalkan'
    },
    'scheduled': { 
      backgroundColor: 'bg-custom-green-25', 
      dotColor: 'bg-custom-green-300', 
      textColor: 'text-custom-olive-50',
      label: 'Dijadwalkan'
    },
    'in-progress': { 
      backgroundColor: 'bg-blue-50', 
      dotColor: 'bg-blue-500', 
      textColor: 'text-custom-olive-50',
      label: 'Berlangsung'
    },
    'ended': { 
      backgroundColor: 'bg-custom-gray-50', 
      dotColor: 'bg-custom-olive-50', 
      textColor: 'text-custom-olive-50',
      label: 'Berakhir'
    }
  };

  // Check if confirmation buttons should be enabled
  const isConfirmationEnabled = consultation?.status === 'waiting-for-confirmation';

  // Fetch consultation data
  const fetchConsultationData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/');
        return;
      }

      // Fetch consultation data
      const consultationResponse = await fetch(`/api/konsultasi/${consultationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!consultationResponse.ok) {
        throw new Error('Failed to fetch consultation data');
      }

      const consultationResult = await consultationResponse.json();
      if (consultationResult.code === 200) {
        setConsultation(consultationResult.data);
      }

      // Fetch payment data
      const paymentResponse = await fetch(`/api/konsultasi/${consultationId}/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const paymentResult = await paymentResponse.json();
      if (paymentResult.code === 200) {
        setPaymentData(paymentResult.data);
      } else {
        // Payment not found is acceptable
        setPaymentData(null);
      }
      

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Terjadi kesalahan saat memuat data. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [consultationId, router]);

  useEffect(() => {
    if (consultationId) {
      fetchConsultationData();
    }
  }, [consultationId, fetchConsultationData]);

  // Format functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return '-';
    return `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;
  };

  const getConsultationType = (type: string) => {
    return type === 'online' ? 'Chat' : 'Tatap Muka';
  };

  // Handle approval/rejection
  const handleFinalSubmit = async () => {
    if (paymentConfirmed === null || scheduleConfirmed === null) {
      alert('Harap konfirmasi semua bagian terlebih dahulu.');
      return;
    }

    if (!isConfirmationEnabled) {
      alert('Konfirmasi tidak dapat dilakukan untuk status saat ini.');
      return;
    }

    setIsSubmitting(true);

    try {
      const isApproved = paymentConfirmed && scheduleConfirmed;
      
      if (isApproved) {
        const response = await fetch(`/api/konsultasi/${consultationId}/approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();
        if (result.code === 200) {
          alert('Konsultasi berhasil disetujui!');
        } else if (result.code === 400 && result.errror === "Consultation start date cannot be in the past") {
          alert('Jadwal konsultasi telah berlalu! Booking dibatalkan otomatis.')
        }
          else {
          throw new Error('Failed to approve consultation');
        }
        
      } else {
          let message: string;
          if (!paymentConfirmed) {
              message = "proof of payment is invalid";
          } else { // This case implies scheduleConfirmed is false
              message = "architect is unavailable";
          }

          console.log('Rejecting consultation:', consultationId, 'with message:', message);
          
          const token = localStorage.getItem('authToken');
          if (!token) {
              router.push('/');
              return;
          }

          const response = await fetch(`/api/konsultasi/${consultationId}/reject`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ message })
          });

          if (!response.ok) {
              const errorResult = await response.json();
              // Provide a more specific error message
              throw new Error(errorResult.error || 'Failed to reject consultation');
          }

          const result = await response.json();
          if (result.code === 200) {
              alert('Konsultasi berhasil ditolak!');
          } else {
              // This case might not be reached if using response.ok check, but good for safety
              throw new Error(result.error || 'Failed to reject consultation');
          }
      }

      // Navigate back to consultations list
      router.push('/konsultasi');

    } catch (error) {
      console.error('Error submitting approval:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-8 flex justify-center items-center">
          <div className="text-center">
            <p className="text-custom-olive-50 text-lg">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="min-h-screen">
        <NavigationBar />
        <div className="container mx-auto py-8 px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Data konsultasi tidak ditemukan'}</p>
            <Button
              title='Kembali'
              variant='outline'
              onPress={() => router.push('/konsultasi')}
            />
          </div>
        </div>
      </div>
    );
  }

  const currentStatus = statusConfig[consultation.status as keyof typeof statusConfig] || statusConfig['waiting-for-confirmation'];

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <main className="container max-w-6xl mx-auto py-6 px-4 flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center mb-4">
            <button onClick={() => router.back()} className="text-custom-green-300">
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <H2 className="text-custom-green-500 mx-auto">Persetujuan Pengajuan Konsultasi</H2>
            {/* Empty div to balance the arrow on the left */}
            <div className="w-5"></div>
          </div>
          {/* Status Chip */}
          <div className="flex justify-center mb-3">
            <div className={`${currentStatus.backgroundColor} rounded-full px-4 py-2 flex items-center gap-2`}>
              <div className={`w-2 h-2 rounded-full ${currentStatus.dotColor}`}></div>
              <Caption className={currentStatus.textColor}>{currentStatus.label}</Caption>
            </div>
          </div>
          {/* Reason (if cancelled) */}
          {consultation.status === 'cancelled' && consultation.reason && (
            <div className="mb-8 ph-3 rounded-lg">
              <Caption className="text-red-600">
                Alasan: {consultation.reason === 'architect is unavailable' ? 'Arsitek tidak tersedia' :
                        consultation.reason === 'proof of payment is invalid' ? 'Bukti pembayaran tidak valid' :
                        consultation.reason === 'user cancelled the consultation' ? 'Pengguna membatalkan konsultasi' :
                        consultation.reason}
              </Caption>
            </div>
          )}
        </div>


        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Column - User Info */}
            <div className="flex flex-col space-y-4">
              <div className='flex justify-between mx-4'>
                <Title className="text-custom-olive-50">Nama User</Title>
                <Body className="text-custom-olive-50">{consultation.userName}</Body>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col justify-between">
                <div>
                  <Title className="text-custom-olive-50 mb-4">Informasi Pembayaran</Title>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Body className="text-custom-olive-50">Bayar lewat apa tadi?</Body>
                      <Body className="text-custom-olive-50">{paymentData?.paymentMethod || '-'}</Body>
                    </div>
                    <div className="flex justify-between">
                      <Body className="text-custom-olive-50">Atas nama siapa?</Body>
                      <Body className="text-custom-olive-50">{paymentData?.sender || '-'}</Body>
                    </div>
                    <div className="flex justify-between">
                      <Body className="text-custom-olive-50">Jumlah yang seharusnya dibayar</Body>
                      <Body className="text-custom-olive-50">{formatPrice(consultation.total)}</Body>
                    </div>
                    <div className="flex justify-between items-center">
                      <Body className="text-custom-olive-50">Bukti bayar</Body>
                      {paymentData?.proofPayment ? (
                        <a 
                          href={paymentData.proofPayment} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-custom-green-300 hover:text-custom-green-500 underline"
                        >
                          klik disini
                        </a>
                      ) : (
                        <Body className="text-custom-olive-50">-</Body>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Title className="text-custom-olive-50 mb-4">Konfirmasi Pembayaran</Title>
                  <Body className="text-custom-olive-50 mb-4">Apakah pembayaran benar-benar sudah berhasil?</Body>
                  
                  {!isConfirmationEnabled && (
                    <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                      <Caption className="text-gray-600">Konfirmasi tidak tersedia untuk status saat ini</Caption>
                    </div>
                  )}
                  
                  <div className="flex justify-center gap-8">
                    <Button
                      title="Ya, sudah"
                      variant={paymentConfirmed === true ? "primary" : "outline"}
                      onPress={() => isConfirmationEnabled && setPaymentConfirmed(true)}
                      disabled={!isConfirmationEnabled}
                    />
                    <Button
                      title="Tidak"
                      variant={paymentConfirmed === false ? "primary" : "outline"}
                      onPress={() => isConfirmationEnabled && setPaymentConfirmed(false)}
                      disabled={!isConfirmationEnabled}
                      className={paymentConfirmed === false ? "bg-red-500 border-red-500 text-white hover:bg-red-600 outline-red-500" : "hover:bg-red-50 hover:border-red-300 hover:text-red-500"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Architect Info */}
            <div className="flex flex-col space-y-4">
              <div className='flex justify-between mx-4'>
                <Title className="text-custom-olive-50">Nama Arsitek</Title>
                <Body className="text-custom-olive-50">{consultation.architectName}</Body>
              </div>

              {/* Schedule Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col justify-between">
                <div>
                  <Title className="text-custom-olive-50 mb-4">Informasi Jadwal</Title>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Body className="text-custom-olive-50">Tanggal yang dipilih</Body>
                      <Body className="text-custom-olive-50">{formatDate(consultation.startDate)}</Body>
                    </div>
                    <div className="flex justify-between">
                      <Body className="text-custom-olive-50">Waktu yang dipilih</Body>
                      <Body className="text-custom-olive-50">
                        {formatTime(consultation.startDate)} - {formatTime(consultation.endDate)}
                      </Body>
                    </div>
                    <div className="flex justify-between">
                      <Body className="text-custom-olive-50">Tipe Konsultasi</Body>
                      <Body className="text-custom-olive-50">{getConsultationType(consultation.type)}</Body>
                    </div>
                    
                    {/* Show location info only for offline consultations */}
                    {consultation.type === 'offline' && (
                      <>
                        <div className="flex justify-between">
                          <Body className="text-custom-olive-50">Kota User</Body>
                          <Body className="text-custom-olive-50">{consultation.userCity}</Body>
                        </div>
                        <div className="flex justify-between">
                          <Body className="text-custom-olive-50">Kota Arsitek</Body>
                          <Body className="text-custom-olive-50">{consultation.architectCity}</Body>
                        </div>
                        <div className="flex justify-between items-center">
                          <Body className="text-custom-olive-50">Lokasi bertemu</Body>
                          {consultation.location ? (
                            <a 
                              href={consultation.location} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-custom-green-300 hover:text-custom-green-500 underline"
                            >
                              {consultation.location.includes('g.co') ? 'Google Maps' : 'Lokasi'}
                            </a>
                          ) : (
                            <Body className="text-custom-olive-50">-</Body>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Title className="text-custom-olive-50 mb-4">Konfirmasi Jadwal</Title>
                  <Body className="text-custom-olive-50 mb-4">
                    Apakah arsitek bersedia di jadwal dan lokasi tersebut?
                  </Body>
                  
                  {!isConfirmationEnabled && (
                    <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                      <Caption className="text-gray-600">Konfirmasi tidak tersedia untuk status saat ini</Caption>
                    </div>
                  )}
                  
                  <div className="flex gap-8 justify-center">
                    <Button
                      title="Ya, bersedia"
                      variant={scheduleConfirmed === true ? "primary" : "outline"}
                      onPress={() => isConfirmationEnabled && setScheduleConfirmed(true)}
                      disabled={!isConfirmationEnabled}
                      className={scheduleConfirmed === true ? "" : "hover:bg-custom-green-100"}
                    />
                    <Button
                      title="Tidak"
                      variant={scheduleConfirmed === false ? "primary" : "outline"}
                      onPress={() => isConfirmationEnabled && setScheduleConfirmed(false)}
                      disabled={!isConfirmationEnabled}
                      className={scheduleConfirmed === false ? "bg-red-500 border-red-500 text-white hover:bg-red-600 outline-red-500" : "hover:bg-red-50 hover:border-red-300 hover:text-red-500"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Confirmation Button */}
          <div className="mt-8 justify-self-center">
            <Button
              title={isSubmitting ? "Memproses..." : "Konfirmasi Konsultasi"}
              variant="primary"
              onPress={handleFinalSubmit}
              disabled={isSubmitting || paymentConfirmed === null || scheduleConfirmed === null || !isConfirmationEnabled}
              size="lg"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApprovalPage;