// app/finance/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowUpRight, ArrowDownRight, CreditCard, PieChart, 
  Wallet, Clock, ChevronRight, TrendingUp, Send, 
  Receipt, BarChart3, Sparkles, Shield, Plus 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { C } from '@/components/dashboardComponent/colors';

const { width } = Dimensions.get('window');

const Finance = () => {
  const router = useRouter();

  const accounts = [
    { id: 1, name: 'Main Account', balance: '245,800', type: 'bank', color: C.violet },
    { id: 2, name: 'Savings', balance: '150,000', type: 'savings', color: C.mint },
    { id: 3, name: 'Investment', balance: '89,500', type: 'investment', color: C.blue },
  ];

  const transactions = [
    { id: 1, type: 'Salary Deposit', amount: '+50,000', date: 'Today, 10:45 AM', category: 'income', from: 'Employer Inc.' },
    { id: 2, type: 'Electricity Bill', amount: '-15,000', date: 'Yesterday, 3:20 PM', category: 'bill', from: 'IKEDC' },
    { id: 3, type: 'Transfer to John', amount: '-25,000', date: 'Mar 12, 9:15 AM', category: 'transfer', from: 'John Doe' },
    { id: 4, type: 'Airtime Purchase', amount: '-2,500', date: 'Mar 10, 6:30 PM', category: 'bill', from: 'MTN' },
    { id: 5, type: 'Investment Return', amount: '+8,200', date: 'Mar 8, 11:00 AM', category: 'income', from: 'AmstaWealth' },
  ];

  const quickActions = [
    { id: 1, title: 'Transfer', icon: Send, route: '/send-money', color: C.violet },
    { id: 2, title: 'Pay Bill', icon: Receipt, route: '/bill-payment', color: C.blue },
    { id: 3, title: 'Invest', icon: TrendingUp, route: '/invest', color: C.mint },
    { id: 4, title: 'Loans', icon: Shield, route: '/loan', color: C.pink },
  ];

  const totalBalance = 485300;
  const totalIncome = 58200;
  const totalExpenses = 42500;

  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[C.primary, C.violet]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Financial Dashboard</Text>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>₦{totalBalance.toLocaleString()}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ArrowDownRight size={16} color={C.mint} />
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>+₦{totalIncome.toLocaleString()}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ArrowUpRight size={16} color={C.pink} />
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue}>-₦{totalExpenses.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <TouchableOpacity 
              key={action.id} 
              style={styles.quickAction}
              onPress={() => navigateTo(action.route)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[C.primaryLight, C.bg]}
                style={styles.quickActionIcon}
              >
                <Icon size={22} color={action.color} />
              </LinearGradient>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Accounts Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Accounts</Text>
          <TouchableOpacity onPress={() => navigateTo('/accounts')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {accounts.map((account) => (
          <TouchableOpacity 
            key={account.id} 
            style={styles.accountCard}
            onPress={() => navigateTo(`/account/${account.id}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.accountIcon, { backgroundColor: `${account.color}15` }]}>
              {account.type === 'bank' ? <CreditCard size={20} color={account.color} /> : 
               account.type === 'savings' ? <PieChart size={20} color={account.color} /> : 
               <Wallet size={20} color={account.color} />}
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountType}>{account.type}</Text>
            </View>
            <Text style={styles.accountBalance}>₦{account.balance.toLocaleString()}</Text>
            <ChevronRight size={18} color={C.textSub} />
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity style={styles.addAccountBtn} onPress={() => navigateTo('/add-account')}>
          <Plus size={18} color={C.violet} />
          <Text style={styles.addAccountText}>Add New Account</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigateTo('/transactions')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {transactions.slice(0, 3).map((txn) => (
          <TouchableOpacity 
            key={txn.id} 
            style={styles.transactionCard}
            onPress={() => navigateTo(`/transaction/${txn.id}`)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.transactionIcon,
              txn.category === 'income' ? styles.incomeBg : styles.expenseBg
            ]}>
              {txn.category === 'income' ? 
                <ArrowDownRight size={16} color="#fff" /> : 
                <ArrowUpRight size={16} color="#fff" />
              }
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>{txn.type}</Text>
              <Text style={styles.transactionDate}>{txn.date}</Text>
              <Text style={styles.transactionFrom}>{txn.from}</Text>
            </View>
            <Text 
              style={[
                styles.transactionAmount,
                txn.category === 'income' ? styles.positiveAmount : styles.negativeAmount
              ]}
            >
              {txn.amount.startsWith('+') ? `+₦${parseInt(txn.amount).toLocaleString()}` : `-₦${parseInt(txn.amount).toLocaleString()}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Financial Insights */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Financial Insights</Text>
          <TouchableOpacity onPress={() => navigateTo('/insights')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <LinearGradient
          colors={[C.violet, C.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.insightCard}
        >
          <View style={styles.insightIcon}>
            <BarChart3 size={24} color="#fff" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Spending Analysis</Text>
            <Text style={styles.insightText}>Your expenses increased by 12% this month</Text>
            <View style={styles.insightProgress}>
              <View style={[styles.insightProgressBar, { width: '65%' }]} />
            </View>
          </View>
          <ChevronRight size={18} color="rgba(255,255,255,0.7)" />
        </LinearGradient>

        <TouchableOpacity style={styles.insightCardSecondary} onPress={() => navigateTo('/budget')}>
          <View style={styles.insightIconSecondary}>
            <Sparkles size={20} color={C.violet} />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitleSecondary}>Budget Summary</Text>
            <Text style={styles.insightTextSecondary}>You've used 45% of your monthly budget</Text>
          </View>
          <ChevronRight size={18} color={C.textSub} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    opacity: 0.9,
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  statItem: { flex: 1, gap: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginHorizontal: 16 },
  statLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#fff' },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -24,
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: C.text,
  },
  section: {
    backgroundColor: C.bg,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.primary,
  },
  seeAll: {
    color: C.violet,
    fontWeight: '600',
    fontSize: 13,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: C.text,
    marginBottom: 4,
  },
  accountType: {
    fontSize: 12,
    color: C.textSub,
    textTransform: 'capitalize',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
    marginRight: 8,
  },
  addAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
    marginTop: 8,
  },
  addAccountText: {
    color: C.violet,
    fontWeight: '600',
    fontSize: 14,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  incomeBg: { backgroundColor: C.success },
  expenseBg: { backgroundColor: C.error },
  transactionInfo: { flex: 1 },
  transactionType: { fontSize: 15, fontWeight: '600', color: C.text, marginBottom: 2 },
  transactionDate: { fontSize: 11, color: C.textSub },
  transactionFrom: { fontSize: 11, color: C.violet, marginTop: 2 },
  transactionAmount: { fontSize: 15, fontWeight: '700' },
  positiveAmount: { color: C.success },
  negativeAmount: { color: C.error },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightContent: { flex: 1 },
  insightTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
  insightText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  insightProgress: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 8, width: '80%' },
  insightProgressBar: { height: 4, backgroundColor: C.mint, borderRadius: 2 },
  insightCardSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.primaryLight,  
    borderRadius: 16,
    padding: 16,
  },
  insightIconSecondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightTitleSecondary: { fontSize: 15, fontWeight: '600', color: C.text, marginBottom: 4 },
  insightTextSecondary: { fontSize: 12, color: C.textSub },
});

export default Finance;