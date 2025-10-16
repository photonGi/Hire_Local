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
  getDoc,
  doc,
  query,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../firebase/config';

// 🌀 Spinner
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

// 🧩 Helpers
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const ymdLocal = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const lastNDaysLocal = (n: number) => {
  const arr: string[] = [];
  const base = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() - i);
    arr.push(ymdLocal(d));
  }
  return arr;
};

const AdminDashboard: React.FC = () => {
  const { theme: globalTheme } = useTheme();
  const theme = useAdminTheme();
  const isDark = globalTheme === 'dark';

  const [totalUsers, setTotalUsers] = React.useState(0);
  const [activeSessions, setActiveSessions] = React.useState(0);
  const [apiCallsToday, setApiCallsToday] = React.useState(0);
  const [topCategory, setTopCategory] = React.useState('Loading...');
  const [usageData, setUsageData] = React.useState<{ label: string; value: number }[]>([]);
  const [categoryData, setCategoryData] = React.useState<{ label: string; value: number; color: string }[]>([]);
  const [geoData, setGeoData] = React.useState<{ x: number; y: number; value: number; location: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // 🧩 Fetch everything
  React.useEffect(() => {
    // ✅ Live user count
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setTotalUsers(snap.size);
      setActiveSessions(Math.floor(snap.size * 0.7)); // 70% active session estimate
    });

    // ✅ API Calls (for chart and today)
    const unsubApiCalls = onSnapshot(collection(db, 'apiCalls'), (snap) => {
      const apiMap: Record<string, number> = {};
      snap.forEach((docSnap) => {
        apiMap[docSnap.id] = docSnap.data()?.apiCalls ?? 0;
      });

      // Build last 14 days
      const days = lastNDaysLocal(5);
      const formatted = days.map((key) => ({
        label: new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: apiMap[key] ?? 0
      }));
      setUsageData(formatted);


      // Set today's value
      const todayKey = ymdLocal();
      setApiCallsToday(apiMap[todayKey] ?? 0);
    });

    // ✅ Top Category + Geo data
    const fetchStatic = async () => {
      try {
        setIsLoading(true);

        // ---- Categories ----
        const q = query(collection(db, 'queries'));
        const snap = await getDocs(q);
        const counts: Record<string, number> = {};
        snap.forEach((d) => {
          const type = d.data().serviceType || 'Other';
          counts[type] = (counts[type] || 0) + 1;
        });

        // Top category
        let top = 'N/A';
        let max = 0;
        for (const [type, count] of Object.entries(counts)) {
          if (count > max) {
            max = count;
            top = type;
          }
        }
        setTopCategory(top);

        // Donut chart data
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        const categoryArr = Object.entries(counts).map(([label, value], i) => ({
          label,
          value,
          color: colors[i % colors.length]
        }));
        setCategoryData(categoryArr);

        // ---- Geo ----
        const userSnap = await getDocs(collection(db, 'users'));
        const geoArr: any[] = [];
        userSnap.forEach((u) => {
          const data = u.data();
          if (data.location) {
            const label =
              typeof data.location === 'string'
                ? data.location
                : data.location.city
                ? `${data.location.city}, ${data.location.state || ''}`.trim()
                : data.location.fullAddress || 'Unknown';
            geoArr.push({
              x: Math.random() * 100,
              y: Math.random() * 100,
              value: Math.floor(Math.random() * 1000),
              location: label,
            });
          }
        });
        setGeoData(geoArr);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatic();

    return () => {
      unsubUsers();
      unsubApiCalls();
    };
  }, []);

  // 📌 KPI cards
  const kpiData = [
    {
      title: 'Total Users',
      value: isLoading ? <Spinner /> : totalUsers.toLocaleString(),
      icon: Users,
      color: 'blue' as const,
    },
    {
      title: 'Active Sessions',
      value: isLoading ? <Spinner /> : activeSessions.toLocaleString(),
      icon: Activity,
      color: 'green' as const,
    },
    {
      title: 'API Calls Today',
      value: isLoading ? <Spinner /> : apiCallsToday.toLocaleString(),
      icon: Zap,
      color: 'purple' as const,
    },
    {
      title: 'Top Category',
      value: isLoading ? <Spinner /> : topCategory,
      icon: TrendingUp,
      color: 'orange' as const,
    },
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
              icon={kpi.icon}
              color={kpi.color}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard title="API Calls Per Day" isDark={isDark}>
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
