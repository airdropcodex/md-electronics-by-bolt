import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Shield, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { User as AppUser } from '../../types';
import { Toast } from '../../components/ui/Toast';

export const AdminStaff: React.FC = () => {
  const [staff, setStaff] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AppUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'staff' as 'admin' | 'staff',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('role', ['admin', 'staff'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStaff) {
        // Update existing staff role
        const { error } = await supabase
          .from('user_profiles')
          .update({ 
            full_name: formData.full_name,
            role: formData.role 
          })
          .eq('id', editingStaff.id);

        if (error) throw error;
        setToastMessage('Staff member updated successfully!');
      } else {
        // Create new staff user via Edge Function
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-staff-user`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            role: formData.role,
          }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create staff user');
        }

        setToastMessage('Staff member created successfully!');
      }

      setShowToast(true);
      setShowForm(false);
      setEditingStaff(null);
      resetForm();
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      setToastMessage(error instanceof Error ? error.message : 'Error saving staff member');
      setShowToast(true);
    }
  };

  const handleEdit = (staffMember: AppUser) => {
    setEditingStaff(staffMember);
    setFormData({
      email: staffMember.email,
      password: '',
      full_name: staffMember.full_name || '',
      role: staffMember.role as 'admin' | 'staff',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) return;

    try {
      // Delete user profile (this will cascade to auth.users due to foreign key)
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setToastMessage('Staff member deleted successfully!');
      setShowToast(true);
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      setToastMessage('Error deleting staff member');
      setShowToast(true);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      full_name: '',
      role: 'staff',
    });
  };

  const filteredStaff = staff.filter(member =>
    member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay-creek"></div>
      </div>
    );
  }

  return (
    <div>
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cod-gray">Staff Management</h1>
          <p className="text-sandstone mt-2">Manage admin and staff accounts</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingStaff(null);
            resetForm();
          }}
          className="bg-cod-gray text-white px-4 py-2 rounded-lg hover:bg-clay-creek transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-sandstone" />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek bg-white w-full"
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-clay-creek/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-westar">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-cod-gray uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cod-gray uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cod-gray uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-cod-gray uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay-creek/10">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-westar/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-clay-creek/20 rounded-full flex items-center justify-center mr-4">
                        {member.role === 'admin' ? (
                          <Shield className="w-5 h-5 text-clay-creek" />
                        ) : (
                          <User className="w-5 h-5 text-clay-creek" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-cod-gray">
                          {member.full_name || 'No name'}
                        </div>
                        <div className="text-sm text-sandstone">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-cod-gray">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-clay-creek hover:text-cod-gray"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-cod-gray/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-cod-gray mb-6">
              {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cod-gray mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek"
                />
              </div>
              
              {!editingStaff && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-cod-gray mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cod-gray mb-2">
                      Temporary Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek"
                      placeholder="User should change this on first login"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-cod-gray mb-2">
                  Role
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })}
                  className="w-full px-3 py-2 border border-clay-creek/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay-creek"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-sandstone mt-1">
                  Admin: Full access to all features including staff management<br />
                  Staff: Access to products, categories, and orders only
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingStaff(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-cod-gray border border-clay-creek/30 rounded-lg hover:bg-westar transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cod-gray text-white rounded-lg hover:bg-clay-creek transition-colors"
                >
                  {editingStaff ? 'Update Staff' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};