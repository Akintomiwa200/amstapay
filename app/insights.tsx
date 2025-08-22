import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { PieChart, BarChart, LineChart, TrendingUp, TrendingDown, Calendar, Download, Filter, ArrowUpRight, Target, PiggyBank, AlertCircle, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const Insights = () => {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const screenWidth = Dimensions.get('window').width;

  // Mock data for different time periods
  const periodData = {
    month: {
      spendingData: [
        { category: 'Food & Dining', amount: 45000, percentage: 35, color: '#F97316', budget: 40000, trend: 'up' },
        { category: 'Transportation', amount: 25000, percentage: 20, color: '#8B5CF6', budget: 30000, trend: 'down' },
        { category: 'Entertainment', amount: 20000, percentage: 15, color: '#EC4899', budget: 15000, trend: 'up' },
        { category: 'Utilities', amount: 15000, percentage: 12, color: '#10B981', budget: 18000, trend: 'down' },
        { category: 'Shopping', amount: 10000, percentage: 8, color: '#3B82F6', budget: 12000, trend: 'down' },
        { category: 'Others', amount: 10000, percentage: 10, color: '#6B7280', budget: 8000, trend: 'up' },
      ],
      income: 175000,
      expenses: 125000,
      savings: 50000,
      netWorthChange: '+15%',
      cashFlow: 'positive'
    },
    week: {
      spendingData: [
        { category: 'Food & Dining', amount: 12000, percentage: 40, color: '#F97316', budget: 10000, trend: 'up' },
        { category: 'Transportation', amount: 6000, percentage: 20, color: '#8B5CF6', budget: 7500, trend: 'down' },
        { category: 'Entertainment', amount: 5000, percentage: 17, color: '#EC4899', budget: 4000, trend: 'up' },
        { category: 'Utilities', amount: 4000, percentage: 13, color: '#10B981', budget: 4500, trend: 'down' },
        { category: 'Others', amount: 3000, percentage: 10, color: '#6B7280', budget: 2500, trend: 'up' },
      ],
      income: 45000,
      expenses: 30000,
      savings: 15000,
      netWorthChange: '+8%',
      cashFlow: 'positive'
    },
    year: {
      spendingData: [
        { category: 'Food & Dining', amount: 480000, percentage: 30, color: '#F97316', budget: 450000, trend: 'up' },
        { category: 'Transportation', amount: 280000, percentage: 18, color: '#8B5CF6', budget: 300000, trend: 'down' },
        { category: 'Entertainment', amount: 240000, percentage: 15, color: '#EC4899', budget: 200000, trend: 'up' },
        { category: 'Utilities', amount: 180000, percentage: 11, color: '#10B981', budget: 200000, trend: 'down' },
        { category: 'Shopping', amount: 160000, percentage: 10, color: '#3B82F6', budget: 180000, trend: 'down' },
        { category: 'Healthcare', amount: 120000, percentage: 8, color: '#EF4444', budget: 100000, trend: 'up' },
        { category: 'Others', amount: 140000, percentage: 8, color: '#6B7280', budget: 120000, trend: 'up' },
      ],
      income: 2100000,
      expenses: 1600000,
      savings: 500000,
      netWorthChange: '+22%',
      cashFlow: 'positive'
    }
  };

  const currentData = periodData[selectedPeriod as keyof typeof periodData];

  const financialStats = [
    { 
      title: 'Total Income', 
      value: `₦${currentData.income.toLocaleString()}`, 
      change: '+12%', 
      trend: 'up',
      icon: <TrendingUp size={20} color="#10B981" />
    },
    { 
      title: 'Total Expenses', 
      value: `₦${currentData.expenses.toLocaleString()}`, 
      change: '+8%', 
      trend: 'up',
      icon: <TrendingUp size={20} color="#EF4444" />
    },
    { 
      title: 'Net Savings', 
      value: `₦${currentData.savings.toLocaleString()}`, 
      change: '+15%', 
      trend: 'up',
      icon: <TrendingUp size={20} color="#10B981" />
    },
    { 
      title: 'Savings Rate', 
      value: `${Math.round((currentData.savings / currentData.income) * 100)}%`, 
      change: '+3%', 
      trend: 'up',
      icon: <PiggyBank size={20} color="#10B981" />
    },
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'overbudget', label: 'Over Budget' },
    { id: 'dining', label: 'Dining' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'entertainment', label: 'Entertainment' },
  ];

  const timePeriods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Reduce Dining Out',
      description: 'You\'ve spent ₦45,000 on dining this month, which is 12% over your budget. Consider cooking at home more often.',
      icon: <TrendingDown size={24} color="#10B981" />,
      priority: 'high',
      savingsPotential: '₦5,000 monthly'
    },
    {
      id: 2,
      title: 'Increase Savings Rate',
      description: 'You\'re saving 28% of your income. Try to reach 35% by automating transfers to savings.',
      icon: <PiggyBank size={24} color="#10B981" />,
      priority: 'medium',
      savingsPotential: '₦12,250 monthly'
    },
    {
      id: 3,
      title: 'Review Subscriptions',
      description: 'You have 5 active subscriptions totaling ₦8,500 monthly. Consider canceling unused services.',
      icon: <AlertCircle size={24} color="#F97316" />,
      priority: 'medium',
      savingsPotential: '₦3,400 monthly'
    },
    {
      id: 4,
      title: 'Energy Efficiency',
      description: 'Your utilities are 17% below budget. Maintain this efficiency to continue saving.',
      icon: <TrendingUp size={24} color="#10B981" />,
      priority: 'low',
      savingsPotential: '₦2,550 monthly'
    },
  ];

  const spendingTrends = [
    { month: 'Jan', amount: 110000 },
    { month: 'Feb', amount: 95000 },
    { month: 'Mar', amount: 125000 },
    { month: 'Apr', amount: 105000 },
    { month: 'May', amount: 115000 },
    { month: 'Jun', amount: 98000 },
  ];

  const renderProgressBar = (spent: number, budget: number) => {
    const percentage = Math.min((spent / budget) * 100, 100);
    const isOverBudget = spent > budget;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${percentage}%`,
                backgroundColor: isOverBudget ? '#EF4444' : '#10B981'
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {isOverBudget ? `+₦${(spent - budget).toLocaleString()} over` : `₦${(budget - spent).toLocaleString()} left`}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Financial Insights</Text>
          <Text style={styles.headerSubtitle}>Track, analyze, and optimize your finances</Text>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
          <Download size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Time Period Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.periodSelector}
        >
          {timePeriods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodPill,
                selectedPeriod === period.id && styles.periodPillActive
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period.id && styles.periodTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Financial Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Overview</Text>
          <View style={styles.statsGrid}>
            {financialStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  {stat.icon}
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <View style={styles.statChange}>
                  {stat.trend === 'up' ? 
                    <TrendingUp size={14} color="#10B981" /> : 
                    <TrendingDown size={14} color="#EF4444" />}
                  <Text style={[
                    styles.changeText,
                    stat.trend === 'up' ? styles.positiveChange : styles.negativeChange
                  ]}>
                    {stat.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Spending Trends Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Trends</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>View Report</Text>
              <ArrowUpRight size={16} color="#F97316" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartContainer}>
            <View style={styles.chartPlaceholder}>
              <LineChart size={32} color="#F97316" />
              <Text style={styles.chartTitle}>Monthly Spending Trend</Text>
              <Text style={styles.chartSubtitle}>6-month overview</Text>
            </View>
            
            <View style={styles.trendStats}>
              <View style={styles.trendStat}>
                <Text style={styles.trendLabel}>Average Monthly Spend</Text>
                <Text style={styles.trendValue}>₦104,667</Text>
              </View>
              <View style={styles.trendStat}>
                <Text style={styles.trendLabel}>Highest Month</Text>
                <Text style={styles.trendValue}>₦125,000 (Mar)</Text>
              </View>
              <View style={styles.trendStat}>
                <Text style={styles.trendLabel}>Lowest Month</Text>
                <Text style={styles.trendValue}>₦95,000 (Feb)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterPill,
                selectedCategory === category.id && styles.filterPillActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.filterText,
                selectedCategory === category.id && styles.filterTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Spending by Category */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>
            <TouchableOpacity style={styles.dateFilter}>
              <Calendar size={16} color="#F97316" />
              <Text style={styles.dateFilterText}>Mar 2024</Text>
              <ChevronDown size={16} color="#F97316" />
            </TouchableOpacity>
          </View>

          <View style={styles.categoryList}>
            {currentData.spendingData.map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View 
                    style={[styles.categoryColor, { backgroundColor: item.color }]} 
                  />
                  <View>
                    <Text style={styles.categoryName}>{item.category}</Text>
                    <Text style={styles.categoryPercentage}>{item.percentage}% of total</Text>
                  </View>
                </View>
                
                <View style={styles.categoryAmounts}>
                  <Text style={styles.categorySpent}>₦{item.amount.toLocaleString()}</Text>
                  <Text style={styles.categoryBudget}>/ ₦{item.budget.toLocaleString()}</Text>
                </View>
                
                {renderProgressBar(item.amount, item.budget)}
              </View>
            ))}
          </View>
        </View>

        {/* Budget Recommendations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Smart Recommendations</Text>
            <TouchableOpacity>
              <Filter size={20} color="#F97316" />
            </TouchableOpacity>
          </View>
          
          {recommendations.map((recommendation) => (
            <View 
              key={recommendation.id} 
              style={[
                styles.recommendationCard,
                recommendation.priority === 'high' && styles.highPriorityCard
              ]}
            >
              <View style={styles.recommendationIcon}>
                {recommendation.icon}
              </View>
              <View style={styles.recommendationContent}>
                <View style={styles.recommendationHeader}>
                  <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                  {recommendation.priority === 'high' && (
                    <View style={styles.priorityBadge}>
                      <Text style={styles.priorityText}>High Impact</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.recommendationText}>{recommendation.description}</Text>
                <View style={styles.savingsPotential}>
                  <Target size={14} color="#10B981" />
                  <Text style={styles.savingsText}>
                    Potential savings: {recommendation.savingsPotential}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Net Worth Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Net Worth Progress</Text>
          <View style={styles.netWorthCard}>
            <View style={styles.netWorthHeader}>
              <Text style={styles.netWorthLabel}>Current Net Worth</Text>
              <Text style={[
                styles.netWorthChange,
                currentData.cashFlow === 'positive' ? styles.positiveChange : styles.negativeChange
              ]}>
                {currentData.netWorthChange}
              </Text>
            </View>
            <Text style={styles.netWorthValue}>₦2,450,000</Text>
            <View style={styles.netWorthProgress}>
              <View style={styles.progressBackground}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: '65%',
                      backgroundColor: '#10B981'
                    }
                  ]} 
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>₦0</Text>
                <Text style={styles.progressLabel}>Goal: ₦3,750,000</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#F97316',
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  downloadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  content: {
    padding: 16,
  },
  periodSelector: {
    marginBottom: 16,
  },
  periodPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  periodPillActive: {
    backgroundColor: '#F97316',
  },
  periodText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#F97316',
    fontWeight: '500',
    marginRight: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  positiveChange: {
    color: '#10B981',
  },
  negativeChange: {
    color: '#EF4444',
  },
  chartContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendStat: {
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#F97316',
  },
  filterText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  dateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
  },
  dateFilterText: {
    marginHorizontal: 4,
    color: '#F97316',
    fontWeight: '500',
  },
  categoryList: {
    marginTop: 8,
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryAmounts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categorySpent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  categoryBudget: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: '#6B7280',
    minWidth: 80,
    textAlign: 'right',
  },
  recommendationCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },
  highPriorityCard: {
    borderLeftColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  recommendationIcon: {
    backgroundColor: '#ECFDF5',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  priorityBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  recommendationText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 16,
  },
  savingsPotential: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '500',
    marginLeft: 4,
  },
  netWorthCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  netWorthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  netWorthLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  netWorthChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  netWorthValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  netWorthProgress: {
    marginBottom: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
});

export default Insights;