'use client'

import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '@/components/Button';
import { typography } from '../../utils/typography';

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
    <div className="flex min-h-screen bg-custom-white-50">
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
            fill
            style={{ objectFit: 'cover' }}
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
              width={164}
              height={56}
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </div>
          
          <h1 className={`${typography.title()} text-custom-green-300 mb-2`}>Masuk ke Akun</h1>
          <p className={`${typography.body1()} text-custom-green-300 mb-8`}>
            Selamat datang kembali! Lengkapi e-mail dan kata sandi untuk masuk ke akunmu:
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border border-custom-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-custom-green-200 focus:border-transparent ${typography.body2()}`}
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
                  className={`w-full px-4 py-3 border border-custom-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-custom-green-200 focus:border-transparent ${typography.body2()}`}
                  placeholder="Kata sandi"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-custom-gray-200"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end mb-10">
              <p className={`${typography.caption()} text-custom-gray-200`}>
                Lupa kata sandi?
                <a href="mailto:app.buildbetter@gmail.com" className="text-custom-green-300 ml-1 hover:underline">
                  Hubungi kami di app.buildbetter@gmail.com
                </a>
              </p>
            </div>
            
            <Button 
              title="Login" 
              variant="primary"
              fullWidth={true}
              type="submit"
              className="font-medium"
            />
          </form>
        </div>
      </div>
    </div>
  );
}