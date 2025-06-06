import React from 'react';
import { FaComments, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaHandshake, FaEdit } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { Title, Body, Caption } from './Typography';

interface Consultation {
  id: string;
  userName: string;
  architectName: string;
  type: string;
  total: number | null;
  status: string;
  reason: string | null;
  userCity: string;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface ConsultationCardProps {
  consultation: Consultation;
  onEdit?: (id: string) => void;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ consultation, onEdit }) => {
  // Status mapping with Tailwind colors
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

  const currentStatus = statusConfig[consultation.status as keyof typeof statusConfig] || statusConfig['waiting-for-payment'];

  // Format date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
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
    return `Rp${new Intl.NumberFormat('id-ID').format(price)}`;
  };

  return (
    <div className="bg-custom-white-50 rounded-2xl shadow-sm overflow-hidden relative p-6 pr-20">
      {/* Header */}
      <div className="mb-2 flex justify-between items-start">
        <div>
          <Title className="text-custom-olive-50 mb-1">{consultation.userName}</Title>
          <Body className="text-custom-olive-50">ke arsitek {consultation.architectName}</Body>
        </div>
        <div className="text-right">
          <Caption className="text-custom-olive-50">{formatDateTime(consultation.createdAt)}</Caption>
          <div className={`${currentStatus.backgroundColor} rounded-full px-3 py-1 flex items-center gap-2 mt-1`}>
            <div className={`w-2 h-2 rounded-full ${currentStatus.dotColor}`}></div>
            <Caption className={currentStatus.textColor}>{currentStatus.label}</Caption>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 mb-4" />

      {/* Details section */}
      <div className="flex flex-wrap gap-3">
        {/* Date */}
        <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
          <FaCalendarAlt className="text-custom-green-200" />
          <Caption className="text-custom-green-200">{formatDate(consultation.startDate)}</Caption>
        </div>

        {/* Time */}
        <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
          <FaClock className="text-custom-green-200" />
          <Caption className="text-custom-green-200">
            {formatTime(consultation.startDate)} - {formatTime(consultation.endDate)}
          </Caption>
        </div>

        {/* Type */}
        <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
          {consultation.type === 'online' ? (
            <FaComments className="text-custom-green-200" />
          ) : (
            <FaHandshake className="text-custom-green-200" />
          )}
          <Caption className="text-custom-green-200">
            {consultation.type === 'online' ? 'Chat' : 'Tatap Muka'}
          </Caption>
        </div>

        {/* userCity */}
        <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
          <FaMapMarkerAlt className="text-custom-green-200" />
          <Caption className="text-custom-green-200">{consultation.userCity}</Caption>
        </div>

        {/* Total Price */}
        <div className="bg-custom-white-100 rounded-full px-4 py-2 flex items-center gap-2">
          <MdPayment className="text-custom-green-200" />
          <Caption className="text-custom-green-200">{formatPrice(consultation.total)}</Caption>
        </div>
      </div>

      {/* Reason (if cancelled) */}
      {/* {consultation.status === 'cancelled' && consultation.reason && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg">
          <Caption className="text-red-600">
            Alasan: {consultation.reason === 'architect is unavailable' ? 'Arsitek tidak tersedia' :
                     consultation.reason === 'proof of payment is invalid' ? 'Bukti pembayaran tidak valid' :
                     consultation.reason === 'user cancelled the consultation' ? 'Pengguna membatalkan konsultasi' :
                     consultation.reason}
          </Caption>
        </div>
      )} */}

      {/* Action buttons */}
      <div className="absolute top-0 right-0 h-full flex flex-col justify-center items-center bg-zinc-50 p-4 shadow-sm">
        {onEdit && (
          <button
            onClick={() => onEdit(consultation.id)}
            className="p-3 rounded-full bg-amber-100 text-amber-500 hover:bg-amber-200"
            aria-label="Edit"
          >
            <FaEdit size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConsultationCard;