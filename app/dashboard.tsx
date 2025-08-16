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
        return <Dashboard key="dashboard" />;
      case 'reward':
        return <Rewards key="reward" />;
      case 'finance':
        return <Finance key="finance" />;
      case 'card':
        return <Cards key="card" />;
      case 'me':
        return <Me key="me" />;
      default:
        return <Dashboard key="default" />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}