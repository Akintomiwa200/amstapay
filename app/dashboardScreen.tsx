


import BalanceCard from '@/components/dashboardComponent/BalanceCard';
import BonusSection from '@/components/dashboardComponent/BonusSection';
import EmailBanner from '@/components/dashboardComponent/EmailBanner';
import QuickActions from '@/components/dashboardComponent/QuickAction';
import ServicesGrid from '@/components/dashboardComponent/ServicesGrid';
import React from 'react';
import { ScrollView } from 'react-native';

const Dashboard = () => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <BalanceCard />
    <QuickActions />
    <EmailBanner />
    <ServicesGrid />
    <BonusSection />
  </ScrollView>
);

export default Dashboard;
