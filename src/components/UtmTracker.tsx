import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureUtmParams } from '../utils/utm';

export default function UtmTracker() {
  const location = useLocation();

  useEffect(() => {
    captureUtmParams();
  }, [location.pathname, location.search]);

  return null;
}
