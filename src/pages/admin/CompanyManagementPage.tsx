import { useState, useEffect, useCallback } from 'react';
import { HeaderManager } from '../../components/header/admin/HeaderManager';
import { GetAllCompaniesAPI, DeleteCompanyAPI, VerifyCompanyAPI } from '../../api';
import { getUserFriendlyMessage, logError } from '../../utils/errorHandler';
import type { CompanyProfileInterface } from '../../utils/interface';
import '../../styles/pages/admin/CompanyManagementPage.css';

// Scale display labels
const SCALE_LABELS: Record<string, string> = {
  '1-10': '1-10 nhân viên',
  '11-50': '11-50 nhân viên',
  '51-200': '51-200 nhân viên',
  '201-500': '201-500 nhân viên',
  '501-1000': '501-1000 nhân viên',
  '1000+': 'Trên 1000 nhân viên',
};

function CompanyManagementPage() {
  const [companies, setCompanies] = useState<CompanyProfileInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);
  const [verifyingCompanyId, setVerifyingCompanyId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const pageSize = 10;

  // Fetch companies with pagination
  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await GetAllCompaniesAPI({
        page: currentPage,
        size: pageSize,
        sort: ['createdAt,desc']
      });
      if (response) {
        setCompanies(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      }
    } catch (error) {
      logError('Fetch companies', error);
      setErrorMessage(getUserFriendlyMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Filter companies by search keyword (client-side for current page)
  const filteredCompanies = companies.filter(company => {
    if (!searchKeyword.trim()) return true;
    const keyword = searchKeyword.toLowerCase();
    return (
      company.name?.toLowerCase().includes(keyword) ||
      company.industry?.toLowerCase().includes(keyword) ||
      company.address?.toLowerCase().includes(keyword) ||
      company.contactEmail?.toLowerCase().includes(keyword)
    );
  });

  // Handle search form submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For client-side filtering, just trigger re-render
    // If you want server-side search, implement search API
  };

  // Handle delete company
  const handleDeleteCompany = async (companyId: string, companyName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa công ty "${companyName}"?\n\nHành động này không thể hoàn tác.`)) {
      return;
    }

    setDeletingCompanyId(companyId);
    setDeleteError(null);

    try {
      await DeleteCompanyAPI(companyId);
      setCompanies(prev => prev.filter(company => company.id !== companyId));
      setTotalElements(prev => prev - 1);
    } catch (error: unknown) {
      logError('Delete company', error);
      
      // Show error message - likely due to existing jobs or constraints
      setDeleteError(`Công ty "${companyName}" vẫn còn tin tuyển dụng. Vui lòng xóa tất cả tin tuyển dụng của công ty này trước.`);
    } finally {
      setDeletingCompanyId(null);
    }
  };

  // Handle verify company
  const handleVerifyCompany = async (companyId: string, currentStatus: boolean) => {
    setVerifyingCompanyId(companyId);
    
    try {
      const updatedCompany = await VerifyCompanyAPI(companyId, !currentStatus);
      if (updatedCompany) {
        setCompanies(prev => prev.map(company => 
          company.id === companyId 
            ? { ...company, isVerified: updatedCompany.isVerified }
            : company
        ));
      }
    } catch (error) {
      logError('Verify company', error);
      alert(getUserFriendlyMessage(error));
    } finally {
      setVerifyingCompanyId(null);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Get initials from company name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <HeaderManager />
      <div className="company-management-container">
        <div className="company-management-header">
          <h1>Quản lý công ty</h1>
          <p>Tổng cộng {totalElements} công ty trong hệ thống</p>
        </div>

        {/* Search */}
        <form className="company-management-filters" onSubmit={handleSearch}>
          <div className="filter-row">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo tên công ty, ngành nghề, địa chỉ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit" className="search-btn">
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Delete Error Popup */}
        {deleteError && (
          <div className="delete-error-overlay" onClick={() => setDeleteError(null)}>
            <div className="delete-error-popup" onClick={(e) => e.stopPropagation()}>
              <div className="delete-error-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="delete-error-title">Không thể xóa công ty</h3>
              <p className="delete-error-message">{deleteError}</p>
              <button 
                className="delete-error-btn"
                onClick={() => setDeleteError(null)}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="company-management-error">
            <span>{errorMessage}</span>
            <button onClick={fetchCompanies}>Thử lại</button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="company-management-loading">
            <span>Đang tải danh sách công ty...</span>
          </div>
        ) : (
          <>
            {/* Company Table */}
            <div className="company-table-container">
              <table className="company-table">
                <thead>
                  <tr>
                    <th>Công ty</th>
                    <th>Ngành nghề</th>
                    <th>Quy mô</th>
                    <th>Địa chỉ</th>
                    <th>Email</th>
                    <th>Xác minh</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="no-data">
                        {searchKeyword ? 'Không tìm thấy công ty phù hợp' : 'Không có công ty nào'}
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map(company => {
                      const isDeleting = deletingCompanyId === company.id;
                      const isVerifying = verifyingCompanyId === company.id;

                      return (
                        <tr key={company.id} className={isDeleting || isVerifying ? 'row-updating' : ''}>
                          <td>
                            <div className="company-cell">
                              {company.logoUrl ? (
                                <img
                                  src={company.logoUrl}
                                  alt={company.name}
                                  className="company-logo"
                                />
                              ) : (
                                <div className="company-logo-placeholder">
                                  {getInitials(company.name || '?')}
                                </div>
                              )}
                              <div className="company-info">
                                <span className="company-name">{company.name}</span>
                                {company.website && (
                                  <a 
                                    href={company.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="company-website"
                                  >
                                    {company.website.replace(/^https?:\/\//, '')}
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{company.industry || 'N/A'}</td>
                          <td>{SCALE_LABELS[company.scale] || company.scale || 'N/A'}</td>
                          <td>
                            <span className="address-cell" title={company.address}>
                              {company.address || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <a href={`mailto:${company.contactEmail}`} className="email-link">
                              {company.contactEmail || 'N/A'}
                            </a>
                          </td>
                          <td>
                            <button
                              className={`verify-btn ${company.isVerified ? 'verified' : 'unverified'}`}
                              onClick={() => handleVerifyCompany(company.id!, company.isVerified || false)}
                              disabled={isVerifying}
                            >
                              {isVerifying ? 'Đang xử lý...' : company.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                            </button>
                          </td>
                          <td>{formatDate(company.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              <a
                                href={`/admin/company/${company.id}`}
                                className="action-btn btn-view"
                                title="Xem chi tiết"
                              >
                                Xem
                              </a>
                              <button
                                className="action-btn btn-delete"
                                onClick={() => handleDeleteCompany(company.id!, company.name)}
                                disabled={isDeleting}
                                title="Xóa công ty"
                              >
                                {isDeleting ? 'Đang xóa...' : 'Xóa'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
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

export { CompanyManagementPage };
