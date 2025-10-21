import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import AdminLayout from "./AdminLayout";
import PaginatedTable from "./PaginatedTable";
import { useAdminTheme } from "./theme-config";
import { useTheme } from "../../theme/useTheme";

const SearchLogs: React.FC = () => {
  const { theme: globalTheme } = useTheme();
  const theme = useAdminTheme();
  const isDark = globalTheme === "dark";

  const [logs, setLogs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const snap = await getDocs(collection(db, "queries"));
        const list: any[] = [];

        snap.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            query: data.formattedQuery || data.query || "N/A",
            serviceType: data.serviceType || "Unknown",
            location: data.location || "N/A",
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleString()
              : "Unknown",
          });
        });

        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setLogs(list);
      } catch (err) {
        console.error("Error fetching search logs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const columns = [
    {
      key: "index",
      label: "#",
      render: (_: any, index: number) => index + 1,
    },
    { key: "query", label: "Query" },
    { key: "serviceType", label: "Category" },
    { key: "location", label: "Location" },
    { key: "createdAt", label: "Created At" },
  ];

  return (
    <AdminLayout currentPage="searchLogs">
      <div className="space-y-8">
        <div>
          <h1 className={`text-3xl font-bold ${theme.primaryText}`}>
            Search Logs
          </h1>
          <p className={`${theme.secondaryText} mt-1`}>
            View all user search queries recorded from Firebase
          </p>
        </div>

        <PaginatedTable
          columns={columns}
          data={logs}
          isLoading={isLoading}
          isDark={isDark}
          itemsPerPage={10}
          emptyMessage="No search logs found."
        />

        <div className={`text-sm mt-4 ${theme.secondaryText}`}>
          Total Queries: {logs.length.toLocaleString()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SearchLogs;
