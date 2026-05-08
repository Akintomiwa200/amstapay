import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
  ListRenderItem
} from 'react-native';
import {
  ArrowLeft,
  Bell,
  BellOff,
  CheckCircle,
  DollarSign,
  Settings,
  Trash2,
  AlertCircle,
  Gift,
  CreditCard,
  Building2
} from 'lucide-react-native';

// Types
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'transaction' | 'credit' | 'security' | 'reward' | 'feature' | 'alert' | 'statement';
  timestamp: string;
  read: boolean;
  priority: 'normal' | 'low' | 'medium' | 'high';
  actionRequired: boolean;
  amount?: string;
}

interface NavigationProp {
  goBack: () => void;
}

interface NotificationScreenProps {
  navigation?: NavigationProp;
}

type FilterType = 'all' | 'unread' | 'action' | 'transaction' | 'credit' | 'security' | 'reward' | 'feature' | 'alert' | 'statement';

// Sample data
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Transaction Successful',
    message: 'Your airtime purchase of ₦500 was successful',
    type: 'transaction',
    timestamp: '2025-08-16T10:30:00Z',
    read: false,
    priority: 'normal',
    actionRequired: false,
    amount: '₦500'
  },
  {
    id: '2',
    title: 'Account Credited',
    message: 'Your wallet has been credited with ₦5,000 from bank transfer',
    type: 'credit',
    timestamp: '2025-08-16T09:15:00Z',
    read: false,
    priority: 'high',
    actionRequired: false,
    amount: '₦5,000'
  },
  {
    id: '3',
    title: 'Verify Your Email',
    message: 'Please verify your email address to secure your account',
    type: 'security',
    timestamp: '2025-08-15T16:45:00Z',
    read: true,
    priority: 'high',
    actionRequired: true
  },
  {
    id: '4',
    title: 'Cashback Earned',
    message: 'You earned ₦25 cashback on your recent transaction',
    type: 'reward',
    timestamp: '2025-08-15T14:20:00Z',
    read: false,
    priority: 'normal',
    actionRequired: false,
    amount: '₦25'
  },
  {
    id: '5',
    title: 'New Feature Available',
    message: 'Check out our new QR payment feature for faster transactions',
    type: 'feature',
    timestamp: '2025-08-14T11:30:00Z',
    read: true,
    priority: 'low',
    actionRequired: false
  },
  {
    id: '6',
    title: 'Low Balance Alert',
    message: 'Your wallet balance is low. Add money to continue using services',
    type: 'alert',
    timestamp: '2025-08-14T08:45:00Z',
    read: false,
    priority: 'medium',
    actionRequired: true
  },
  {
    id: '7',
    title: 'Monthly Statement',
    message: 'Your August statement is ready for download',
    type: 'statement',
    timestamp: '2025-08-13T12:00:00Z',
    read: true,
    priority: 'normal',
    actionRequired: false
  }
];

