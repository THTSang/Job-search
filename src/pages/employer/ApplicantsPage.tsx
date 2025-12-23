import '../../styles/pages/ApplicantsPage.css'
import { HeaderManager } from '../../components/header/employer/HeaderManager';

function ApplicantsPage() {
  return (
    <>
      <HeaderManager />
      <div className='applicants-page-container'>
        <div className='applicants-page-header'>
          <h1 className='applicants-page-title'>Quản lý đơn ứng tuyển</h1>
          <p className='applicants-page-counting'>3 đơn ứng tuyển</p>
        </div>

        <div className='applicants-page-search'>
          <div className='applicants-search-input-wrapper'>
            <input
              type='text'
              className='applicants-search-input'
              placeholder='Tìm kiếm ứng viên hoặc vị trí...'
            />
          </div>
          <select className='applicants-filter-select'>
            <option value='all'>Tất cả</option>
            <option value='pending'>Chờ xử lý</option>
            <option value='reviewing'>Đang xem xét</option>
            <option value='interview'>Phỏng vấn</option>
            <option value='rejected'>Từ chối</option>
            <option value='accepted'>Chấp nhận</option>
          </select>
        </div>

        <div className='applicants-page-list'>
          {/* Applicant Card 1 */}
          <div className='applicant-card'>
            <div className='applicant-avatar applicant-avatar-purple'>N</div>

            <div className='applicant-info'>
              <h3 className='applicant-name'>Nguyễn Văn A</h3>
              <p className='applicant-email'>nguyenvana@email.com</p>
              <p className='applicant-job'>
                Ứng tuyển: <a href='#' className='applicant-job-link'>Senior Frontend Developer (ReactJS)</a>
              </p>
              <p className='applicant-date'>Ngày nộp: 2025-01-15</p>
            </div>

            <div className='applicant-status'>
              <span className='applicant-status-badge status-pending'>Chờ xử lý</span>
            </div>

            <div className='applicant-actions'>
              <button className='applicant-action-button action-view'>
                <span className='action-icon'>👁</span>
                Xem CV
              </button>
              <button className='applicant-action-button action-interview'>
                <span className='action-icon'>📅</span>
                Mời phỏng vấn
              </button>
              <button className='applicant-action-button action-accept'>
                <span className='action-icon'>✓</span>
                Chấp nhận
              </button>
              <button className='applicant-action-button action-reject'>
                <span className='action-icon'>✕</span>
                Từ chối
              </button>
              <button className='applicant-action-button action-message'>
                <span className='action-icon'>💬</span>
                Nhắn tin
              </button>
            </div>
          </div>

          {/* Applicant Card 2 */}
          <div className='applicant-card'>
            <div className='applicant-avatar applicant-avatar-blue'>T</div>

            <div className='applicant-info'>
              <h3 className='applicant-name'>Trần Thị B</h3>
              <p className='applicant-email'>tranthib@email.com</p>
              <p className='applicant-job'>
                Ứng tuyển: <a href='#' className='applicant-job-link'>Senior Frontend Developer (ReactJS)</a>
              </p>
              <p className='applicant-date'>Ngày nộp: 2025-01-14</p>
            </div>

            <div className='applicant-status'>
              <span className='applicant-status-badge status-reviewing'>Đang xem xét</span>
            </div>

            <div className='applicant-actions'>
              <button className='applicant-action-button action-view'>
                <span className='action-icon'>👁</span>
                Xem CV
              </button>
              <button className='applicant-action-button action-message'>
                <span className='action-icon'>💬</span>
                Nhắn tin
              </button>
            </div>
          </div>

          {/* Applicant Card 3 */}
          <div className='applicant-card'>
            <div className='applicant-avatar applicant-avatar-green'>L</div>

            <div className='applicant-info'>
              <h3 className='applicant-name'>Lê Văn C</h3>
              <p className='applicant-email'>levanc@email.com</p>
              <p className='applicant-job'>
                Ứng tuyển: <a href='#' className='applicant-job-link'>Backend Developer (Node.js)</a>
              </p>
              <p className='applicant-date'>Ngày nộp: 2025-01-13</p>
            </div>

            <div className='applicant-status'>
              <span className='applicant-status-badge status-interview'>Phỏng vấn</span>
            </div>

            <div className='applicant-actions'>
              <button className='applicant-action-button action-view'>
                <span className='action-icon'>👁</span>
                Xem CV
              </button>
              <button className='applicant-action-button action-message'>
                <span className='action-icon'>💬</span>
                Nhắn tin
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export { ApplicantsPage };
