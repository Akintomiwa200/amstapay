import BalanceCard from '@/components/dashboardComponent/BalanceCard';
import BonusSection from '@/components/dashboardComponent/BonusSection';
import EmailBanner from '@/components/dashboardComponent/EmailBanner';
import Header from "@/components/dashboardComponent/Header";
import QuickActions from '@/components/dashboardComponent/QuickAction';
import ServicesGrid from '@/components/dashboardComponent/ServicesGrid';
import React from 'react';
import { ScrollView, View, Text } from 'react-native';

const Dashboard = () => (
  <View style={{ flex: 1 }}>
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header */}
      <Header />
      <BalanceCard />
      <QuickActions />
      <EmailBanner />
      <ServicesGrid />
      <BonusSection />
    </ScrollView>
  </View>
);

export default React.memo(Dashboard);