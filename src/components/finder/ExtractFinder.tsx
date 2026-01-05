
import '../../styles/finder/ExtractFinder.css';

function ExtractFinder() {
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
            />
          </div>
          <div className='extract-finder-location-section'>
            <label className='extract-finder-location-title'>
              Địa điểm
            </label>
            <input
              className='extract-finder-location-input'
              placeholder='Thành phố, tỉnh...'
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
            >
              <option value="">Chọn ngành nghề</option>
            </select>
          </div>

          <div className='extract-finder-work-type-section'>
            <label className='extract-finder-work-type-title'>Loại hình công việc</label>
            <select
              className='extract-finder-work-type-input'
            >
              <option value="">Chọn loại hình</option>
            </select>
          </div>
          <div className='extract-finder-salary-section'>
            <label className='extract-finder-salary-title'> Mức lương</label>
            <select
              className='extract-finder-salary-input'
            >
              <option value="">Chọn mức lương</option>
            </select>
          </div>

        </div>
        <div className='extract-finder-box-row-3'>
          <div className='extract-finder-experiece-section'>
            <label className='extract-finder-experience-title'>Kinh nghiệm</label>
            <select
              className='extract-finder-experiece-input'
            >
              <option value="">Chọn kinh nghiệm</option>
            </select>
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
