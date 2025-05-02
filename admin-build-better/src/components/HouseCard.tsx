import React from 'react';
import Image from 'next/image';
import { BiArea } from 'react-icons/bi';
import { FaHome, FaBed, FaLayerGroup, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Title, Caption } from './Typography';

interface House {
  id: string;
  name: string;
  imageUrl: string;
  size: string;
  style: string;
  floors: number;
  bedrooms: number;
}

interface HouseCardProps {
  house: House;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const HouseCard: React.FC<HouseCardProps> = ({ house, onEdit, onDelete }) => {
  return (
    <div className="bg-custom-white-50 rounded-2xl shadow-sm overflow-hidden relative">
      <div className="flex">
        {/* Left side - Image */}
        <div className="relative w-1/4 h-38">
          <Image
            src={house.imageUrl}
            alt={house.name}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Right side - Content */}
        <div className="py-4 px-6 w-2/3">
          {/* House name */}
          <Title className="text-custom-olive-50 mb-2">{house.name}</Title>
          
          {/* House details with pill styling */}
          <div className="flex flex-wrap gap-2 mb-2">
            {/* Size pill */}
            <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
              <BiArea className="text-custom-green-200" />
              <Caption className="text-custom-green-200">{house.size}</Caption>
            </div>
            
            {/* Style pill */}
            <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
              <FaHome className="text-custom-green-200" />
              <Caption className="text-custom-green-200">{house.style}</Caption>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Floors pill */}
            <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
              <FaLayerGroup className="text-custom-green-200" />
              <Caption className="text-custom-green-200">{house.floors} Lantai</Caption>
            </div>
            
            {/* Bedrooms pill */}
            <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
              <FaBed className="text-custom-green-200" />
              <Caption className="text-custom-green-200">{house.bedrooms} Kamar Tidur</Caption>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons positioned in right side with vertical layout */}
      <div className="absolute top-0 right-0 h-full flex flex-col justify-center items-center bg-zinc-50 p-4 shadow-sm">
        {onEdit && (
          <button
            onClick={() => onEdit(house.id)}
            className="p-3 mb-2 rounded-full bg-amber-100 text-amber-500 hover:bg-amber-200"
            aria-label="Edit"
          >
            <FaPencilAlt size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(house.id)}
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

export default HouseCard;