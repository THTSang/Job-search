import React from 'react';
import '../../styles/finder/FuzzyFinder.css';

function FuzzyFinder() {

  return (
    <div className='fuzzy-finder-container'>
      <input
        className='fuzzy-finder-search-job'
        placeholder='Tìm kiếm công việc, từ khóa ...'
      />
      <input
        className='fuzzy-finder-search-place'
        placeholder='Địa điểm'
      />
      <button className='fuzzy-finder-search-button'>
        Tìm kiếm
      </button>
    </div>
  );
}
export { FuzzyFinder };
