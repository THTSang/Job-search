import React from 'react';
import { HeaderManager } from '../components/header/HeaderManager.tsx';
import { ExtractFinder } from '../components/finder/ExtractFinder';
import '../styles/pages/JobPage.css';

function JobPage() {
  return (
    <>
      <HeaderManager />
      <ExtractFinder />
      <div className='job-find-counting'>
        Tìm thấy 8 công việc
      </div>
    </>
  );
}
export { JobPage };

