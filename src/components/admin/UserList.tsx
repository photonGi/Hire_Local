import React from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from './AdminLayout';
import { useAdminTheme } from './theme-config';
import { useTheme } from '../../theme/useTheme';

const UserList: React.FC = () => {
  const { theme: globalTheme } = useTheme();
  const theme = useAdminTheme();
  const isDark = globalTheme === 'dark';

  const [users, setUsers] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const snap = await getDocs(collection(db, 'users'));
        const list: any[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name || data.displayName || 'Unnamed User',
            email: data.email || 'N/A',
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleDateString()
              : 'Unknown'
          });
        });

        // Sort users by createdAt descending
        list.sort((a, b) => {
          const da = new Date(a.createdAt).getTime();
          const dbb = new Date(b.createdAt).getTime();
          return dbb - da;
        });

        setUsers(list);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <AdminLayout currentPage="userList">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className={`text-3xl font-bold ${theme.primaryText}`}>User List</h1>
          <p className={`${theme.secondaryText} mt-1`}>
            View all registered users from Firebase Authentication
          </p>
        </div>

        {/* Table */}
        <div
          className={`overflow-x-auto shadow-md rounded-xl ${
            isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white'
          }`}
        >
          <table className="min-w-full divide-y divide-slate-200">
            <thead
              className={
                isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'
              }
            >
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>

            <tbody
              className={isDark ? 'divide-y divide-slate-700 text-slate-200' : 'divide-y divide-slate-200 text-slate-700'}
            >
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-sm">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-sm">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`${
                      isDark
                        ? 'hover:bg-slate-700 transition-colors'
                        : 'hover:bg-slate-50 transition-colors'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={`text-sm mt-4 ${theme.secondaryText}`}>
          Total Users: {users.length.toLocaleString()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserList;
