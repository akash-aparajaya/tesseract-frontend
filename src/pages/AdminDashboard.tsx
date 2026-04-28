import React, { useState, useEffect } from 'react';
import '../styles/AdminPanel.css';
import { useToast } from '../hooks/useToast'; // adjust path
import { getAllAdminApi, activateOrDeactivateAdminApi, createAdminApi, changePasswordApi } from '../services/adminApi'; // adjust import

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joined: string;
  active: boolean;
}

const AdminPanelContent: React.FC = () => {
  const { showToast, ToastContainer } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create user modal
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Admin' });
  const [creating, setCreating] = useState(false);

  // Change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Fetch all users on mount
  useEffect(() => {fetchUsers()}, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllAdminApi();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Toggle active status
  const toggleActive = async (id: number, currentStatus: boolean) => {
  try {
    const newStatus = !currentStatus;

    await activateOrDeactivateAdminApi(id, newStatus);

    // ✅ Optimistic update
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, active: newStatus } : user
      )
    );

    showToast(
      `User ${newStatus ? "activated" : "deactivated"} successfully`,
      "success"
    );

  } catch (error) {
    console.error("Status update failed:", error);
    showToast("Failed to update status", "error");
  }
};

  // Create admin
  const handleCreate = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      showToast('Please fill all fields', 'error');
      return;
    }
    if (newUser.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    try {
      setCreating(true);
      const response = await createAdminApi(
        newUser.name,
        newUser.email,
        newUser.password,
        newUser.role,
      );
      const createdUser = response.data;
      // Add to local state
      setUsers([...users, createdUser]);
      setNewUser({ name: "", email: "", password: "", role: "Admin" });
      setShowModal(false);
      showToast("Admin created successfully", "success");
    } catch (error) {
      console.error("Create failed:", error);
      showToast("Failed to create admin", "error");
    } finally {
      setCreating(false);
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Both fields are required');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (!selectedUser) return;

    try {
      setUpdatingPassword(true);
      await changePasswordApi(selectedUser.id, passwordData.newPassword);
      showToast(`Password changed for ${selectedUser.name}`, 'success');
      setShowPasswordModal(false);
      setSelectedUser(null);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setPasswordError('');
    } catch (error) {
      console.error('Password update failed:', error);
      showToast('Failed to change password', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return <div className="admin-content"><div className="loading-screen">Loading users...</div></div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="admin-content">
        <div className="content-header">
          <div>
            <h1>Admin Control Panel</h1>
            <p className="subtitle">Manage users, roles and system access</p>
          </div>
          <button className="add-user-btn" onClick={() => setShowModal(true)}>
            <span>+</span> Add User
          </button>
        </div>

        <div className="users-grid">
          {users.map(user => (
            <div key={user.id} className={`user-card ${!user.active ? 'inactive' : ''}`}>
              <div className="card-avatar">
                <div className="avatar">{user?.name?.charAt(0)}</div>
              </div>
              <div className="card-info">
                <div className="info-row">
                  <h3>{user.name}</h3>
                  <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="email">{user.email}</p>
                <div className="meta-row">
                  <span className={`role-badge ${user.role === 'Super Admin' ? 'super' : user.role === 'Manager' ? 'manager' : 'admin'}`}>
                    {user.role}
                  </span>
                  <span className="joined">Joined: {user.joined}</span>
                </div>
                <div className="action-row">
                  <div className="toggle-row">
                    <span className="toggle-label">Change status</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={user.active}
                        onChange={() => toggleActive(user.id, user.active)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <button className="change-password-btn" onClick={() => {
                    setSelectedUser(user);
                    setShowPasswordModal(true);
                  }}>
                    🔑 Change Password
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create User Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create Admin</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <p className="modal-sub">Add a new admin user to the system</p>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" placeholder="Enter full name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="Enter email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Enter password (min 6 chars)" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                  <option>Admin</option>
                  <option>Super Admin</option>
                  <option>Manager</option>
                </select>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-create" onClick={handleCreate} disabled={creating}>
                  {creating ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showPasswordModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Change Password</h2>
                <button className="close-btn" onClick={() => setShowPasswordModal(false)}>×</button>
              </div>
              <p className="modal-sub">Update password for <strong>{selectedUser.name}</strong></p>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              {passwordError && <span className="error-text">{passwordError}</span>}
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                <button className="btn-create" onClick={handlePasswordChange} disabled={updatingPassword}>
                  {updatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanelContent;