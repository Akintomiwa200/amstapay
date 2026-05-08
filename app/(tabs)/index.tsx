import { BalanceCard, BonusSection, Header, QuickActions, ServicesGrid } from '@/components/dashboard';
import React from 'react';
import { ScrollView, View } from 'react-native';

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
      {/* <EmailBanner /> */}
      <ServicesGrid />
      <BonusSection />
    </ScrollView>
  </View>
);

export default React.memo(Dashboard);