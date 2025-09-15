import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
});

type FormData = yup.InferType<typeof schema>;

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-black/80 backdrop-blur-md p-8 rounded-lg border border-gray-800">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PhimTộc
              </h1>
            </div>
            <h2 className="text-white text-2xl font-semibold">Đăng nhập</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
              />
              {errors.email && (
                <p className="text-purple-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('password')}
                type="password"
                placeholder="Mật khẩu"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
              />
              {errors.password && (
                <p className="text-purple-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
                Đăng ký ngay
              </Link>
            </p>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;