import React from 'react';
import AdminLayout from './AdminLayout';
import KPICard from './KPICard';
import ChartCard from './ChartCard';
import ActivityFeed from './ActivityFeed';
import LineChart from './charts/LineChart';
import DonutChart from './charts/DonutChart';
import HeatMap from './charts/HeatMap';
import { useAdminTheme } from './theme-config';
import { useTheme } from '../../theme/useTheme';
import {
  Users,
  Activity,
  Zap,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import {
  collection,
  getCountFromServer,
  getDoc,
  doc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../../firebase/config';

// 🌀 Simple Spinner for KPI values
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const { theme: globalTheme } = useTheme();
  const theme = useAdminTheme();
  const isDark = globalTheme === 'dark';

  // 📊 State
  const [totalUsers, setTotalUsers] = React.useState<number>(0);
  const [activeSessions, setActiveSessions] = React.useState<number>(0);
  const [apiCallsToday, setApiCallsToday] = React.useState<number>(0);
  const [topCategory, setTopCategory] = React.useState<string>('Loading...');
  const [usageData, setUsageData] = React.useState<{ label: string; value: number }[]>([]);
  const [categoryData, setCategoryData] = React.useState<{ label: string; value: number; color: string }[]>([]);
  const [geoData, setGeoData] = React.useState<{ x: number; y: number; value: number; location: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // ⚡ Generate active sessions randomly
  const generateActiveSessions = (total: number) => {
    if (total === 0) return 0;
    const activityLevels = [0.4, 0.6, 0.7, 0.8];
    const chosenPercentage = activityLevels[Math.floor(Math.random() * activityLevels.length)];
    let active = Math.floor(total * chosenPercentage);
    const noise = Math.floor(Math.random() * 10) - 5;
    active = Math.max(0, active + noise);
    return Math.min(active, total);
  };

  // 🕒 Auto-refresh active sessions every 2–3 hours
  React.useEffect(() => {
    if (totalUsers > 0) {
      setActiveSessions(generateActiveSessions(totalUsers));

      const getRandomInterval = () => {
        const min = 2 * 60 * 60 * 1000;
        const max = 3 * 60 * 60 * 1000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      let timer: NodeJS.Timeout;
      const scheduleNext = () => {
        timer = setTimeout(() => {
          setActiveSessions(generateActiveSessions(totalUsers));
          scheduleNext();
        }, getRandomInterval());
      };

      scheduleNext();
      return () => clearTimeout(timer);
    }
  }, [totalUsers]);

  // 📥 Fetch Firestore Stats
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Total Users
        const coll = collection(db, 'users');
        const snapshot = await getCountFromServer(coll);
        setTotalUsers(snapshot.data().count);

        // API Calls Today
        const today = new Date().toISOString().split('T')[0];
        const apiDoc = await getDoc(doc(db, 'apiCalls', today));
        setApiCallsToday(apiDoc.exists() ? apiDoc.data().apiCalls || 0 : 0);

        // Top Category + Category Distribution
        const q = query(collection(db, 'queries'));
        const snap = await getDocs(q);

        const counts: Record<string, number> = {};
        const dailyCounts: Record<string, number> = {};

        snap.forEach((d) => {
          const data = d.data();
          const type = data.serviceType || 'Other';
          counts[type] = (counts[type] || 0) + 1;

          // Group by date for line chart
          const created = data.createdAt?.toDate();
          if (created) {
            const dateKey = created.toISOString().split('T')[0];
            dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
          }
        });

        // Compute top category
        let top = 'N/A';
        let max = 0;
        for (const [type, count] of Object.entries(counts)) {
          if (count > max) {
            max = count;
            top = type;
          }
        }
        setTopCategory(top);

        // Dynamic donut chart data
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        const categoryArr = Object.entries(counts).map(([label, value], i) => ({
          label,
          value,
          color: colors[i % colors.length]
        }));
        setCategoryData(categoryArr);

        // Dynamic line chart data (usage over time)
        const usageArr = Object.entries(dailyCounts)
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime());
        setUsageData(usageArr);

        // Geo chart (optional)
        const userSnap = await getDocs(collection(db, 'users'));
        const geoArr: any[] = [];
        userSnap.forEach((u) => {
          const data = u.data();
          if (data.location) {
            // Convert location object to readable string
            const locationLabel =
              typeof data.location === 'string'
                ? data.location
                : data.location.city
                ? `${data.location.city}, ${data.location.state || ''}`.trim()
                : data.location.fullAddress || 'Unknown';

            geoArr.push({
              x: Math.random() * 100,
              y: Math.random() * 100,
              value: Math.floor(Math.random() * 1000),
              location: locationLabel
            });
          }
        });
        setGeoData(geoArr);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 📌 KPI Cards Data
  const kpiData = [
    {
      title: 'Total Users',
      value: isLoading ? <Spinner /> : totalUsers.toLocaleString(),
      change: { value: 12.5, type: 'increase' as const },
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Active Sessions',
      value: isLoading ? <Spinner /> : activeSessions.toLocaleString(),
      change: { value: 8.2, type: 'increase' as const },
      icon: Activity,
      color: 'green' as const
    },
    {
      title: 'API Calls Today',
      value: isLoading ? <Spinner /> : apiCallsToday.toLocaleString(),
      change: { value: 3.1, type: 'decrease' as const },
      icon: Zap,
      color: 'purple' as const
    },
    {
      title: 'Top Category',
      value: isLoading ? <Spinner /> : topCategory,
      icon: TrendingUp,
      color: 'orange' as const
    }
  ];

  const handleRefresh = () => window.location.reload();

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className={`text-3xl font-bold ${theme.primaryText}`}>Dashboard Overview</h1>
            <p className={`${theme.secondaryText} mt-1`}>
              Monitor your platform's performance and user activity
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                isDark
                  ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  : 'bg-white/80 border border-slate-300 text-slate-700 hover:bg-white hover:shadow-md shadow-sm'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <div className={`text-xs ${theme.secondaryText}`}>
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {kpiData.map((kpi, i) => (
            <KPICard
              key={i}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon}
              color={kpi.color}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard title="Usage Over Time" isDark={isDark}>
            <LineChart data={usageData} color="#3B82F6" isDark={isDark} />
          </ChartCard>

          <ChartCard title="Popular Categories" isDark={isDark}>
            <DonutChart data={categoryData} isDark={isDark} />
          </ChartCard>
        </div>

        {/* Geo + Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {geoData.length > 0 && (
            <ChartCard title="Geographic Distribution" className="xl:col-span-2" isDark={isDark}>
              <HeatMap data={geoData} isDark={isDark} />
            </ChartCard>
          )}
          <ActivityFeed isDark={isDark} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
