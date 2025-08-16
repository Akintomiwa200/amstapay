import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Linking
} from 'react-native';
import {
  ArrowLeft,
  Search,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Book,
  Shield,
  CreditCard,
  Smartphone,
  Users,
  Clock,
  CheckCircle,
  ExternalLink,
  Headphones,
  Globe,
  AlertTriangle
} from 'lucide-react-native';

// Types
interface Article {
  title: string;
  views: string;
  helpful: number;
}

interface HelpCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  description: string;
  articles: Article[];
}

interface ContactOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  availability: string;
  action: () => void;
}

interface NavigationProp {
  goBack: () => void;
}

interface HelpScreenProps {
  navigation?: NavigationProp;
}

// Sample data
const helpCategories: HelpCategory[] = [
  {
    id: '1',
    title: 'Getting Started',
    icon: Book,
    color: '#16A34A',
    description: 'Learn the basics of using AmstaPay',
    articles: [
      { title: 'How to create an account', views: '2.5k', helpful: 95 },
      { title: 'Setting up your wallet', views: '1.8k', helpful: 92 },
      { title: 'Verifying your identity', views: '3.2k', helpful: 88 },
      { title: 'First time deposit guide', views: '2.1k', helpful: 90 }
    ]
  },
  {
    id: '2',
    title: 'Payments & Transfers',
    icon: CreditCard,
    color: '#0EA5E9',
    description: 'Everything about sending and receiving money',
    articles: [
      { title: 'How to send money', views: '4.5k', helpful: 94 },
      { title: 'QR code payments', views: '3.8k', helpful: 91 },
      { title: 'Bank transfer limits', views: '2.7k', helpful: 87 },
      { title: 'Transaction fees explained', views: '5.2k', helpful: 89 }
    ]
  },
  {
    id: '3',
    title: 'Bills & Airtime',
    icon: Smartphone,
    color: '#D97706',
    description: 'Pay bills and buy airtime/data',
    articles: [
      { title: 'Buying airtime and data', views: '6.1k', helpful: 96 },
      { title: 'Paying electricity bills', views: '3.9k', helpful: 93 },
      { title: 'TV subscription payments', views: '2.3k', helpful: 90 },
      { title: 'Setting up auto-pay', views: '1.7k', helpful: 85 }
    ]
  },
  {
    id: '4',
    title: 'Security & Safety',
    icon: Shield,
    color: '#DC2626',
    description: 'Keep your account safe and secure',
    articles: [
      { title: 'Two-factor authentication', views: '4.2k', helpful: 97 },
      { title: 'Reporting suspicious activity', views: '2.8k', helpful: 94 },
      { title: 'Password security tips', views: '3.5k', helpful: 89 },
      { title: 'Account recovery process', views: '2.1k', helpful: 92 }
    ]
  },
  {
    id: '5',
    title: 'Account Management',
    icon: Users,
    color: '#7C3AED',
    description: 'Manage your profile and settings',
    articles: [
      { title: 'Updating profile information', views: '3.6k', helpful: 91 },
      { title: 'Changing your PIN', views: '2.9k', helpful: 88 },
      { title: 'Notification settings', views: '1.8k', helpful: 86 },
      { title: 'Closing your account', views: '1.2k', helpful: 84 }
    ]
  }
];