const NotificationScreen: React.FC<NotificationScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'transaction':
        return CreditCard;
      case 'credit':
        return DollarSign;
      case 'security':
        return AlertCircle;
      case 'reward':
        return Gift;
      case 'feature':
        return Bell;
      case 'alert':
        return AlertCircle;
      case 'statement':
        return Building2;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']): string => {
    if (priority === 'high') return '#DC2626';
    if (priority === 'medium') return '#D97706';
    
    switch (type) {
      case 'credit':
      case 'reward':
        return '#16A34A';
      case 'security':
      case 'alert':
        return '#DC2626';
      case 'transaction':
        return '#0EA5E9';
      default:
        return '#6B7280';
    }
  };

  const formatTime = (timestamp: string): string => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return notificationTime.toLocaleDateString();
  };

  const markAsRead = (id: string): void => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const deleteNotification = (id: string): void => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(prevNotifications =>
              prevNotifications.filter(notification => notification.id !== id)
            );
          }
        }
      ]
    );
  };

  const markAllAsRead = (): void => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAllNotifications = (): void => {
    Alert.alert(
      'Clear All Notifications',
      'This will delete all notifications. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setNotifications([])
        }
      ]
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    if (selectedFilter === 'action') return notification.actionRequired;
    return notification.type === selectedFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotification: ListRenderItem<Notification> = ({ item }) => {
    const Icon = getNotificationIcon(item.type);
    const iconColor = getNotificationColor(item.type, item.priority);

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.read && styles.unreadCard
        ]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationLeft}>
            <View style={[
              styles.iconContainer,
              { backgroundColor: `${iconColor}15` }
            ]}>
              <Icon size={20} color={iconColor} />
              {!item.read && <View style={styles.unreadDot} />}
            </View>

            <View style={styles.notificationDetails}>
              <View style={styles.notificationHeader}>
                <Text style={[
                  styles.notificationTitle,
                  !item.read && styles.unreadTitle
                ]}>
                  {item.title}
                </Text>
                {item.priority === 'high' && (
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>!</Text>
                  </View>
                )}
              </View>

              <Text style={styles.notificationMessage} numberOfLines={2}>
                {item.message}
              </Text>

              <View style={styles.notificationFooter}>
                <Text style={styles.notificationTime}>
                  {formatTime(item.timestamp)}
                </Text>
                {item.amount && (
                  <Text style={[
                    styles.notificationAmount,
                    { color: iconColor }
                  ]}>
                    {item.amount}
                  </Text>
                )}
                {item.actionRequired && (
                  <View style={styles.actionBadge}>
                    <Text style={styles.actionText}>Action Required</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNotification(item.id)}
          >
            <Trash2 size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  interface FilterButtonProps {
    filter: FilterType;
    label: string;
    count?: number;
  }

  const FilterButton: React.FC<FilterButtonProps> = ({ filter, label, count }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
        {count !== undefined && ` (${count})`}
      </Text>
    </TouchableOpacity>
  );

  const handleSettingsPress = (): void => {
    Alert.alert('Notification Settings', 'Configure your notification preferences');
  };

  const toggleNotifications = (): void => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleBackPress = (): void => {
    navigation?.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Settings size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCircle size={16} color={unreadCount > 0 ? "#16A34A" : "#D1D5DB"} />
          <Text style={[
            styles.quickActionText,
            { color: unreadCount > 0 ? "#16A34A" : "#D1D5DB" }
          ]}>
            Mark All Read
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={clearAllNotifications}
          disabled={notifications.length === 0}
        >
          <Trash2 size={16} color={notifications.length > 0 ? "#DC2626" : "#D1D5DB"} />
          <Text style={[
            styles.quickActionText,
            { color: notifications.length > 0 ? "#DC2626" : "#D1D5DB" }
          ]}>
            Clear All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={toggleNotifications}
        >
          {notificationsEnabled ? 
            <Bell size={16} color="#FFD700" /> : 
            <BellOff size={16} color="#6B7280" />
          }
          <Text style={[
            styles.quickActionText,
            { color: notificationsEnabled ? "#FFD700" : "#6B7280" }
          ]}>
            {notificationsEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <FilterButton filter="all" label="All" />
        <FilterButton filter="unread" label="Unread" count={unreadCount} />
        <FilterButton filter="action" label="Action" />
        <FilterButton filter="transaction" label="Transactions" />
      </View>

      {/* Notifications List */}
      <View style={styles.listContainer}>
        {filteredNotifications.length > 0 ? (
          <FlatList
            data={filteredNotifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Bell size={48} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyStateTitle}>
              {selectedFilter === 'all' ? 'No Notifications' : `No ${selectedFilter} notifications`}
            </Text>
            <Text style={styles.emptyStateText}>
              {selectedFilter === 'all' 
                ? "You're all caught up! New notifications will appear here."
                : 'Try switching to a different filter to see more notifications.'
              }
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  headerBadge: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFD700',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  quickActionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#000000',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFD700',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 16,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    backgroundColor: '#FFFBF0',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  notificationDetails: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '600',
    color: '#000000',
  },
  priorityBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 12,
  },
  notificationAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  actionBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  actionText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});