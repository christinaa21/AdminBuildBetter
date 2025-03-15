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
          <div className="absolute inset-0 bg-black bg-opacity-10" />
        </div>
        <div className="absolute top-10 left-10 z-10">
          <div className="flex items-center">
            <div className="text-white text-4xl font-bold">
              <span className="flex items-center">
                <div className="h-10 w-10 mr-2">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                Build
                <br />
                Better
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-24">
        <div className="mb-8 lg:hidden">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 mr-2">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#1E3A34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-gray-800 text-2xl font-semibold">Build Better</span>
          </div>
        </div>
        
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Masuk ke Akun</h1>
          <p className="text-gray-600 mb-8">
            Selamat Datang Kembali! Lengkapi e-mail dan kata sandi untuk masuk ke akunmu:
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="E-mail"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Kata sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
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
            
            <div className="flex justify-end mb-6">
              <a href="#" className="text-sm text-gray-600 hover:text-green-700">
                Lupa kata sandi?
              </a>
            </div>
            
            <div className="text-sm text-center mb-6">
              <p className="text-gray-600">
                Hubungi kami di{" "}
                <a href="mailto:app.buildbetter@gmail.com" className="text-green-700 hover:underline">
                  app.buildbetter@gmail.com
                </a>
              </p>
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