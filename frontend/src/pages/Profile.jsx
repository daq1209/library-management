/**
 * Profile Page
 * 
 * Displays user information from authenticated session
 * - Name, Email, Role, Account created date
 * - Logout button
 * - "Edit profile" placeholder for future features
 */

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuUser, LuMail, LuShield, LuCalendar, LuLogOut, LuPencil } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchWishlist } from '../redux/features/wishlist/wishlistSlice.js';
import { fetchCart } from '../redux/features/cart/cartSlice.js';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistCount = useSelector((s) => s.wishlist.items.length);
  const cartCount = useSelector((s) => s.cart.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0));

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get role badge color
  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      librarian: 'bg-blue-100 text-blue-800 border-blue-200',
      reader: 'bg-green-100 text-green-800 border-green-200'
    };
    return badges[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full text-3xl font-bold text-green-600 mb-4 shadow-lg">
              {getInitials(user?.name)}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadge(user?.role)}`}>
              <LuShield className="w-4 h-4 mr-1" />
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </span>
          </div>

          {/* Info Grid */}
          <div className="p-8 space-y-6">
            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <LuMail className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-lg text-gray-900">{user?.email}</p>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <LuUser className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg text-gray-900">{user?.name}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <LuShield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Account Type</p>
                <p className="text-lg text-gray-900 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <LuCalendar className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="text-lg text-gray-900">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => alert('Edit profile feature coming soon!')}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-green-500 transition-colors"
            >
              <LuPencil className="w-5 h-5 mr-2" />
              Chỉnh sửa hồ sơ
              <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">Sắp ra mắt</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-medium text-white transition-colors"
            >
              <LuLogOut className="w-5 h-5 mr-2" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Quick Stats (Optional) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Sách đã mượn</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{wishlistCount}</p>
            <p className="text-sm text-gray-600 mt-1">Mục yêu thích</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{cartCount}</p>
            <p className="text-sm text-gray-600 mt-1">Sách trong giỏ</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
