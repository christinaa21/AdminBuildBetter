'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { H2 } from '@/components/Typography';
import Button from '@/components/Button';
import NavigationBar from '@/components/NavigationBar';

interface MaterialData {
    name: string;
    category: string;
    subCategory: string;
    image: File | null;
}

interface FormErrors {
    name?: string;
    category?: string;
    subCategory?: string;
    image?: string;
}

const materialCategory = [
    {category: "Atap", subCategory: ["Atap", "Struktur Atap", "Plafon"]},
    {category: "Dinding", subCategory: ["Pelapis Dinding", "Struktur Dinding"]},
    {category: "Lantai", subCategory: ["Pelapis"]},
    {category: "Bukaan", subCategory: ["Pintu", "Daun Jendela", "Frame Jendela"]},
    {category: "Balok-Kolom", subCategory: ["Struktur Balok-Kolom"]}
];

const AddMaterialPage: React.FC = () => {
    const router = useRouter();
    const [materialData, setMaterialData] = useState<MaterialData>({
        name: '',
        category: '',
        subCategory: '',
        image: null,
    });
    
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);
    const [selectedFileName, setSelectedFileName] = useState<string>('');

    // Check for authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            // Redirect to login if no token is found
            router.push('/');
        }
    }, [router]);

    // Update subcategories when category changes
    useEffect(() => {
        if (materialData.category) {
            const categoryData = materialCategory.find(item => item.category === materialData.category);
            if (categoryData) {
                setAvailableSubCategories(categoryData.subCategory);
                // Reset subcategory if current value isn't in the new list
                if (!categoryData.subCategory.includes(materialData.subCategory)) {
                    setMaterialData(prev => ({
                        ...prev,
                        subCategory: '',
                    }));
                }
            }
        } else {
            setAvailableSubCategories([]);
        }
    }, [materialData.category, materialData.subCategory]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;

        setMaterialData({
            ...materialData,
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0] || null;
        
        if (file) {
            // Check if it's a valid image file
            if (!file.type.startsWith('image/')) {
                setErrors({
                    ...errors,
                    image: 'File yang diunggah harus berupa gambar',
                });
                return;
            }

            setSelectedFileName(file.name);
            setMaterialData({
                ...materialData,
                image: file,
            });

            // Clear error for image if it exists
            if (errors.image) {
                setErrors({
                    ...errors,
                    image: undefined,
                });
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!materialData.name.trim()) {
            newErrors.name = 'Nama material wajib diisi';
        }
        
        if (!materialData.category) {
            newErrors.category = 'Kategori wajib dipilih';
        }
        
        if (!materialData.subCategory) {
            newErrors.subCategory = 'Subkategori wajib dipilih';
        }
        
        if (!materialData.image) {
            newErrors.image = 'Gambar material wajib diunggah';
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

        // Add string data with capitalization
        formData.append('name', (materialData.name));
        formData.append('category', (materialData.category));
        formData.append('subCategory', (materialData.subCategory));
        
        // Add image file
        if (materialData.image) {
            formData.append('image', materialData.image);
        }

        try {
            // Get the token
            const token = localStorage.getItem('authToken');
            
            // Use the proxy API route
            const response = await fetch('/api/materials', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            
            if (response.ok && result.code === 200) {
                // Success, redirect to material page
                router.push('/material');
            } else if (response.status === 401 || response.status === 403) {
                // Handle unauthorized access
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                router.push('/');
            } else {
                // Handle API errors
                if (result.error && Array.isArray(result.error)) {
                    // Process field-specific errors
                    const newErrors: FormErrors = {};
                    
                    result.error.forEach((errorMsg: string) => {
                        if (errorMsg.includes('name:')) {
                            newErrors.name = 'Nama material wajib diisi';
                        } else if (errorMsg.includes('category:')) {
                            newErrors.category = 'Kategori wajib dipilih';
                        } else if (errorMsg.includes('subCategory:')) {
                            newErrors.subCategory = 'Subkategori wajib dipilih';
                        } else if (errorMsg.includes('image:')) {
                            newErrors.image = 'Gambar material wajib diunggah';
                        }
                    });
                    
                    setErrors(newErrors);
                } else {
                    // Generic error message
                    setApiError('Gagal menambahkan material. Silakan coba lagi.');
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
                  <Link href="/material" className="text-custom-green-300">
                    <FaArrowLeft className="w-5 h-5" />
                  </Link>
                  <H2 className="text-custom-green-500 mx-auto">Tambah Material</H2>
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
                {/* Nama Material */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Nama Material <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={materialData.name}
                        onChange={handleChange}
                        placeholder="Tulis disini"
                        className={`w-full border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
                    />
                    {errors.name && (
                        <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
                    )}
                </div>
                
                {/* Gambar Material */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Gambar Material <span className="text-red-500">*</span>
                    </label>
                    <label 
                        className={`w-full flex items-center justify-between border ${errors.image ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 text-custom-green-300 cursor-pointer`}
                    >
                        <span>{selectedFileName || 'Unggah disini'}</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </label>
                    {errors.image && (
                        <p className="mt-1 text-red-500 text-sm">{errors.image}</p>
                    )}
                </div>
                
                {/* Kategori Material */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Kategori Material <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="category"
                            value={materialData.category}
                            onChange={handleChange}
                            className={`w-full border ${errors.category ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none`}
                        >
                            <option value="" disabled>Pilih disini</option>
                            {materialCategory.map((cat) => (
                                <option key={cat.category} value={cat.category}>
                                    {cat.category}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                    {errors.category && (
                        <p className="mt-1 text-red-500 text-sm">{errors.category}</p>
                    )}
                </div>

                {/* Subkategori Material */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Subkategori Material <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="subCategory"
                            value={materialData.subCategory}
                            onChange={handleChange}
                            disabled={!materialData.category}
                            className={`w-full border ${errors.subCategory ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none ${!materialData.category ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="" disabled>
                                {materialData.category ? 'Pilih disini' : 'Pilih kategori terlebih dahulu'}
                            </option>
                            {availableSubCategories.map((subCat) => (
                                <option key={subCat} value={subCat}>
                                    {subCat}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                    {errors.subCategory && (
                        <p className="mt-1 text-red-500 text-sm">{errors.subCategory}</p>
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

export default AddMaterialPage;