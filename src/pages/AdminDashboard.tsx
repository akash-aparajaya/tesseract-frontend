import React, { useState } from 'react';
import '../styles/AdminPanel.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joined: string;
  active: boolean;
}

const AdminPanelContent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Akash', email: 'akash@gmail.com', role: 'Admin', joined: '4/20/2026', active: true },
    { id: 2, name: 'John Doe', email: 'john@gmail.com', role: 'Super Admin', joined: '4/21/2026', active: true },
    { id: 3, name: 'Priya', email: 'priya@gmail.com', role: 'Manager', joined: '4/22/2026', active: false },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Admin' });

  // Change password states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;
    const newId = users.length + 1;
    const today = new Date().toLocaleDateString('en-US');
    setUsers([
      ...users,
      {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        joined: today,
        active: true,
      },
    ]);
    setNewUser({ name: '', email: '', password: '', role: 'Admin' });
    setShowModal(false);
  };

  const toggleActive = (id: number) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, active: !user.active } : user
    ));
  };

  // Open change password modal
  const openChangePassword = (user: User) => {
    setSelectedUser(user);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setShowPasswordModal(true);
  };

  // Handle password change
  const handlePasswordChange = () => {
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

    // Mock API call – replace with actual API
    console.log(`Changing password for ${selectedUser?.name} to: ${passwordData.newPassword}`);
    alert(`Password changed successfully for ${selectedUser?.name}`);

    // Close modal and reset
    setShowPasswordModal(false);
    setSelectedUser(null);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setPasswordError('');
  };

  return (
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
              <div className="avatar">{user.name.charAt(0)}</div>
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
                    <input type="checkbox" checked={user.active} onChange={() => toggleActive(user.id)} />
                    <span className="slider round"></span>
                  </label>
                </div>
                <button className="change-password-btn" onClick={() => openChangePassword(user)}>
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
              <input type="text" name="name" placeholder="Enter full name" value={newUser.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter email" value={newUser.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter password" value={newUser.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={newUser.role} onChange={handleChange}>
                <option>Admin</option>
                <option>Super Admin</option>
                <option>Manager</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-create" onClick={handleCreate}>Create Admin</button>
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
              <button className="btn-create" onClick={handlePasswordChange}>Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelContent;