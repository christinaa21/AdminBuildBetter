'use client'

import { useState } from 'react';
import Image from 'next/image';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '@/components/Button';
import { H1, H2, Body, Caption, Text } from '@/components/Typography';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Option 1: Using proxy (preferred for development)
      // If you're using Next.js, you can set up an API route to proxy the request
      // This assumes you've created a proxy API route at /api/auth/login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Option 2 (fallback): For immediate testing, you can try with mode: 'no-cors'
      // Note: This is less ideal as you can't access the response data properly
      /*
      const response = await fetch('http://54.153.132.144:8080/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        mode: 'no-cors' // This may help bypass CORS but limits response access
      });
      */

      const data = await response.json();

      if (response.ok && data.code === 200) {
        // Store token and user data in localStorage
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userData', JSON.stringify({
          userId: data.data.userId,
          email: data.data.email,
          role: data.data.role,
          username: data.data.username
        }));
        
        // Redirect to home page
        window.location.href = "/rumah";
      } else {
        // Handle error responses
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your internet connection and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-custom-white-50">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <Image
            src="/login.png" 
            alt="Login Image"
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
              width={150}
              height={60}
              priority
            />
          </div>
          
          <H1 className="text-custom-green-300 mb-2">Masuk ke Akun</H1>
          <Body className="text-custom-green-300 mb-8">
            Selamat datang kembali! Lengkapi e-mail dan kata sandi untuk masuk ke akunmu:
          </Body>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-custom-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-custom-green-200 focus:border-transparent font-poppins text-sm leading-[22px] text-custom-olive-50"
                placeholder="E-mail"
                required
                disabled={loading}
              />
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-custom-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-custom-green-200 focus:border-transparent font-poppins text-sm leading-[22px] text-custom-olive-50"
                  placeholder="Kata sandi"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-custom-gray-200"
                  disabled={loading}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end mb-10">
              <Caption className="text-gray-400">
                Lupa kata sandi?
                <a href="mailto:app.buildbetter@gmail.com" className="text-custom-green-200 ml-1 hover:underline">
                  Hubungi kami di app.buildbetter@gmail.com
                </a>
              </Caption>
            </div>
            
            <Button 
              title={loading ? "Memproses..." : "Login"} 
              variant="primary"
              fullWidth={true}
              type="submit"
              className="font-medium"
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}