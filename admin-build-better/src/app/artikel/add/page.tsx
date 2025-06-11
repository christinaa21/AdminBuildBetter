/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { H2 } from '@/components/Typography';
import Button from '@/components/Button';
import NavigationBar from '@/components/NavigationBar';

interface ArticleData {
    author: string;
    title: string;
    banner: File | null;
    content: string;
}

interface FormErrors {
    author?: string;
    title?: string;
    banner?: string;
    content?: string;
}

const AddArticlePage: React.FC = () => {
    const router = useRouter();
    const [articleData, setArticleData] = useState<ArticleData>({
        author: '',
        title: '',
        banner: null,
        content: '',
    });
    
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string>('');

    // Check for authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            // Redirect to login if no token is found
            router.push('/login');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;

        setArticleData({
            ...articleData,
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
                    banner: 'File yang diunggah harus berupa gambar',
                });
                return;
            }

            setSelectedFileName(file.name);
            setArticleData({
                ...articleData,
                banner: file,
            });

            // Clear error for image if it exists
            if (errors.banner) {
                setErrors({
                    ...errors,
                    banner: undefined,
                });
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        // Author field is now optional - no validation needed
        
        if (!articleData.title.trim()) {
            newErrors.title = 'Judul artikel wajib diisi';
        }
        
        if (!articleData.banner) {
            newErrors.banner = 'Gambar artikel wajib diunggah';
        }
        
        if (!articleData.content.trim()) {
            newErrors.content = 'Isi artikel wajib diisi';
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

        // Add string data - author can be empty now
        formData.append('author', articleData.author.trim());
        formData.append('title', articleData.title.trim());
        formData.append('content', articleData.content.trim());
        
        // Add image file
        if (articleData.banner) {
            formData.append('banner', articleData.banner);
        }

        try {
            // Get the token
            const token = localStorage.getItem('authToken');
            
            // Use the proxy API route
            const response = await fetch('/api/artikel', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            
            if (response.ok && (result.code === 200 || result.code === 201)) {
                // Success, redirect to artikel page
                router.push('/artikel');
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
                        if (errorMsg.includes('author:')) {
                            newErrors.author = 'Format nama penulis tidak valid';
                        } else if (errorMsg.includes('title:')) {
                            newErrors.title = 'Judul artikel wajib diisi';
                        } else if (errorMsg.includes('banner:')) {
                            newErrors.banner = 'Gambar artikel wajib diunggah';
                        } else if (errorMsg.includes('content:')) {
                            newErrors.content = 'Isi artikel wajib diisi';
                        }
                    });
                    
                    setErrors(newErrors);
                } else {
                    // Generic error message
                    setApiError('Gagal menambahkan artikel. Silakan coba lagi.');
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
                  <Link href="/artikel" className="text-custom-green-300">
                    <FaArrowLeft className="w-5 h-5" />
                  </Link>
                  <H2 className="text-custom-green-500 mx-auto">Tambah Artikel</H2>
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
                {/* Nama Penulis - Now Optional */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Nama Penulis
                    </label>
                    <input
                        type="text"
                        name="author"
                        value={articleData.author}
                        onChange={handleChange}
                        placeholder="Tulis disini (opsional)"
                        className={`w-full border ${errors.author ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
                    />
                    {errors.author && (
                        <p className="mt-1 text-red-500 text-sm">{errors.author}</p>
                    )}
                </div>

                {/* Judul Artikel */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Judul Artikel <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={articleData.title}
                        onChange={handleChange}
                        placeholder="Tulis disini"
                        className={`w-full border ${errors.title ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300`}
                    />
                    {errors.title && (
                        <p className="mt-1 text-red-500 text-sm">{errors.title}</p>
                    )}
                </div>
                
                {/* Gambar Artikel */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Gambar Artikel <span className="text-red-500">*</span>
                    </label>
                    <label 
                        className={`w-full flex items-center justify-between border ${errors.banner ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 text-custom-green-300 cursor-pointer`}
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
                    {errors.banner && (
                        <p className="mt-1 text-red-500 text-sm">{errors.banner}</p>
                    )}
                </div>

                {/* Isi Artikel */}
                <div className="mb-6">
                    <label className="block text-custom-green-400 mb-2">
                        Isi Artikel <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <textarea
                            name="content"
                            value={articleData.content}
                            onChange={handleChange}
                            placeholder="Tulis disini"
                            rows={8}
                            className={`w-full border ${errors.content ? 'border-red-300' : 'border-gray-200'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 resize-none`}
                        />
                        {/* Small edit icon in bottom right corner */}
                        <div className="absolute bottom-3 right-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path>
                            </svg>
                        </div>
                    </div>
                    {errors.content && (
                        <p className="mt-1 text-red-500 text-sm">{errors.content}</p>
                    )}
                </div>
              </div>
                
                {/* Submit button */}
                <div className="flex justify-center mt-8">
                  <Button 
                    title={isSubmitting ? "Menerbitkan..." : "Terbitkan"}
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

export default AddArticlePage;