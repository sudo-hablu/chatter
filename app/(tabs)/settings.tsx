import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Image,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { Bell, Moon, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

interface UserProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  createdAt: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { setUserToken } = useAuth();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await AsyncStorage.getItem('userProfile');
        if (profileData) {
          setUserProfile(JSON.parse(profileData));
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };
    
    loadUserProfile();
  }, []);
  
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear auth data
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userProfile');
              
              // Update auth context
              setUserToken(null);
              
              // Navigate to welcome screen
              router.replace('/auth/welcome');
            } catch (error) {
              console.error('Failed to logout:', error);
            }
          }
        }
      ]
    );
  };
  
  const renderSettingsItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => {
    return (
      <TouchableOpacity 
        style={styles.settingsItem}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.settingsItemIcon}>{icon}</View>
        <View style={styles.settingsItemContent}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
          )}
        </View>
        <View style={styles.settingsItemRight}>
          {rightElement || <ChevronRight size={20} color="#9CA3AF" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.delay(100).duration(800)}
      >
        <Text style={styles.headerTitle}>Settings</Text>
      </Animated.View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <Animated.View 
          style={styles.profileContainer}
          entering={FadeInUp.delay(200).duration(800)}
        >
          {userProfile && (
            <>
              <Image 
                source={{ uri: userProfile.avatarUrl }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile.fullName}</Text>
                <Text style={styles.profileSubtitle}>Online</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
        
        {/* Settings Sections */}
        <Animated.View
          style={styles.settingsSection}
          entering={FadeInRight.delay(300).duration(500)}
        >
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {renderSettingsItem(
            <Bell size={22} color="#3B82F6" />,
            "Notifications",
            "Receive alerts for new messages",
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={notifications ? '#3B82F6' : '#F9FAFB'}
            />
          )}
          
          {renderSettingsItem(
            <Moon size={22} color="#8B5CF6" />,
            "Dark Mode",
            "Switch to dark theme",
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E5E7EB', true: '#C4B5FD' }}
              thumbColor={darkMode ? '#8B5CF6' : '#F9FAFB'}
            />
          )}
        </Animated.View>
        
        <Animated.View
          style={styles.settingsSection}
          entering={FadeInRight.delay(400).duration(500)}
        >
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderSettingsItem(
            <Shield size={22} color="#0EA5E9" />,
            "Privacy & Security",
            "Manage your data and security settings",
            undefined,
            () => console.log('Privacy pressed')
          )}
          
          {renderSettingsItem(
            <HelpCircle size={22} color="#10B981" />,
            "Help & Support",
            "Get assistance and report issues",
            undefined,
            () => console.log('Help pressed')
          )}
        </Animated.View>
        
        <Animated.View
          style={styles.settingsSection}
          entering={FadeInRight.delay(500).duration(500)}
        >
          {renderSettingsItem(
            <LogOut size={22} color="#EF4444" />,
            "Logout",
            "Sign out from your account",
            undefined,
            handleLogout
          )}
        </Animated.View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Chatter v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
  },
  profileSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#10B981',
  },
  editButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#6B7280',
    marginHorizontal: 24,
    marginBottom: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingsItemTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
  },
  settingsItemSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  settingsItemRight: {
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
});