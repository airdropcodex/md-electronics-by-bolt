import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useClerkAuth';
import { Toast } from './ui/Toast';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: {
    full_name: string;
    phone: string;
    address: string;
  };
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
}) => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: currentProfile.full_name || '',
    phone: currentProfile.phone || '',
    address: currentProfile.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setToastMessage('Profile updated successfully!');
      setShowToast(true);
      
      // Refresh user profile data
      if (updateUserProfile) {
        await updateUserProfile(user.id);
      }
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setToastMessage('Error updating profile');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      
      <div className="fixed inset-0 bg-cod-gray/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cod-gray">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-sandstone hover:text-cod-gray transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-cod-gray mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-white text-cod-gray"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-cod-gray mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-white text-cod-gray"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-cod-gray mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek focus:border-clay-creek bg-white text-cod-gray"
                placeholder="Enter your full address"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-cod-gray border border-clay-creek/30 rounded-lg hover:bg-westar transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-cod-gray text-white rounded-lg hover:bg-clay-creek transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};