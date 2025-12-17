import React from 'react';
import '../../styles/finder/ExtractFinder.css';

function ExtractFinder() {
  return (
    <div className='extract-finder-section'>
      <div className='extract-finder-tittle'>
        Tìm kiếm công việc
      </div>
      <div className='extract-finder-box'>
        <div className='extract-finder-box-row-1'>
          <div className='extract-finder-find-work-section'>
            <span className='extract-finder-find-work-title'>
              Từ khóa công việc
            </span>
            <input
              className='extract-finder-find-work-input'
              placeholder='Vị trí, kĩ năng, công ty...'
            />
          </div>
          <div className='extract-finder-location-section'>p
            <span className='extract-finder-location-title'>
              Địa điểm
            </span>
            <input
              className='extract-finder-location-input'
              placeholder='Thành phố, tỉnh...'
            />
          </div>
        </div>
        <div className='etract-finder-box-row-2'>
          <div className='extract-finder-work-section'>
            <span className='extract-finder-work-title'>
              Ngành nghề
            </span>
            <input
              className='extract-finder-work-input'
              placeholder='Chọn ngành nghề...'
            />
          </div>

          <div className='extract-finder-work-type-section'>
            <span className='extract-finder-work-type-title'>Loại hình công việc</span>
            <input
              className='extract-finder-work-type-input'
              placeholder='Chọn loại hình công việc'
            />
          </div>
          <div className='extract-finder-salary-section'>
            <span className='extract-finder-salary-title'> Mức lương</span>
            <input
              className='extract-finder-salary-input'
              placeholder='Chọn mức lương'
            />
          </div>

        </div>
        <div className='extract-finder-box-row-3'>
          <div className='extract-finder-experiece-section'>
            <span className='extract-finder-salary-title'>Kinh nghiệm</span>
            <input
              className='extract-finder-experiece-input'
              placeholder='Chọn kinh nghiệm'
            />
          </div>
          <button className='extract-finder-search-button'>
            Lọc kết quả
          </button>
        </div>
      </div>
    </div>
  );
}
export { ExtractFinder };
