import React from "react";
import { HeaderManager } from "./components/header/HeaderManager";
import { useCurrentPage } from './store';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const currentPage = useCurrentPage((state) => state.currentPage);
  if (currentPage === 'Home') {
    navigate('/homepage');
  }
  else if (currentPage === 'findJob') {
    navigate('/jobpage');
  }
  else if (currentPage === 'jobApplies') {
    navigate('/jobapplies');
  }
  else if (currentPage === 'followCompanies') {
    navigate('/followcompanies');
  }
  else if (currentPage === 'messages') {
    navigate('/messages');
  }
  return (
    <HeaderManager />
  );

}

export default App;
