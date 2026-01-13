import { useState, useEffect, useCallback } from 'react';
import { HeaderManager } from '../../components/header/admin/HeaderManager';
import { GetUsersAPI, UpdateUserStatusAPI, DeleteUserAPI } from '../../api';
import { getUserFriendlyMessage, logError } from '../../utils/errorHandler';
import type { AdminUserInterface, UserStatus, UserRole } from '../../utils/interface';
import '../../styles/pages/admin/UserManagementPage.css';

const STATUS_CONFIG: Record<UserStatus, { label: string; className: string }> = {
  ACTIVE: { label: 'Hoạt động', className: 'status-active' },
  INACTIVE: { label: 'Không hoạt động', className: 'status-inactive' },
  BANNED: { label: 'Đã cấm', className: 'status-banned' },
};

const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
  USER: { label: 'Người dùng', className: 'role-user' },
  RECRUITER: { label: 'Nhà tuyển dụng', className: 'role-recruiter' },
  ADMIN: { label: 'Quản trị viên', className: 'role-admin' },
};

function UserManagementPage() {
  const [users, setUsers] = useState<AdminUserInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const pageSize = 10;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await GetUsersAPI({ page: currentPage, size: pageSize });
      if (response) {
        setUsers(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      }
    } catch (error) {
      logError('Fetch users', error);
      setErrorMessage(getUserFriendlyMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    setUpdatingUserId(userId);
    try {
      await UpdateUserStatusAPI(userId, { status: newStatus });
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      logError('Update user status', error);
      alert(getUserFriendlyMessage(error));
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    setUpdatingUserId(userId);
    try {
      await DeleteUserAPI(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      setTotalElements(prev => prev - 1);
    } catch (error) {
      logError('Delete user', error);
      alert(getUserFriendlyMessage(error));
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <>
      <HeaderManager />
      <div className="user-management-container">
        <div className="user-management-header">
          <h1>Quản lý người dùng</h1>
          <p>Tổng cộng {totalElements} người dùng trong hệ thống</p>
        </div>

        {errorMessage && (
          <div className="user-management-error">
            <span>{errorMessage}</span>
            <button onClick={fetchUsers}>Thử lại</button>
          </div>
        )}

        {isLoading ? (
          <div className="user-management-loading">
            <span>Đang tải danh sách người dùng...</span>
          </div>
        ) : (
          <>
            <div className="user-table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => {
                    const statusConfig = STATUS_CONFIG[user.status] || STATUS_CONFIG.ACTIVE;
                    const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.USER;
                    const isUpdating = updatingUserId === user.id;

                    return (
                      <tr key={user.id} className={isUpdating ? 'row-updating' : ''}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">{getInitial(user.name)}</div>
                            <span className="user-name">{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${roleConfig.className}`}>
                            {roleConfig.label}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${statusConfig.className}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {user.status !== 'ACTIVE' && (
                              <button
                                className="action-btn btn-activate"
                                onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                                disabled={isUpdating}
                                title="Kích hoạt"
                              >
                                Kích hoạt
                              </button>
                            )}
                            {user.status !== 'BANNED' && user.role !== 'ADMIN' && (
                              <button
                                className="action-btn btn-ban"
                                onClick={() => handleStatusChange(user.id, 'BANNED')}
                                disabled={isUpdating}
                                title="Cấm"
                              >
                                Cấm
                              </button>
                            )}
                            {user.role !== 'ADMIN' && (
                              <button
                                className="action-btn btn-delete"
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                disabled={isUpdating}
                                title="Xóa"
                              >
                                Xóa
                              </button>
                            )}
                            {isUpdating && <span className="updating-text">Đang xử lý...</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  Trước
                </button>
                <span className="pagination-info">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export { UserManagementPage };
