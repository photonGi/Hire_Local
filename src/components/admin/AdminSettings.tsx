import React from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from './AdminLayout';
import { useAdminTheme } from './theme-config';
import { useTheme } from '../../theme/useTheme';
import { toast } from 'react-hot-toast';

const AdminSettings: React.FC = () => {
  const { theme: globalTheme } = useTheme();
  const theme = useAdminTheme();
  const isDark = globalTheme === 'dark';

  const [adminId, setAdminId] = React.useState<string | null>(null);
  const [adminData, setAdminData] = React.useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  // 🔹 Fetch Admin Data
  React.useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setIsLoading(true);

        // If you only have one admin, you can fetch the first one:
        const q = query(collection(db, 'admins'), where('role', '==', 'admin'));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const docData = snap.docs[0];
          setAdminId(docData.id);
          setAdminData({
            name: docData.data().name || '',
            email: docData.data().email || '',
            password: docData.data().password || '',
            role: docData.data().role || ''
          });
        } else {
          console.warn('No admin found in the collection.');
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  // 🔹 Handle Form Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle Save
  const handleSave = async () => {
    if (!adminId) return;
    try {
      setIsSaving(true);
      const ref = doc(db, 'admins', adminId);
      await updateDoc(ref, adminData);
      toast.success('Admin profile updated successfully!');
    } catch (err) {
      console.error('Error updating admin profile:', err);
      toast.error('Failed to update admin profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout currentPage="adminSettings">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className={`text-3xl font-bold ${theme.primaryText}`}>
            Admin Settings
          </h1>
          <p className={`${theme.secondaryText} mt-1`}>
            Manage your admin profile information
          </p>
        </div>

        {/* Form Section */}
        <div
          className={`w-full p-6 rounded-xl shadow-md ${
            isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white'
          }`}
        >
          {isLoading ? (
            <div className="text-center py-8 text-sm">
              Loading admin details...
            </div>
          ) : (
            <form className="space-y-5">
              {/* Name */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme.secondaryText
                  }`}
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={adminData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme.secondaryText
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={adminData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme.secondaryText
                  }`}
                >
                  Password
                </label>
                <input
                  type="text"
                  name="password"
                  value={adminData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Role */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme.secondaryText
                  }`}
                >
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={adminData.role}
                  onChange={handleChange}
                  disabled
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-slate-400'
                      : 'bg-slate-50 border-slate-300 text-slate-500'
                  }`}
                />
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full py-2.5 rounded-lg font-medium mt-4 ${
                  isDark
                    ? 'bg-[#303C4F] text-white'
                    : 'bg-[#303C4F] text-white'
                } transition-all duration-200 disabled:opacity-50`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
