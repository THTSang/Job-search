import { useState } from 'react';
import '../../styles/finder/FuzzyFinder.css';

interface FuzzyFinderProps {
  onSearch: (keyword: string, location: string) => void;
  isLoading?: boolean;
}

function FuzzyFinder({ onSearch, isLoading = false }: FuzzyFinderProps) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onSearch(keyword.trim(), location.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='fuzzy-finder-container'>
      <input
        className='fuzzy-finder-search-job'
        placeholder='Tìm kiếm công việc, từ khóa ...'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        className='fuzzy-finder-search-place'
        placeholder='Địa điểm'
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button 
        className='fuzzy-finder-search-button'
        onClick={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
      </button>
    </div>
  );
}
export { FuzzyFinder };
