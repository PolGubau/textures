import { useEffect, useState } from 'react';
import Loader from './components/Loader';
import Index from './pages/Index';

function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className='bg-background text-foreground'>
      <Loader visible={showLoader} />
      <main id="main">

        <Index />
      </main>
    </div>
  );
}

export default App;
