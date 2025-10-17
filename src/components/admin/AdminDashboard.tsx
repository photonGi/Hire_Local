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
import { Users, Activity, Zap, TrendingUp, RefreshCw } from 'lucide-react';
import { collection, getDocs, onSnapshot, query, getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// 🌀 Spinner
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

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

  // 🆕 Filters
  const [filter, setFilter] = React.useState<'7d' | '30d' | 'range'>('7d');
  const [dateRange, setDateRange] = React.useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });

  // 🧩 Firestore
  React.useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setTotalUsers(snap.size);
      setActiveSessions(Math.floor(snap.size * 0.7));
    });

    const unsubApiCalls = onSnapshot(collection(db, 'apiCalls'), (snap) => {
      const apiMap: Record<string, number> = {};
      snap.forEach((docSnap) => {
        apiMap[docSnap.id] = docSnap.data()?.apiCalls ?? 0;
      });

      const todayKey = ymdLocal();
      setApiCallsToday(apiMap[todayKey] ?? 0);

      // Build usageData dynamically
      updateChartData(apiMap);
    });

    const fetchStatic = async () => {
      try {
        setIsLoading(true);
        // --- Category Chart ---
        const q = query(collection(db, 'queries'));
        const snap = await getDocs(q);
        const counts: Record<string, number> = {};
        snap.forEach((d) => {
          const type = d.data().serviceType || 'Other';
          counts[type] = (counts[type] || 0) + 1;
        });

        let top = 'N/A';
        let max = 0;
        for (const [type, count] of Object.entries(counts)) {
          if (count > max) {
            max = count;
            top = type;
          }
        }
        setTopCategory(top);

        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        setCategoryData(
          Object.entries(counts).map(([label, value], i) => ({
            label,
            value,
            color: colors[i % colors.length],
          }))
        );

        // --- Geo ---
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
  }, [filter, dateRange]);

  // 🧠 Helper to rebuild chart based on filter
  const updateChartData = (apiMap: Record<string, number>) => {
    let keys: string[] = [];

    if (filter === '7d') {
      keys = lastNDaysLocal(7);
    } else if (filter === '30d') {
      keys = lastNDaysLocal(30);
    } else if (filter === 'range' && dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      const diffDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
      keys = lastNDaysLocal(diffDays + 1);
    } else {
      keys = lastNDaysLocal(7);
    }

    const formatted = keys.map((key) => ({
      label: new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: apiMap[key] ?? 0,
    }));
    setUsageData(formatted);
  };

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const kpiData = [
    { title: 'Total Users', value: isLoading ? <Spinner /> : totalUsers.toLocaleString(), icon: Users, color: 'blue' },
    { title: 'Active Sessions', value: isLoading ? <Spinner /> : activeSessions.toLocaleString(), icon: Activity, color: 'green' },
    { title: 'API Calls Today', value: isLoading ? <Spinner /> : apiCallsToday.toLocaleString(), icon: Zap, color: 'purple' },
    { title: 'Top Category', value: isLoading ? <Spinner /> : topCategory, icon: TrendingUp, color: 'orange' },
  ];

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {kpiData.map((kpi, i) => (
            <KPICard key={i} title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} isDark={isDark} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* === API Calls Per Day with Filters === */}
          <ChartCard title="API Calls Per Day" isDark={isDark}>
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <button
                  onClick={() => setFilter('7d')}
                  className={`px-3 py-1 rounded-md border text-xs ${
                    filter === '7d'
                      ? isDark
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-blue-500 text-white border-blue-500'
                      : isDark
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-700/40'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Past 7 Days
                </button>
                <button
                  onClick={() => setFilter('30d')}
                  className={`px-3 py-1 rounded-md border text-xs ${
                    filter === '30d'
                      ? isDark
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-blue-500 text-white border-blue-500'
                      : isDark
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-700/40'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Past Month
                </button>
                <button
                  onClick={() => setFilter('range')}
                  className={`px-3 py-1 rounded-md border text-xs ${
                    filter === 'range'
                      ? isDark
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-blue-500 text-white border-blue-500'
                      : isDark
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-700/40'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Date Range
                </button>
              </div>

              {filter === 'range' && (
                <div className="flex items-center space-x-2 text-xs mt-2 xl:mt-0">
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => handleDateChange('from', e.target.value)}
                    className="px-2 py-1 rounded-md border border-slate-300 text-slate-700 text-xs"
                  />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>to</span>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => handleDateChange('to', e.target.value)}
                    className="px-2 py-1 rounded-md border border-slate-300 text-slate-700 text-xs"
                  />
                </div>
              )}
            </div>

            {/* Line Chart */}
            <LineChart data={usageData} color="#3B82F6" isDark={isDark} />
          </ChartCard>

          {/* === Popular Categories === */}
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
