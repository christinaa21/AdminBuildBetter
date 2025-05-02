import React from 'react';
import { Subtitle } from '@/components/Typography';

interface Step2EkonomisProps {
  formData: {
    budgetPerMeter?: string;
    landArea?: string;
    roofType?: string;
    roofStructure?: string;
    ceiling?: string;
    wallCovering?: string;
    wallStructure?: string;
    floorCovering?: string;
    doorType?: string;
    windowGlass?: string;
    windowFrame?: string;
    foundationType?: string;
    foundationMaterial?: string;
    structureMaterial?: string;
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const Step2Ekonomis: React.FC<Step2EkonomisProps> = ({ formData, handleChange }) => {
  return (
    <>
      <Subtitle className="font-medium text-custom-green-500 mb-4">Rentang Budget</Subtitle>
      
      {/* Budget Range */}
      <div className="mb-6">
        <Subtitle className="text-custom-green-400 mb-1">Ekonomis (per m2)</Subtitle>
        <input
          type="text"
          name="budgetPerMeter"
          value={formData.budgetPerMeter || ''}
          onChange={handleChange}
          placeholder="Tulis disini"
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300"
        />
      </div>
      
      {/* Budget Estimation */}
      <div className="mb-8">
        <Subtitle className="text-custom-green-400 mb-1">Estimasi Rentang Budget Total:</Subtitle>
        <div className="text-custom-green-500 font-medium">
          {formData.budgetPerMeter && formData.landArea 
            ? `Rp ${(parseInt(formData.budgetPerMeter) * parseInt(formData.landArea)).toLocaleString('id-ID')}`
            : 'Rp 0'}
        </div>
      </div>

      <Subtitle className="font-medium text-custom-green-500 mb-4">Material Ekonomis</Subtitle>
      
      {/* Roof Material */}
      <div className="mb-1">
        <Subtitle className="text-custom-green-500 mb-2">Material - Atap</Subtitle>
      </div>
      
      {/* Roof Type */}
      <div className="mb-4">
        <Subtitle className="text-custom-green-400 mb-1">Atap</Subtitle>
        <select
          name="roofType"
          value={formData.roofType || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="asbesGelombang">Asbes Gelombang</option>
          <option value="gentengTanah">Genteng Tanah</option>
          <option value="gentengMetal">Genteng Metal</option>
          <option value="gentengBeton">Genteng Beton</option>
          <option value="spandek">Spandek</option>
        </select>
      </div>
      
      {/* Roof Structure */}
      <div className="mb-4">
        <Subtitle className="text-custom-green-400 mb-1">Struktur Atap</Subtitle>
        <select
          name="roofStructure"
          value={formData.roofStructure || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="galvalume">Galvalume</option>
          <option value="baja">Baja</option>
          <option value="kayu">Kayu</option>
        </select>
      </div>
      
      {/* Ceiling */}
      <div className="mb-6">
        <Subtitle className="text-custom-green-400 mb-1">Plafon</Subtitle>
        <select
          name="ceiling"
          value={formData.ceiling || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="gypsum">Gypsum</option>
          <option value="pvc">PVC</option>
          <option value="triplek">Triplek</option>
          <option value="grc">GRC</option>
        </select>
      </div>

      {/* Wall Material */}
      <div className="mb-1">
        <Subtitle className="text-custom-green-500 mb-2">Material - Dinding</Subtitle>
      </div>
      
      {/* Wall Finishing */}
      <div className="mb-4">
        <Subtitle className="text-custom-green-400 mb-1">Pelapis Dinding</Subtitle>
        <select
          name="wallCovering"
          value={formData.wallCovering || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="cat">Cat</option>
          <option value="wallpaper">Wallpaper</option>
          <option value="keramik">Keramik</option>
          <option value="batubata">Batu Bata Ekspos</option>
        </select>
      </div>
      
      {/* Wall Structure */}
      <div className="mb-6">
        <Subtitle className="text-custom-green-400 mb-1">Struktur Dinding</Subtitle>
        <select
          name="wallStructure"
          value={formData.wallStructure || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="batako">Batako</option>
          <option value="bataBata">Bata Merah</option>
          <option value="hebel">Hebel</option>
        </select>
      </div>

      {/* Floor Material */}
      <div className="mb-1">
        <Subtitle className="text-custom-green-500 mb-2">Material - Lantai</Subtitle>
      </div>
      
      {/* Floor Covering */}
      <div className="mb-6">
        <Subtitle className="text-custom-green-400 mb-1">Pelapis</Subtitle>
        <select
          name="floorCovering"
          value={formData.floorCovering || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="keramik">Keramik</option>
          <option value="vinyl">Vinyl</option>
          <option value="parket">Parket</option>
          <option value="granit">Granit</option>
          <option value="marmer">Marmer</option>
        </select>
      </div>

      {/* Doors and Windows */}
      <div className="mb-1">
        <Subtitle className="text-custom-green-500 mb-2">Material - Bukaan</Subtitle>
      </div>
      
      {/* Door */}
      <div className="mb-4">
        <Subtitle className="text-custom-green-400 mb-1">Pintu</Subtitle>
        <select
          name="doorType"
          value={formData.doorType || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="kayuSolid">Kayu Solid</option>
          <option value="engineeredWood">Engineered Wood</option>
          <option value="pvc">PVC</option>
          <option value="kaca">Kaca</option>
        </select>
      </div>
      
      {/* Window Glass */}
      <div className="mb-4">
        <Subtitle className="text-custom-green-400 mb-1">Daun Jendela</Subtitle>
        <select
          name="windowGlass"
          value={formData.windowGlass || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="kacaBening">Kaca Bening</option>
          <option value="kacaRayban">Kaca Rayban</option>
          <option value="kacaTemperedClear">Kaca Tempered Clear</option>
          <option value="kacaTemperedFrosted">Kaca Tempered Frosted</option>
        </select>
      </div>
      
      {/* Window Frame */}
      <div className="mb-6">
        <Subtitle className="text-custom-green-400 mb-1">Frame Jendela</Subtitle>
        <select
          name="windowFrame"
          value={formData.windowFrame || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="aluminium">Aluminium</option>
          <option value="upvc">UPVC</option>
          <option value="kayu">Kayu</option>
          <option value="besi">Besi</option>
        </select>
      </div>

      {/* Foundation */}
      <div className="mb-1">
        <Subtitle className="text-custom-green-500 mb-2">Material - Pondasi</Subtitle>
      </div>
      
      {/* Foundation Type */}
      <div className="mb-4">
        <Subtitle className="text-custom-green-400 mb-1">Jenis Pondasi</Subtitle>
        <select
          name="foundationType"
          value={formData.foundationType || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="batukali">Batu Kali</option>
          <option value="sumuran">Sumuran</option>
          <option value="footplat">Footplat</option>
          <option value="strauss">Strauss</option>
        </select>
      </div>
      
      {/* Foundation Material */}
      <div className="mb-6">
        <Subtitle className="text-custom-green-400 mb-1">Material Pondasi</Subtitle>
        <select
          name="foundationMaterial"
          value={formData.foundationMaterial || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="beton">Beton</option>
          <option value="batukali">Batu Kali</option>
          <option value="betonBertulang">Beton Bertulang</option>
        </select>
      </div>

      {/* Beam and Column */}
      <div className="mb-1">
        <Subtitle className="text-custom-green-500 mb-2">Material - Balok-Kolom</Subtitle>
      </div>
      
      {/* Structure Material */}
      <div className="mb-6">
        <Subtitle className="text-custom-green-400 mb-1">Material Struktur</Subtitle>
        <select
          name="structureMaterial"
          value={formData.structureMaterial || ''}
          onChange={handleChange}
          className="w-full border border-custom-gray-50 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-custom-green-300 appearance-none bg-white"
        >
          <option value="" disabled>Pilih disini</option>
          <option value="betonPraktis">Beton Praktis</option>
          <option value="konstruksiBaja">Konstruksi Baja</option>
          <option value="betonBertulang">Beton Bertulang</option>
        </select>
      </div>
    </>
  );
};

export default Step2Ekonomis;