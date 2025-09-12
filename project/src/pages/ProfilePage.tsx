import React, { useState } from 'react';
import { User, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    // In a real app, this would make an API call
    toast.success('Thông tin đã được cập nhật');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="px-4 md:px-16 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Hồ sơ người dùng</h1>

          <div className="bg-gray-900 rounded-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-gray-400">{user.email}</p>
                  {user.isAdmin && (
                    <span className="inline-block bg-red-600 text-white px-2 py-1 rounded text-sm mt-1">
                      Quản trị viên
                    </span>
                  )}
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Hủy</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Họ và tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-red-600"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-800 rounded text-gray-300">
                    {user.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-red-600"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-800 rounded text-gray-300">
                    {user.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ngày tham gia</label>
                <div className="px-4 py-2 bg-gray-800 rounded text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Loại tài khoản</label>
                <div className="px-4 py-2 bg-gray-800 rounded text-gray-300">
                  {user.isAdmin ? 'Quản trị viên' : 'Người dùng'}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Thống kê</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded">
                  <div className="text-2xl font-bold text-red-600">
                    {user.favoriteMovies.length}
                  </div>
                  <div className="text-gray-400">Phim yêu thích</div>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.watchHistory.length}
                  </div>
                  <div className="text-gray-400">Đã xem</div>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor(Math.random() * 100) + 50}h
                  </div>
                  <div className="text-gray-400">Thời gian xem</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;