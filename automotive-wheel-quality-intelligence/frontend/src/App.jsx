import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import ThreeDLanding from './components/ThreeDLanding/ThreeDLanding';
import Landing from './pages/Landing/Landing';
import Dashboard from './pages/Dashboard/Dashboard';
import FlowchartPage from './pages/FlowchartPage/FlowchartPage';
import BatchesPage from './pages/BatchesPage/BatchesPage';
import TeamPage from './pages/TeamPage/TeamPage';
import ArchitecturePage from './pages/ArchitecturePage/ArchitecturePage';
import Toast from './components/Toast/Toast';
import './App.css';

export default function App() {
  // Automatically activates 3D landing animation when page is loaded / refreshed
  const [show3DIntro, setShow3DIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedWheelIndex, setSelectedWheelIndex] = useState(0);
  const [toast, setToast] = useState(null);

  const handleNotify = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleSimulateNewScan = () => {
    setSelectedWheelIndex((prev) => (prev + 1) % 5);
    setActiveTab('dashboard');
    setShow3DIntro(false);
    handleNotify('Cycled sample to next wheel specimen. Running vision inference...', 'info');
  };

  const handleEnterCockpit = () => {
    setShow3DIntro(false);
    setActiveTab('dashboard');
  };

  const handleEnterOverview = () => {
    setShow3DIntro(false);
    setActiveTab('landing');
  };

  const handleReplayIntro = () => {
    sessionStorage.removeItem('wqi-intro');
    setShow3DIntro(true);
  };

  return (
    <div className="app-shell">
      {/* 3D Falling Tyre & Bouncing Logo Landing Screen */}
      {show3DIntro && (
        <ThreeDLanding
          onEnterCockpit={handleEnterCockpit}
          onEnterOverview={handleEnterOverview}
        />
      )}

      {/* Top Glassmorphic Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setShow3DIntro(false);
          setActiveTab(tab);
        }}
        onSimulateNewScan={handleSimulateNewScan}
        onReplayIntro={handleReplayIntro}
      />

      {/* Main View Container */}
      <main className="app-main-content">
        {activeTab === 'landing' && (
          <Landing
            onLaunchDashboard={() => setActiveTab('dashboard')}
            onOpenFlowchart={() => setActiveTab('flowchart')}
            onSelectSample={(idx) => {
              setSelectedWheelIndex(idx);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            selectedWheelIndex={selectedWheelIndex}
            setSelectedWheelIndex={setSelectedWheelIndex}
            onNotify={handleNotify}
          />
        )}

        {activeTab === 'flowchart' && (
          <FlowchartPage onLaunchDashboard={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'telemetry' && <BatchesPage />}

        {activeTab === 'team' && <TeamPage />}

        {activeTab === 'architecture' && (
          <ArchitecturePage onLaunchDashboard={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* Toast Notification Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
