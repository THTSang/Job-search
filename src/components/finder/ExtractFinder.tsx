import { useState } from 'react';
import type { JobSearchRequest, EmploymentType } from '../../utils/interface';
import '../../styles/finder/ExtractFinder.css';

interface ExtractFinderProps {
  onSearch: (filters: JobSearchRequest) => void;
  isLoading?: boolean;
}

// Salary range options
const SALARY_OPTIONS = [
  { label: 'Tất cả mức lương', value: '', minSalary: 0, maxSalary: 0 },
  { label: 'Dưới 10 triệu', value: 'under10', minSalary: 0, maxSalary: 10000000 },
  { label: '10 - 20 triệu', value: '10to20', minSalary: 10000000, maxSalary: 20000000 },
  { label: '20 - 30 triệu', value: '20to30', minSalary: 20000000, maxSalary: 30000000 },
  { label: '30 - 50 triệu', value: '30to50', minSalary: 30000000, maxSalary: 50000000 },
  { label: 'Trên 50 triệu', value: 'over50', minSalary: 50000000, maxSalary: 0 },
];

// Experience options
const EXPERIENCE_OPTIONS = [
  { label: 'Tất cả kinh nghiệm', value: '' },
  { label: 'Không yêu cầu', value: '0' },
  { label: '1 năm', value: '1' },
  { label: '2 năm', value: '2' },
  { label: '3 năm', value: '3' },
  { label: '5+ năm', value: '5' },
];

// Job type options
const JOB_TYPE_OPTIONS: { label: string; value: EmploymentType | '' }[] = [
  { label: 'Tất cả loại hình', value: '' },
  { label: 'Toàn thời gian', value: 'FULL_TIME' },
  { label: 'Bán thời gian', value: 'PART_TIME' },
  { label: 'Hợp đồng', value: 'CONTRACT' },
  { label: 'Thực tập', value: 'INTERNSHIP' },
  { label: 'Làm việc từ xa', value: 'REMOTE' },
];

// Category options (common categories)
const CATEGORY_OPTIONS = [
  { label: 'Tất cả ngành nghề', value: '' },
  { label: 'Công nghệ thông tin', value: 'Công nghệ thông tin' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Kinh doanh / Bán hàng', value: 'Kinh doanh' },
  { label: 'Tài chính / Kế toán', value: 'Tài chính' },
  { label: 'Nhân sự', value: 'Nhân sự' },
  { label: 'Thiết kế', value: 'Thiết kế' },
  { label: 'Sản xuất', value: 'Sản xuất' },
  { label: 'Giáo dục / Đào tạo', value: 'Giáo dục' },
  { label: 'Y tế / Sức khỏe', value: 'Y tế' },
  { label: 'Khác', value: 'Khác' },
];

function ExtractFinder({ onSearch, isLoading = false }: ExtractFinderProps) {
  // Filter state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [jobType, setJobType] = useState<EmploymentType | ''>('');
  const [salaryRange, setSalaryRange] = useState('');
  const [experience, setExperience] = useState('');

  const handleSearch = () => {
    const filters: JobSearchRequest = {};

    // Add keyword if provided
    if (keyword.trim()) {
      filters.keyword = keyword.trim();
    }

    // Add location if provided
    if (location.trim()) {
      filters.locationCity = location.trim();
    }

    // Add category if selected
    if (category) {
      filters.categoryName = category;
    }

    // Add job type if selected
    if (jobType) {
      filters.jobType = jobType;
    }

    // Add salary range if selected
    if (salaryRange) {
      const selectedSalary = SALARY_OPTIONS.find(opt => opt.value === salaryRange);
      if (selectedSalary) {
        if (selectedSalary.minSalary > 0) {
          filters.minSalary = selectedSalary.minSalary;
        }
        if (selectedSalary.maxSalary > 0) {
          filters.maxSalary = selectedSalary.maxSalary;
        }
      }
    }

    // Add experience if selected
    if (experience) {
      filters.minExperience = parseInt(experience, 10);
    }

    onSearch(filters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    setKeyword('');
    setLocation('');
    setCategory('');
    setJobType('');
    setSalaryRange('');
    setExperience('');
    onSearch({});
  };

  const hasActiveFilters = keyword || location || category || jobType || salaryRange || experience;

  return (
    <div className='extract-finder-section'>
      <div className='extract-finder-box'>
        <div className='extract-finder-box-row-1'>
          <div className='extract-finder-find-work-section'>
            <label className='extract-finder-find-work-title'>
              Từ khóa công việc
            </label>
            <input
              className='extract-finder-find-work-input'
              placeholder='Vị trí, kĩ năng, công ty...'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className='extract-finder-location-section'>
            <label className='extract-finder-location-title'>
              Địa điểm
            </label>
            <input
              className='extract-finder-location-input'
              placeholder='Thành phố, tỉnh...'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className='etract-finder-box-row-2'>
          <div className='extract-finder-work-section'>
            <label className='extract-finder-work-title'>
              Ngành nghề
            </label>
            <select
              className='extract-finder-work-input'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className='extract-finder-work-type-section'>
            <label className='extract-finder-work-type-title'>Loại hình công việc</label>
            <select
              className='extract-finder-work-type-input'
              value={jobType}
              onChange={(e) => setJobType(e.target.value as EmploymentType | '')}
            >
              {JOB_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className='extract-finder-salary-section'>
            <label className='extract-finder-salary-title'>Mức lương</label>
            <select
              className='extract-finder-salary-input'
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
            >
              {SALARY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='extract-finder-box-row-3'>
          <div className='extract-finder-experiece-section'>
            <label className='extract-finder-experience-title'>Kinh nghiệm</label>
            <select
              className='extract-finder-experiece-input'
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className='extract-finder-buttons'>
            {hasActiveFilters && (
              <button 
                className='extract-finder-clear-button'
                onClick={handleClearFilters}
                type="button"
              >
                Xóa bộ lọc
              </button>
            )}
            <button 
              className='extract-finder-search-button'
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? 'Đang tìm...' : 'Lọc kết quả'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ExtractFinder };
