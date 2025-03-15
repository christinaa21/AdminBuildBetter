'use client'
import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Head>
        <title>Build Better | Login</title>
        <meta name="description" content="Login to your Build Better account" />
      </Head>

      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <Image
            src="/login.png" 
            alt="Sustainable house with solar panels"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-24">
        <div className="max-w-md mx-auto w-full">
        <div className="mb-8 flex items-center justify-left">
          <Image
            src="/logo.png" 
            alt="Logo"
            width={164}  // Set explicit width
            height={56}  // Set explicit height
            layout="intrinsic"
            priority
          />
        </div>
          <h1 className="text-2xl font-semibold text-customGreen-300 mb-2 ">Masuk ke Akun</h1>
          <p className="text-customGreen-300 mb-8">
            Selamat Datang Kembali! Lengkapi e-mail dan kata sandi untuk masuk ke akunmu:
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-customGreen-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="E-mail"
                required
              />
            </div>
            
            <div className="mb-4">
              
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-customGreen-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Kata sandi"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end mb-10 text-sm">
              Lupa kata sandi?
              Hubungi kami di app.buildbetter@gmail.com
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-800 text-white py-3 rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}