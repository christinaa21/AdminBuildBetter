import React from 'react';
import Image from 'next/image';
import { FaTrash, FaSuitcase, FaEye } from 'react-icons/fa';
import { MdDesignServices, MdLocationPin } from "react-icons/md";
import { Title, Caption } from './Typography';

interface Architect {
  id: string;
  username: string;
  photo: string;
  experience: number | null;
  portfolio: string | null;
  city: string;
  rateOnline: string;
  rateOffline: string;
}

interface ArchitectCardProps {
  architect: Architect;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ArchitectCard: React.FC<ArchitectCardProps> = ({ architect, onView, onDelete }) => {
  return (
    <div className="bg-custom-white-50 rounded-2xl shadow-sm overflow-hidden relative">
      <div className="flex">
        {/* Left side - Image */}
        <div className="relative w-1/4 h-38">
          <Image
            src={architect.photo}
            alt={architect.username}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Right side - Content */}
        <div className="py-4 px-6 w-2/3">
          {/* Architect name */}
          <Title className="text-custom-olive-50 mb-2">{architect.username}</Title>
          
          {/* Architect details with pill styling */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Experience pill */}
            <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
              <FaSuitcase className="text-custom-green-200" />
              <Caption className="text-custom-green-200">
                {architect.experience !== null ? `${architect.experience} tahun` : '- tahun'}
              </Caption>
            </div>
            
            {/* Portfolio pill - disabled style when null */}
            {architect.portfolio ? (
              <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
                <MdDesignServices className="text-custom-green-200" />
                <a 
                  href={architect.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Caption className="text-custom-green-200">Portfolio</Caption>
                </a>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2 opacity-60 cursor-not-allowed">
                <MdDesignServices className="text-gray-400" />
                <Caption className="text-gray-400">Portfolio</Caption>
              </div>
            )}

            {/* City pill */}
            <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
              <MdLocationPin className="text-custom-green-200" />
              <Caption className="text-custom-green-200">{architect.city}</Caption>
            </div>
          </div>

          {/* Architect details with pill styling */}
          <div className="flex flex-wrap gap-2 mb-2">
            <Caption className="text-custom-green-200">Chat: {architect.rateOnline}/sesi</Caption>
            <Caption className="text-custom-green-200">|</Caption>
            <Caption className="text-custom-green-200">Tatap Muka: {architect.rateOffline}/sesi</Caption>
          </div>
        </div>
      </div>
      
      {/* Action buttons positioned in right side with vertical layout */}
      <div className="absolute top-0 right-0 h-full flex flex-col justify-center items-center bg-zinc-50 p-4 shadow-sm">
        {onView && (
          <button
            onClick={() => onView(architect.id)}
            className="p-3 mb-2 rounded-full bg-amber-100 text-amber-500 hover:bg-amber-200"
            aria-label="View"
          >
            <FaEye size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(architect.id)}
            className="p-3 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
            aria-label="Delete"
          >
            <FaTrash size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ArchitectCard;