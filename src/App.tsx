import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import PhotoPage from './pages/PhotoPage';
import HanabiPage from './pages/HanabiPage';
import MapPage from './pages/MapPage';
import QRPage from './pages/QRPage';
import LotteryPage from './pages/LotteryPage';

const App = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HanabiPage />} />
            <Route path="/photo" element={<PhotoPage />} />
            <Route path="/hanabi" element={<HanabiPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/qr" element={<QRPage />} />
            <Route path="/lottery" element={<LotteryPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;