import React from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from './AdminLayout';
import { useAdminTheme } from './theme-config';
import { useTheme } from '../../theme/useTheme';

const SearchLogs: React.FC = () => {
  const { theme: globalTheme } = useTheme();
  const theme = useAdminTheme();
  const isDark = globalTheme === 'dark';

  const [logs, setLogs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const snap = await getDocs(collection(db, 'queries'));
        const list: any[] = [];

        snap.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            query: data.formattedQuery || data.query || 'N/A',
            serviceType: data.serviceType || 'Unknown',
            location: data.location || 'N/A',
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleString()
              : 'Unknown'
          });
        });

        // Sort newest first
        list.sort((a, b) => {
          const da = new Date(a.createdAt).getTime();
          const dbb = new Date(b.createdAt).getTime();
          return dbb - da;
        });

        setLogs(list);
      } catch (err) {
        console.error('Error fetching search logs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <AdminLayout currentPage="searchLogs">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className={`text-3xl font-bold ${theme.primaryText}`}>Search Logs</h1>
          <p className={`${theme.secondaryText} mt-1`}>
            View all user search queries recorded from Firebase
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
                  Query
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>

            <tbody
              className={
                isDark
                  ? 'divide-y divide-slate-700 text-slate-200'
                  : 'divide-y divide-slate-200 text-slate-700'
              }
            >
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-sm">
                    Loading search logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-sm">
                    No search logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={`${
                      isDark
                        ? 'hover:bg-slate-700 transition-colors'
                        : 'hover:bg-slate-50 transition-colors'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm max-w-[250px] truncate">
                      {log.query}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      {log.serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      {log.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={`text-sm mt-4 ${theme.secondaryText}`}>
          Total Queries: {logs.length.toLocaleString()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SearchLogs;
