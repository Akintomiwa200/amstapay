import DashboardLayout from '@/layout/dashboardLayout';
import React, { useState } from 'react';
import Cards from './card';
import Dashboard from './dashboardScreen';
import Finance from './finance';
import Me from './me';
import Rewards from './reward';

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'reward':
        return <Rewards />;
      case 'finance':
        return <Finance />;
      case 'card':
        return <Cards />;
      case 'me':
        return <Me />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}

