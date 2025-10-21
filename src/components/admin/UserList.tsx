import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import AdminLayout from "./AdminLayout";
import PaginatedTable from "./PaginatedTable";
import { useAdminTheme } from "./theme-config";
import { useTheme } from "../../theme/useTheme";

const UserList: React.FC = () => {
  const { theme: globalTheme } = useTheme();
  const theme = useAdminTheme();
  const isDark = globalTheme === "dark";

  const [users, setUsers] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const snap = await getDocs(collection(db, "users"));
        const list: any[] = [];

        snap.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name || data.displayName || "Unnamed User",
            email: data.email || "N/A",
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleDateString()
              : "Unknown",
          });
        });

        // Sort users by createdAt descending
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setUsers(list);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Define columns for PaginatedTable
  const columns = [
    {
      key: "index",
      label: "#",
      render: (_: any, index: number) => index + 1,
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "createdAt", label: "Created At" },
  ];

  return (
    <AdminLayout currentPage="userList">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className={`text-3xl font-bold ${theme.primaryText}`}>
            User List
          </h1>
          <p className={`${theme.secondaryText} mt-1`}>
            View all registered users from Firebase Authentication
          </p>
        </div>

        {/* Reusable Paginated Table */}
        <PaginatedTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          isDark={isDark}
          itemsPerPage={10}
          emptyMessage="No users found."
        />

        {/* Footer */}
        <div className={`text-sm mt-4 ${theme.secondaryText}`}>
          Total Users: {users.length.toLocaleString()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserList;
