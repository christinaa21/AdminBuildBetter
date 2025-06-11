import React from 'react';
import Image from 'next/image';
import { FaUser, FaCalendar, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Title, Caption } from './Typography';

interface Artikel {
  id: string;
  author: string;
  title: string;
  banner: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ArtikelCardProps {
  artikel: Artikel;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ArtikelCard: React.FC<ArtikelCardProps> = ({ artikel, onEdit, onDelete }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-custom-white-50 rounded-2xl shadow-sm overflow-hidden relative">
      <div className="flex">
        {/* Left side - Image */}
        <div className="relative w-1/4 h-50">
          <Image
            src={artikel.banner || '/blank.png'}
            alt={artikel.title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Right side - Content */}
        <div className="pt-4 pb-2 px-6 w-2/3">
          {/* Article title */}
          <Title className="text-custom-olive-50 mb-2 line-clamp-2">
            {artikel.title}
          </Title>

          {/* Content preview */}
          <div className="mb-2">
            <Caption className="text-gray-500 line-clamp-3">
              {truncateContent(artikel.content)}
            </Caption>
          </div>
          
          {/* Article details as simple text */}
          <div className='flex-row flex justify-between mt-2 mb-4'>
                <Caption className="text-custom-gray-200">Penulis: {artikel.author ? (artikel.author) : ("-")}</Caption>
                <Caption className="text-custom-gray-200">Diterbitkan tanggal: {formatDate(artikel.createdAt)}</Caption>
          </div>
        </div>
      </div>
      
      {/* Action buttons positioned in right side with vertical layout */}
      <div className="absolute top-0 right-0 h-full flex flex-col justify-center items-center bg-zinc-50 p-4 shadow-sm">
        {onEdit && (
          <button
            onClick={() => onEdit(artikel.id)}
            className="p-3 mb-2 rounded-full bg-amber-100 text-amber-500 hover:bg-amber-200"
            aria-label="Edit"
          >
            <FaPencilAlt size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(artikel.id)}
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

export default ArtikelCard;