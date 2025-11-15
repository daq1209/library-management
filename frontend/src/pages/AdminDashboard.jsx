// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  adminGetUsers,
  adminGetLogs,
  adminUpdateUserRole,
  adminUpdateUserStatus,
} from "../utils/adminAPI";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await adminGetUsers();
      console.log("🔹 Admin - users response:", res.data);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("❌ Error loading users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await adminGetLogs(50);
      console.log("🔹 Admin - logs response:", res.data);
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("❌ Error loading logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    console.log("✅ AdminDashboard mounted");
    loadUsers();
    loadLogs();
  }, []);

  const handleChangeRole = async (id, newRole) => {
    try {
      await adminUpdateUserRole(id, newRole);
      await loadUsers();
      await loadLogs();
    } catch (err) {
      console.error("❌ Error updating role:", err);
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await adminUpdateUserStatus(id, newStatus);
      await loadUsers();
      await loadLogs();
    } catch (err) {
      console.error("❌ Error updating status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mb-6">
          Quản lý tài khoản, phân quyền và xem nhật ký hệ thống.
        </p>

        {/* USERS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Người dùng</h2>
          {loadingUsers ? (
            <p>Đang tải người dùng...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="p-2">Tên</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Trạng thái</th>
                    <th className="p-2 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleChangeRole(u.id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="admin">Admin</option>
                          <option value="librarian">Librarian</option>
                          <option value="reader">Reader</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={u.status}
                          onChange={(e) =>
                            handleChangeStatus(u.id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </td>
                      <td className="p-2 text-right">
                        <button className="px-3 py-1 rounded bg-slate-900 text-white text-xs">
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-4 text-center text-slate-500"
                      >
                        Không có người dùng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* LOGS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-lg font-semibold mb-3">Nhật ký hệ thống</h2>
          {loadingLogs ? (
            <p>Đang tải log...</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 border border-slate-100 rounded-lg bg-slate-50 text-sm"
                >
                  <div className="text-xs text-slate-500">
                    {log.createdAt}
                  </div>
                  <div className="font-semibold">{log.actorEmail}</div>
                  <div>{log.action}</div>
                </div>
              ))}
              {logs.length === 0 && (
                <p className="text-sm text-slate-500">Chưa có log nào.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
