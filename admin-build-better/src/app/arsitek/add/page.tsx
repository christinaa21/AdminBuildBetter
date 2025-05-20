'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { H2 } from '@/components/Typography';
import Button from '@/components/Button';
import NavigationBar from '@/components/NavigationBar';
import locationData from '@/data/location.json';

interface ArsitekData {
    email: string;
    username: string;
    province: string;
    city: string;
}

interface FormErrors {
    email?: string;
    username?: string;
    province?: string;
    city?: string;
}

const AddArsitekPage: React.FC = () => {
    const router = useRouter();
    const [arsitekData, setArsitekData] = useState<ArsitekData>({
        email: '',
        username: '',
        province: '',
        city: '',
    });
    
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableCities, setAvailableCities] = useState<{label: string, value: string}[]>([]);

    // Check for authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            // Redirect to login if no token is found
            router.push('/login');
        }
    }, [router]);

    // Update cities when province changes
    useEffect(() => {
        if (arsitekData.province) {
            const provinceData = locationData.provinces.find(
                (item) => item.label === arsitekData.province
            );
            
            if (provinceData) {
                setAvailableCities(provinceData.cities);
                // Reset city if current value isn't in the new list
                if (!provinceData.cities.some(city => city.label === arsitekData.city)) {
                    setArsitekData(prev => ({
                        ...prev,
                        city: '',
                    }));
                }
            }
        } else {
            setAvailableCities([]);
        }
    }, [arsitekData.province, arsitekData.city]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;

        setArsitekData({
            ...arsitekData,
            [name]: value,
        });

        // Clear error for this field if it exists
        if (errors[name as keyof FormErrors]) {
            setErrors({
                ...errors,
                [name]: undefined,
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        // Email validation
        if (!arsitekData.email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(arsitekData.email)) {
            newErrors.email = 'Format email tidak valid';
        }
        
        if (!arsitekData.username.trim()) {
            newErrors.username = 'Nama lengkap wajib diisi';
        }
        
        if (!arsitekData.province) {
            newErrors.province = 'Provinsi wajib dipilih';
        }
        
        if (!arsitekData.city) {
            newErrors.city = 'Kota wajib dipilih';
        }
        
        setErrors(newErrors);
        
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (): Promise<void> => {
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        setApiError(null);
        
        const formData = new FormData();

        // Add data to formData
        formData.append('email', arsitekData.email);
        formData.append('username', arsitekData.username);
        formData.append('province', arsitekData.province);
        formData.append('city', arsitekData.city);

        try {
            // Get the token
            const token = localStorage.getItem('authToken');
            
            // Use the proxy API route
            const response = await fetch('/api/arsitek', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // No Content-Type header - let the browser set it for FormData
                },
                body: formData,
            });

            const result = await response.json();
            
            if (response.ok && (result.code === 200 || result.code === 201)) {
                // Success, redirect to arsitek page
                router.push('/arsitek');
            } else if (response.status === 401 || response.status === 403) {
                // Handle unauthorized access
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                router.push('/login');
            } else {
                // Handle API errors
                if (result.error && Array.isArray(result.error)) {
                    // Process field-specific errors
                    const newErrors: FormErrors = {};
                    
                    result.error.forEach((errorMsg: string) => {
                        if (errorMsg.includes('email:')) {
                            newErrors.email = 'Email wajib diisi dengan format yang benar';
                        } else if (errorMsg.includes('username:')) {
                            newErrors.username = 'Nama lengkap wajib diisi';
                        } else if (errorMsg.includes('province:')) {
                            newErrors.province = 'Provinsi wajib dipilih';
                        } else if (errorMsg.includes('city:')) {
                            newErrors.city = 'Kota wajib dipilih';
                        }
                    });
                    
                    setErrors(newErrors);
                } else if (result.message) {
                    // If there's a specific message from the API
                    setApiError(result.message);
                } else {
                    // Generic error message
                    setApiError('Gagal menambahkan arsitek. Silakan coba lagi.');
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setApiError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
          <NavigationBar />
          
          <div className="container mx-auto px-4 py-6 flex-1">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center mb-8">
                  <Link href="/arsitek" className="text-custom-green-300">
                    <FaArrowLeft className="w-5 h-5" />
                  </Link>
                  <H2 className="text-custom-green-500 mx-auto">Tambah Arsitek</H2>
                  {/* Empty div to balance the arrow on the left */}
                  <div className="w-5"></div>
                </div>
              
              {/* API Error message */}
              {apiError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                  {apiError}
                </div>
              )}
              
              {/* Form */}
              <div className="mt-8 mb-8">
                {/* Email */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={arsitekData.email}
                        onChange={handleChange}
                        placeholder="Contoh: arsitek@email.com"
                        className={`w-full border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                    )}
                </div>
                
                {/* Username (Full Name) */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={arsitekData.username}
                        onChange={handleChange}
                        placeholder="Tulis nama lengkap"
                        className={`w-full border ${errors.username ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
                    />
                    {errors.username && (
                        <p className="mt-1 text-red-500 text-sm">{errors.username}</p>
                    )}
                </div>
                
                {/* Province */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Provinsi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="province"
                            value={arsitekData.province}
                            onChange={handleChange}
                            className={`w-full border ${errors.province ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none`}
                        >
                            <option value="" disabled>Pilih provinsi</option>
                            {locationData.provinces.map((province) => (
                                <option key={province.value} value={province.label}>
                                    {province.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                    {errors.province && (
                        <p className="mt-1 text-red-500 text-sm">{errors.province}</p>
                    )}
                </div>

                {/* City */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Kota <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="city"
                            value={arsitekData.city}
                            onChange={handleChange}
                            disabled={!arsitekData.province}
                            className={`w-full border ${errors.city ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none ${!arsitekData.province ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="" disabled>
                                {arsitekData.province ? 'Pilih kota' : 'Pilih provinsi terlebih dahulu'}
                            </option>
                            {availableCities.map((city) => (
                                <option key={city.value} value={city.label}>
                                    {city.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                    {errors.city && (
                        <p className="mt-1 text-red-500 text-sm">{errors.city}</p>
                    )}
                </div>
              </div>
                
                {/* Navigation buttons */}
                <div className="flex justify-center mt-8">
                  <Button 
                    title={isSubmitting ? "Menyimpan..." : "Simpan"}
                    variant="primary"
                    fullWidth
                    className="py-3"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  />
                </div>
                
                {/* Required fields note */}
                <div className="text-sm text-gray-500 mt-4 text-center">
                  <span className="text-red-500">*</span> Kolom wajib diisi
                </div>
            </div>
          </div>
        </div>
    );
};

export default AddArsitekPage;