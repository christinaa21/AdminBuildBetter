import React from 'react';

interface Step1GeneralProps {
  formData: {
    architectName: string;
    landArea: string;
    designStyle: string;
    floors: string;
    rooms: string;
    houseDesignFile: File | null;
    floorPlanFile: File | null;
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFileChange: (fieldName: string, files: FileList | null) => void;
}

const Step1General: React.FC<Step1GeneralProps> = ({ formData, handleChange, handleFileChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-custom-green-500 mb-6">Preferensi Desain</h2>
      
      {/* Land Area */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">Luas Lahan (m2)</label>
        <input
          type="text"
          name="landArea"
          value={formData.landArea}
          onChange={handleChange}
          placeholder="Tulis disini"
          className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300"
        />
      </div>
      
      {/* Design Style */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">Gaya Desain</label>
        <div className="relative">
          <select
            name="designStyle"
            value={formData.designStyle}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none"
          >
            <option value="" disabled>Pilih disini</option>
            <option value="modern">Modern</option>
            <option value="minimalis">Minimalis</option>
            <option value="industrial">Industrial</option>
            <option value="classic">Classic</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Number of Floors */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">Jumlah Lantai</label>
        <div className="relative">
          <select
            name="floors"
            value={formData.floors}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none"
          >
            <option value="" disabled>Pilih disini</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4+">4+</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Number of Rooms */}
      <div className="mb-8">
        <label className="block text-custom-green-400 mb-2">Jumlah Kamar</label>
        <div className="relative">
          <select
            name="rooms"
            value={formData.rooms}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none"
          >
            <option value="" disabled>Pilih disini</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5+">5+</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-medium text-custom-green-500 mb-6">Unggah Desain</h2>
      
      {/* House Design Upload */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">Rumah 3D</label>
        <label className="w-full flex items-center justify-between border border-gray-200 rounded-md px-4 py-3 text-custom-green-300 cursor-pointer">
          <span>
            {formData.houseDesignFile ? formData.houseDesignFile.name : "Unggah disini"}
          </span>
          <input
            type="file"
            name="houseDesignFile"
            accept="image/*"
            onChange={(e) => {
              handleFileChange('houseDesignFile', e.target.files);
            }}
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </label>
      </div>
      
      {/* Desain Rumah - tampak depan */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">Desain Rumah - tampak depan</label>
        <label className="w-full flex items-center justify-between border border-gray-200 rounded-md px-4 py-3 text-custom-green-300 cursor-pointer">
          <span>Unggah disini</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </label>
      </div>
      
      {/* Desain Rumah - tampak samping */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">Desain Rumah - tampak samping</label>
        <label className="w-full flex items-center justify-between border border-gray-200 rounded-md px-4 py-3 text-custom-green-300 cursor-pointer">
          <span>Unggah disini</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </label>
      </div>
      
      {/* Desain Rumah - tampak belakang */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">Desain Rumah - tampak belakang</label>
        <label className="w-full flex items-center justify-between border border-gray-200 rounded-md px-4 py-3 text-custom-green-300 cursor-pointer">
          <span>Unggah disini</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </label>
      </div>
      
      {/* Denah Rumah 1 */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">Denah Rumah 1</label>
        <label className="w-full flex items-center justify-between border border-gray-200 rounded-md px-4 py-3 text-custom-green-300 cursor-pointer">
          <span>
            {formData.floorPlanFile ? formData.floorPlanFile.name : "Unggah disini"}
          </span>
          <input
            type="file"
            name="floorPlanFile"
            accept="image/*,.pdf"
            onChange={(e) => {
              handleFileChange('floorPlanFile', e.target.files);
            }}
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </label>
      </div>
      
      {/* Denah Rumah 2 */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">Denah Rumah 2</label>
        <label className="w-full flex items-center justify-between border border-gray-200 rounded-md px-4 py-3 text-custom-green-300 cursor-pointer">
          <span>Unggah disini</span>
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-green-300">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </label>
      </div>
      
      {/* Architect Name */}
      <div className="mb-6">
        <label className="block text-custom-green-400 mb-2">Nama Arsitek</label>
        <input
          type="text"
          name="architectName"
          value={formData.architectName}
          onChange={handleChange}
          placeholder="Tulis disini"
          className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300"
        />
      </div>
    </div>
  );
};

export default Step1General;