const HelpScreen: React.FC<HelpScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Contact options with proper action handlers
  const contactOptions: ContactOption[] = [
    {
      id: '1',
      title: 'Live Chat',
      subtitle: 'Get instant help from our support team',
      icon: MessageCircle,
      color: '#16A34A',
      availability: 'Available 24/7',
      action: handleLiveChat
    },
    {
      id: '2',
      title: 'Call Support',
      subtitle: 'Speak directly with a support agent',
      icon: Phone,
      color: '#0EA5E9',
      availability: 'Mon-Fri, 9AM-6PM',
      action: handleCallSupport
    },
    {
      id: '3',
      title: 'Email Support',
      subtitle: 'Send us a detailed message',
      icon: Mail,
      color: '#D97706',
      availability: 'Response in 2-4 hours',
      action: handleEmailSupport
    },
    {
      id: '4',
      title: 'WhatsApp',
      subtitle: 'Chat with us on WhatsApp',
      icon: MessageCircle,
      color: '#16A34A',
      availability: 'Available 24/7',
      action: handleWhatsAppSupport
    }
  ];

  // Event handlers
  function handleLiveChat(): void {
    Alert.alert('Live Chat', 'Opening chat support...');
  }

  function handleCallSupport(): void {
    Linking.openURL('tel:+2341234567890').catch(err => 
      console.error('Error opening phone app:', err)
    );
  }

  function handleEmailSupport(): void {
    Linking.openURL('mailto:support@amstapay.com').catch(err => 
      console.error('Error opening email app:', err)
    );
  }

  function handleWhatsAppSupport(): void {
    Linking.openURL('whatsapp://send?phone=2341234567890').catch(err => 
      console.error('Error opening WhatsApp:', err)
    );
  }

  const handleBackPress = (): void => {
    navigation?.goBack();
  };

  const handleSystemStatus = (): void => {
    Alert.alert('System Status', 'All systems operational');
  };

  const handleCommunity = (): void => {
    Alert.alert('Community', 'Opening community forum...');
  };

  const handleBlog = (): void => {
    Alert.alert('Blog', 'Opening AmstaPay blog...');
  };

  const handleReportIssue = (): void => {
    Alert.alert('Report Issue', 'Opening issue report form...');
  };

  const handleArticlePress = (articleTitle: string): void => {
    Alert.alert('Article', `Opening: ${articleTitle}`);
  };

  const toggleCategory = (categoryId: string): void => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const renderCategory = (category: HelpCategory) => {
    const Icon = category.icon;
    const isExpanded = expandedCategory === category.id;

    return (
      <View key={category.id} style={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.categoryHeader}
          onPress={() => toggleCategory(category.id)}
          activeOpacity={0.7}
        >
          <View style={styles.categoryLeft}>
            <View style={[
              styles.categoryIconContainer,
              { backgroundColor: `${category.color}15` }
            ]}>
              <Icon size={24} color={category.color} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <Text style={styles.articleCount}>
                {category.articles.length} articles
              </Text>
            </View>
          </View>
          <View style={styles.categoryRight}>
            {isExpanded ? 
              <ChevronUp size={20} color="#666666" /> :
              <ChevronDown size={20} color="#666666" />
            }
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.articlesList}>
            {category.articles.map((article, index) => (
              <TouchableOpacity
                key={index}
                style={styles.articleItem}
                onPress={() => handleArticlePress(article.title)}
                activeOpacity={0.7}
              >
                <View style={styles.articleLeft}>
                  <HelpCircle size={16} color="#666666" />
                  <Text style={styles.articleTitle}>{article.title}</Text>
                </View>
                <View style={styles.articleRight}>
                  <Text style={styles.articleViews}>{article.views} views</Text>
                  <View style={styles.helpfulBadge}>
                    <Text style={styles.helpfulText}>{article.helpful}% helpful</Text>
                  </View>
                  <ChevronRight size={14} color="#666666" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderContactOption = (option: ContactOption) => {
    const Icon = option.icon;

    return (
      <TouchableOpacity
        key={option.id}
        style={styles.contactCard}
        onPress={option.action}
        activeOpacity={0.7}
      >
        <View style={styles.contactContent}>
          <View style={[
            styles.contactIconContainer,
            { backgroundColor: `${option.color}15` }
          ]}>
            <Icon size={24} color={option.color} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>{option.title}</Text>
            <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
            <View style={styles.availabilityContainer}>
              <Clock size={12} color="#16A34A" />
              <Text style={styles.availabilityText}>{option.availability}</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666666" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.helpIconContainer}>
            <Headphones size={40} color="#FFD700" />
          </View>
          <Text style={styles.welcomeTitle}>How can we help you?</Text>
          <Text style={styles.welcomeDescription}>
            Find answers to common questions or get in touch with our support team
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search help articles..."
              placeholderTextColor="#666666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Need immediate help?</Text>
          <View style={styles.quickActionsGrid}>
            {contactOptions.slice(0, 2).map(renderContactOption)}
          </View>
        </View>

        {/* Help Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          {filteredCategories.map(renderCategory)}
        </View>

        {/* All Contact Options */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <Text style={styles.sectionSubtitle}>
            Can't find what you're looking for? Our support team is here to help
          </Text>
          {contactOptions.map(renderContactOption)}
        </View>

        {/* Additional Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={handleSystemStatus}
          >
            <CheckCircle size={20} color="#16A34A" />
            <Text style={styles.resourceText}>System Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Operational</Text>
            </View>
            <ExternalLink size={16} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={handleCommunity}
          >
            <Users size={20} color="#0EA5E9" />
            <Text style={styles.resourceText}>Community Forum</Text>
            <ExternalLink size={16} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={handleBlog}
          >
            <Globe size={20} color="#D97706" />
            <Text style={styles.resourceText}>AmstaPay Blog</Text>
            <ExternalLink size={16} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={handleReportIssue}
          >
            <AlertTriangle size={20} color="#DC2626" />
            <Text style={styles.resourceText}>Report a Problem</Text>
            <ExternalLink size={16} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 Tip: Most questions can be answered in our FAQ sections above
          </Text>
          <Text style={styles.footerSubtext}>
            AmstaPay Help Center • Last updated: Today
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpScreen;

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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
  },
  helpIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000000',
  },
  quickActionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  quickActionsGrid: {
    gap: 12,
  },
  categoriesSection: {
    padding: 16,
  },
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  categoryLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  articleCount: {
    fontSize: 12,
    color: '#888888',
  },
  categoryRight: {
    marginLeft: 12,
  },
  articlesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  articleLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleTitle: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    flex: 1,
  },
  articleRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleViews: {
    fontSize: 12,
    color: '#888888',
    marginRight: 8,
  },
  helpfulBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  helpfulText: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: '500',
  },
  contactSection: {
    padding: 16,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 12,
    color: '#16A34A',
    marginLeft: 4,
    fontWeight: '500',
  },
  resourcesSection: {
    padding: 16,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resourceText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '500',
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
});