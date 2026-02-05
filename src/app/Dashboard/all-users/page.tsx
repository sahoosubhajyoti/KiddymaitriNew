"use client";
import { useEffect, useState } from "react";
import api from "../../../utility/axiosInstance";
import { useAuth } from "../../../context/Authcontext";
import Link from "next/link"; // Import Link

// Define the shape of the user object
interface UserData {
  id: number;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  test_user: boolean;
  date_joined: string;
  last_login: string | null;
  medium: string | null;
}

export default function AllUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.type === "admin") {
      api
        .get("/exercise-analysis/metadata/all-users/")
        .then((res) => {
          setUsers(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching all users:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  };

  if (authLoading || loading) {
    return <div className="p-10 text-center text-xl">Loading User Data...</div>;
  }

  if (user?.type !== "admin") {
    return <div className="p-10 text-center text-red-500">Access Denied. Admins only.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">All Registered Users</h1>
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            Total: {users.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                {/* ✅ Added Action Column Header */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {userData.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {userData.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {userData.is_superuser ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Admin</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Student</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(userData.date_joined)}
                  </td>
                  
                  {/* ✅ Added Action Button */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      // Redirects to /Progress?userId=7
                      href={`/Progress?userId=${userData.id}`} 
                      className="bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition shadow-sm text-xs uppercase tracking-wide"
                    >
                      View Progress
                    </Link>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}