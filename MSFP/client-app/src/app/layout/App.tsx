import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import MobileCalendar from '../../features/Calendar/MobileCalendar';
import FullScreenCalendar from '../../features/Calendar/FullScreenCalendar';
import { Legend } from '../../features/Calendar/Legend';
import ModalContainer from '../common/ModalContainer';
import Outlook from '../../features/Sync/Outlook';
import Apple from '../../features/Sync/Apple';
import Android from '../../features/Sync/Android';
import Google from '../../features/Sync/Google';


function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [page, setPage] = useState("calendar");
  const handleSetPage = (newPage : string) => {setPage(newPage)}

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <ModalContainer />
      <Navbar setPage={handleSetPage}/>
      <div style={{height: '100px'}}></div>
      {page === 'calendar' && !isMobile && <Legend />}
      {page === 'calendar' && !isMobile && <FullScreenCalendar />}
      {page === 'calendar' && isMobile && <MobileCalendar/>  }
      {page === 'outlook' && <Outlook setPage={handleSetPage} />}
      {page === 'apple' && <Apple setPage={handleSetPage} />}
      {page === 'android' && <Android setPage={handleSetPage} />}
      {page === 'google' && <Google setPage={handleSetPage} />}
    </div>
  );
}

export default App;
