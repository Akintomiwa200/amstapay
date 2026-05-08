// app/accounts/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Plus, CreditCard, PieChart, Wallet, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const AccountsScreen = () => {
  const router = useRouter();
  const [showBalances, setShowBalances] = React.useState(true);
  const { theme } = useTheme();
  const c = theme.colors;

  const accounts = [
    { id: 1, name: 'Main Account', balance: '245,800', type: 'bank', color: c.violet, number: '****1234' },
    { id: 2, name: 'Savings', balance: '150,000', type: 'savings', color: c.mint, number: '****5678' },
    { id: 3, name: 'Investment', balance: '89,500', type: 'investment', color: c.blue, number: '****9012' },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + parseInt(acc.balance), 0);

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <LinearGradient colors={[c.primary, c.violet]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Accounts</Text>
          <TouchableOpacity onPress={() => setShowBalances(!showBalances)}>
            {showBalances ? <EyeOff size={20} color="#fff" /> : <Eye size={20} color="#fff" />}
          </TouchableOpacity>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Balance</Text>
          <Text style={styles.totalAmount}>
            {showBalances ? `₦${totalBalance.toLocaleString()}` : '•••••••'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {accounts.map((account) => (
          <TouchableOpacity key={account.id} style={[styles.accountCard, { backgroundColor: c.bg, borderColor: c.border, shadowColor: c.primary }]}>
            <View style={[styles.accountIcon, { backgroundColor: `${account.color}15` }]}>
              {account.type === 'bank' ? <CreditCard size={24} color={account.color} /> : 
               account.type === 'savings' ? <PieChart size={24} color={account.color} /> : 
               <Wallet size={24} color={account.color} />}
            </View>
            <View style={styles.accountDetails}>
              <Text style={[styles.accountName, { color: c.text }]}>{account.name}</Text>
              <Text style={[styles.accountNumber, { color: c.textSub }]}>{account.number}</Text>
              <View style={styles.accountActions}>
                <TouchableOpacity>
                  <Text style={[styles.actionText, { color: c.violet }]}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={[styles.actionText, { color: c.violet }]}>Receive</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.accountBalance, { color: c.text }]}>
              {showBalances ? `₦${parseInt(account.balance).toLocaleString()}` : '•••••••'}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-account')}>
          <Plus size={20} color={c.violet} />
          <Text style={[styles.addButtonText, { color: c.violet }]}>Add New Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  totalContainer: { alignItems: 'center' },
  totalLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  totalAmount: { fontSize: 36, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  accountCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  accountIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  accountDetails: { flex: 1 },
  accountName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  accountNumber: { fontSize: 12, marginBottom: 8 },
  accountActions: { flexDirection: 'row', gap: 16 },
  actionText: { fontSize: 12, fontWeight: '600' },
  accountBalance: { fontSize: 18, fontWeight: '700' },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, marginTop: 8, marginBottom: 32 },
  addButtonText: { fontSize: 16, fontWeight: '600' },
});

export default AccountsScreen;
