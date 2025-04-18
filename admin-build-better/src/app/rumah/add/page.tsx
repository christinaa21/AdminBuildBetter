'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { H2, Subtitle } from '@/components/Typography';
import Button from '@/components/Button';
import ProgressSteps from '@/components/ProgressSteps';
import NavigationBar from '@/components/NavigationBar';

const AddHousePage = () => {
  const [currentStep] = useState(0);
  const steps = ['Informasi Dasar', 'Detail Rumah', 'Foto & Gambar', 'Konfirmasi'];

  // Form state
  const [formData, setFormData] = useState({
    architectName: '',
    landArea: '',
    designStyle: '',
    floors: '',
    rooms: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link href="/rumah" className="inline-flex items-center text-custom-green-300 mb-6">
            <FaArrowLeft className="w-5 h-5 mr-2" />
          </Link>
          
          {/* Page title */}
          <H2 className="text-custom-green-500 mb-8">Tambah Rumah</H2>
          
          {/* Progress steps */}
          <ProgressSteps
            steps={steps}
            currentStep={currentStep}
          />
          
          {/* Form */}
          <div className="mt-8">
            <Subtitle className="font-medium text-custom-green-500 mb-4">Unggah Desain</Subtitle>
            
            {/* House Design Upload */}
            <div className="mb-6">
              <Subtitle className="text-custom-green-400 mb-1">Desain Rumah (3 Perspektif)</Subtitle>
              <button className="w-full flex items-center justify-between border border-custom-green-300 rounded-md px-4 py-3 text-custom-green-300">
                <span>Unggah disini</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
            </div>
            
            {/* Floor Plan Upload */}
            <div className="mb-6">
              <Subtitle className="text-custom-green-400 mb-1">Denah Rumah</Subtitle>
              <button className="w-full flex items-center justify-between border border-custom-green-300 rounded-md px-4 py-3 text-custom-green-300">
                <span>Unggah disini</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
            </div>
            
            {/* Architect Name */}
            <div className="mb-6">
              <Subtitle className="text-custom-green-400 mb-1">Nama Arsitek</Subtitle>
              <input
                type="text"
                name="architectName"
                value={formData.architectName}
                onChange={handleChange}
                placeholder="Tulis disini"
                className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300"
              />
            </div>
            
            <Subtitle className="font-medium text-custom-green-500 mb-4 mt-8">Preferensi Desain</Subtitle>
            
            {/* Land Area */}
            <div className="mb-6">
              <Subtitle className="text-custom-green-400 mb-1">Luas Lahan (m2)</Subtitle>
              <input
                type="text"
                name="landArea"
                value={formData.landArea}
                onChange={handleChange}
                placeholder="Tulis disini"
                className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300"
              />
            </div>
            
            {/* Design Style */}
            <div className="mb-6">
              <Subtitle className="text-custom-green-400 mb-1">Gaya Desain</Subtitle>
              <select
                name="designStyle"
                value={formData.designStyle}
                onChange={handleChange}
                className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
              >
                <option value="" disabled>Pilih disini</option>
                <option value="modern">Modern</option>
                <option value="minimalis">Minimalis</option>
                <option value="industrial">Industrial</option>
                <option value="classic">Classic</option>
              </select>
            </div>
            
            {/* Number of Floors */}
            <div className="mb-6">
              <Subtitle className="text-custom-green-400 mb-1">Jumlah Lantai</Subtitle>
              <select
                name="floors"
                value={formData.floors}
                onChange={handleChange}
                className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
              >
                <option value="" disabled>Pilih disini</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </select>
            </div>
            
            {/* Number of Rooms */}
            <div className="mb-8">
              <Subtitle className="text-custom-green-400 mb-1">Jumlah Kamar</Subtitle>
              <select
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
              >
                <option value="" disabled>Pilih disini</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5+">5+</option>
              </select>
            </div>
            
            {/* Next Button */}
            <div className="flex justify-center">
              <Button 
                title="Selanjutnya" 
                variant="primary"
                fullWidth
                className="py-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHousePage;