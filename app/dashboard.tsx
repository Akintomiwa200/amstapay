import DashboardLayout from '@/layout/dashboardLayout';
import React, { useState, useCallback } from 'react';
import Cards from './card';
import Finance from './finance';
import Me from './me';
import Rewards from './rewards';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshUser();
    } finally {
      setRefreshing(false);
    }
  }, [refreshUser]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent key="dashboard" />;
      case 'reward':
        return <Rewards key="reward" />;
      case 'finance':
        return <Finance key="finance" />;
      case 'card':
        return <Cards key="card" />;
      case 'me':
        return <Me key="me" />;
      default:
        return <DashboardContent key="default" />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </DashboardLayout>
  );
}

function DashboardContent() {
  const { user } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      {/* Dashboard content - import your existing components here */}
      <View style={{ padding: 20 }}>
        <Text>Welcome, {user?.fullName || 'User'}!</Text>
      </View>
    </View>
  );
}
