import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import MobileCalendar from '../../features/Calendar/MobileCalendar';
import FullScreenCalendar from '../../features/Calendar/FullScreenCalendar';
import { Legend } from '../../features/Calendar/Legend';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


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
      <Navbar/>
      <div style={{height: '100px'}}></div>
      {!isMobile && <Legend />}
      {isMobile ? <MobileCalendar /> : <FullScreenCalendar />} 
    </div>
  );
}

export default App;
