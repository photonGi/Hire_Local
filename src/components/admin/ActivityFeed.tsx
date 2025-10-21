import React, { useEffect, useState } from 'react';
import { Clock, User, Search, Settings } from 'lucide-react';
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getThemeStyles, themeClass } from './theme-config';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: string;
  type: 'user' | 'search' | 'system' | 'provider';
  message: string;
  timestamp: string;
  user?: string;
}

interface ActivityFeedProps {
  className?: string;
  isDark?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  className = '',
  isDark = true,
}) => {
  const theme = getThemeStyles(isDark);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);

        // 🔹 Recent Users
        const usersSnap = await getDocs(
          query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5))
        );
        const userActivities: ActivityItem[] = usersSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'user',
            message: `New user registered: ${data.name || 'Unnamed User'}`,
            timestamp: data.createdAt?.toDate
              ? new Date(data.createdAt.toDate()).toLocaleString()
              : 'Unknown',
            user: data.email || 'N/A',
          };
        });

        // 🔹 Recent Searches
        const searchSnap = await getDocs(
          query(collection(db, 'queries'), orderBy('createdAt', 'desc'), limit(5))
        );
        const searchActivities: ActivityItem[] = searchSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'search',
            message: `Search for "${data.formattedQuery || data.query}" in ${
              data.location || 'Unknown location'
            }`,
            timestamp: data.createdAt?.toDate
              ? new Date(data.createdAt.toDate()).toLocaleString()
              : 'Unknown',
          };
        });

        // 🔹 Combine & sort all activities
        const combined = [...userActivities, ...searchActivities].sort((a, b) => {
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        });

        setActivities(combined.slice(0, 8)); // show top 8
      } catch (err) {
        console.error('Error fetching activity feed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: ActivityItem['type']) => {
    const iconClass = 'w-4 h-4';
    switch (type) {
      case 'user':
        return <User className={iconClass} />;
      case 'search':
        return <Search className={iconClass} />;
      case 'system':
        return <Settings className={iconClass} />;
      case 'provider':
        return <Settings className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user':
        return 'from-blue-500 to-blue-600';
      case 'search':
        return 'from-green-500 to-green-600';
      case 'system':
        return 'from-purple-500 to-purple-600';
      case 'provider':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div
      className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${theme.primaryText}`}>
          Recent Activity
        </h3>
        <Link to="/admin/search-logs" className={`${theme.accentText} hover:opacity-80 text-sm`}>
          View All
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-center text-gray-400 py-8">
          Loading recent activity...
        </p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-center text-gray-400 py-8">
          No recent activity found.
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start space-x-3 p-3 rounded-lg ${themeClass(
                isDark,
                'hover:bg-white/5',
                'hover:bg-slate-50'
              )} transition-colors`}
            >
              <div
                className={`w-8 h-8 bg-gradient-to-br ${getActivityColor(
                  activity.type
                )} rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${theme.primaryText} text-sm`}>
                  {activity.message}
                </p>
                {activity.user && (
                  <p className={`${theme.accentText} text-xs mt-1`}>
                    {activity.user}
                  </p>
                )}
                <p className={`${theme.secondaryText} text-xs mt-1`}>
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
