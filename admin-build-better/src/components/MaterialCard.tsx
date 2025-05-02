import React from 'react';
import Image from 'next/image';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Body } from './Typography';

interface Material {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

interface MaterialCardProps {
  material: Material;
  onEdit: (id: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onEdit }) => {
  return (
    <div className="bg-custom-white-50 rounded-2xl shadow-sm overflow-hidden relative">
      <div className="flex">
        {/* Left side - Image */}
        <div className="relative w-1/3 h-20">
          <Image
            src={material.imageUrl}
            alt={material.name}
            fill
            className="object-cover"
            onError={(e) => {
              // Handle image load errors
              const target = e.target as HTMLImageElement;
              target.src = '/blank.png'; // Fallback image
            }}
          />
        </div>
        
        {/* Right side - Content */}
        <div className="p-4 w-2/3 flex items-center">
          {/* Material name */}
          <Body className="text-custom-olive-50">{material.name}</Body>
        </div>
      </div>
      
      {/* Action buttons positioned in right side with vertical layout */}
      <div className="absolute top-0 right-0 h-full flex flex-col justify-center items-center bg-zinc-50 p-2 shadow-sm">
        {onEdit && (
          <button
            onClick={() => onEdit(material.id)}
            className="p-3 mb-2 rounded-full bg-amber-100 text-amber-500 hover:bg-amber-200"
            aria-label="Edit"
          >
            <FaPencilAlt size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MaterialCard;