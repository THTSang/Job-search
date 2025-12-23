import { useLocation } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager.tsx';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager.tsx';
import { FuzzyFinder } from "../../components/finder/FuzzyFinder.tsx";
import '../../styles/pages/jobseeker/HomePage.css';

function HomePage() {
  const location = useLocation();
  const isEmployer = location.pathname.startsWith('/employer');
  const HeaderManager = isEmployer ? EmployerHeader : JobSeekerHeader;

  return (
    <>
      <HeaderManager />
      <div className='slogan-section'>
        <div className='title-big'>
          Tìm công việc mơ ước của bạn
        </div>
        <div className='title-small'>
          Hàng ngàn cơ hội việc làm đang chờ đón bạn
        </div>
      </div>
      <div className='status-section'>
        <div className='current-job-counting'>
          <div className='job-counting-title-section'>
            Công việc
          </div>
        </div>

        <div className='current-company-counting'>
          <div className='company-counting-title-section'>
            Công ty
          </div>
        </div>

        <div className='current-user-counting'>
          <div className='user-counting-title-section'>
            Ứng viên
          </div>
        </div>
      </div>
      <FuzzyFinder />
      <div className='flavor-job-section'>
        <div className='favor-job-title'>
          Công việc nổi bật
        </div>

        <div className='favor-job-grid'>
          {/* Job Card 1 */}
          <div className='favor-job-card'>
            <div className='favor-job-card-header'>
              <div className='favor-job-company-logo favor-job-logo-blue'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className='favor-job-badge'>Hot</span>
            </div>
            <h3 className='favor-job-title-text'>Frontend Developer</h3>
            <div className='favor-job-company'>Công ty TNHH ABC</div>
            <div className='favor-job-details'>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Hồ Chí Minh
              </span>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                15-25 triệu
              </span>
            </div>
            <div className='favor-job-tags'>
              <span className='favor-job-tag'>React</span>
              <span className='favor-job-tag'>TypeScript</span>
              <span className='favor-job-tag'>CSS</span>
            </div>
          </div>

          {/* Job Card 2 */}
          <div className='favor-job-card'>
            <div className='favor-job-card-header'>
              <div className='favor-job-company-logo favor-job-logo-green'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className='favor-job-badge favor-job-badge-new'>Mới</span>
            </div>
            <h3 className='favor-job-title-text'>Backend Developer</h3>
            <div className='favor-job-company'>Công ty XYZ Tech</div>
            <div className='favor-job-details'>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Hà Nội
              </span>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                20-30 triệu
              </span>
            </div>
            <div className='favor-job-tags'>
              <span className='favor-job-tag'>Java</span>
              <span className='favor-job-tag'>Spring Boot</span>
              <span className='favor-job-tag'>MySQL</span>
            </div>
          </div>

          {/* Job Card 3 */}
          <div className='favor-job-card'>
            <div className='favor-job-card-header'>
              <div className='favor-job-company-logo favor-job-logo-purple'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
            </div>
            <h3 className='favor-job-title-text'>UI/UX Designer</h3>
            <div className='favor-job-company'>Digital Solutions Co.</div>
            <div className='favor-job-details'>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Đà Nẵng
              </span>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                18-28 triệu
              </span>
            </div>
            <div className='favor-job-tags'>
              <span className='favor-job-tag'>Figma</span>
              <span className='favor-job-tag'>Adobe XD</span>
              <span className='favor-job-tag'>Sketch</span>
            </div>
          </div>

          {/* Job Card 4 */}
          <div className='favor-job-card'>
            <div className='favor-job-card-header'>
              <div className='favor-job-company-logo favor-job-logo-orange'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className='favor-job-badge'>Hot</span>
            </div>
            <h3 className='favor-job-title-text'>DevOps Engineer</h3>
            <div className='favor-job-company'>Tech Innovators</div>
            <div className='favor-job-details'>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Hồ Chí Minh
              </span>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                25-40 triệu
              </span>
            </div>
            <div className='favor-job-tags'>
              <span className='favor-job-tag'>AWS</span>
              <span className='favor-job-tag'>Docker</span>
              <span className='favor-job-tag'>K8s</span>
            </div>
          </div>

          {/* Job Card 5 */}
          <div className='favor-job-card'>
            <div className='favor-job-card-header'>
              <div className='favor-job-company-logo favor-job-logo-pink'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className='favor-job-badge favor-job-badge-new'>Mới</span>
            </div>
            <h3 className='favor-job-title-text'>Mobile Developer</h3>
            <div className='favor-job-company'>AppDev Studio</div>
            <div className='favor-job-details'>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Hà Nội
              </span>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                22-35 triệu
              </span>
            </div>
            <div className='favor-job-tags'>
              <span className='favor-job-tag'>React Native</span>
              <span className='favor-job-tag'>Flutter</span>
              <span className='favor-job-tag'>iOS</span>
            </div>
          </div>

          {/* Job Card 6 */}
          <div className='favor-job-card'>
            <div className='favor-job-card-header'>
              <div className='favor-job-company-logo favor-job-logo-teal'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
            </div>
            <h3 className='favor-job-title-text'>Product Manager</h3>
            <div className='favor-job-company'>Innovation Labs</div>
            <div className='favor-job-details'>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Hồ Chí Minh
              </span>
              <span className='favor-job-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                30-45 triệu
              </span>
            </div>
            <div className='favor-job-tags'>
              <span className='favor-job-tag'>Agile</span>
              <span className='favor-job-tag'>Scrum</span>
              <span className='favor-job-tag'>Jira</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export { HomePage };
