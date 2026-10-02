"use client";

import {
  UserCircle,
  Shield,
  Mail,
} from "lucide-react";

import Loader from "@/components/common/Loader";
import useUsers from "@/hooks/useUsers";

export default function UserTable() {
  const { users, loading } = useUsers();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-colors duration-200" style={{padding:"30px"}}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white" style={{padding:"10px"}}>System Users</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1" style={{padding:"10px"}}>Librarians and staff accounts</p>
        </div>
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Total Users: <span className="text-blue-600 dark:text-blue-400 font-bold">{users.length}</span>
        </div>
      </div>
 
      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800" style={{padding:"10px"}}>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="px-6 py-4" style={{padding:"10px"}}>User</th>
              <th className="px-6 py-4 " style={{padding:"10px"}}>Email</th>
              <th className="px-6 py-4" style={{padding:"10px"}}>Role</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.length > 0 ? (
              users.map((user: any) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserCircle size={36} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100" style={{padding:"10px"}}>{user.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500" style={{padding:"10px"}}>ID: {user._id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-slate-400 dark:text-slate-500 shrink-0" />
                      <span>{user.email}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                     text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border 
                     border-blue-200/50 dark:border-blue-800/50 capitalize" style={{padding:"10px"}}>
                      <Shield size={14} className="text-blue-600 dark:text-blue-400"  />
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}