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
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { Bell, Moon, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Camera } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface UserProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  createdAt: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { setUserToken } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState('');
  
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await AsyncStorage.getItem('userProfile');
        if (profileData) {
          const profile = JSON.parse(profileData);
          setUserProfile(profile);
          setEditedName(profile.fullName);
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
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userProfile');
              setUserToken(null);
              router.replace('/auth/welcome');
            } catch (error) {
              console.error('Failed to logout:', error);
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = async () => {
    if (editedName.trim().length < 2) {
      Alert.alert('Invalid Name', 'Please enter a valid name with at least 2 characters.');
      return;
    }

    try {
      const updatedProfile = {
        ...userProfile,
        fullName: editedName.trim()
      };
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
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
        style={[styles.settingsItem, { backgroundColor: theme.colors.card }]}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={[styles.settingsItemIcon, { backgroundColor: theme.colors.background }]}>
          {icon}
        </View>
        <View style={styles.settingsItemContent}>
          <Text style={[styles.settingsItemTitle, { color: theme.colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingsItemSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.settingsItemRight}>
          {rightElement || <ChevronRight size={20} color={theme.colors.textSecondary} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <Animated.View 
        style={[styles.header, { backgroundColor: theme.colors.background }]}
        entering={FadeInUp.delay(100).duration(800)}
      >
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
      </Animated.View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[styles.profileContainer, { backgroundColor: theme.colors.card }]}
          entering={FadeInUp.delay(200).duration(800)}
        >
          {userProfile && (
            <>
              <Image 
                source={{ uri: userProfile.avatarUrl }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.colors.text }]}>
                  {userProfile.fullName}
                </Text>
                <Text style={[styles.profileSubtitle, { color: theme.colors.success }]}>
                  Online
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setIsEditModalVisible(true)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
        
        <Animated.View
          style={styles.settingsSection}
          entering={FadeInRight.delay(300).duration(500)}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Preferences
          </Text>
          
          {renderSettingsItem(
            <Bell size={22} color={theme.colors.primary} />,
            "Notifications",
            "Receive alerts for new messages",
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={notifications ? theme.colors.primaryText : theme.colors.text}
            />
          )}
          
          {renderSettingsItem(
            <Moon size={22} color={theme.colors.primary} />,
            "Dark Mode",
            "Switch to dark theme",
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={isDark ? theme.colors.primaryText : theme.colors.text}
            />
          )}
        </Animated.View>
        
        <Animated.View
          style={styles.settingsSection}
          entering={FadeInRight.delay(400).duration(500)}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Support
          </Text>
          
          {renderSettingsItem(
            <Shield size={22} color={theme.colors.primary} />,
            "Privacy & Security",
            "Manage your data and security settings",
            undefined,
            () => console.log('Privacy pressed')
          )}
          
          {renderSettingsItem(
            <HelpCircle size={22} color={theme.colors.primary} />,
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
            <LogOut size={22} color={theme.colors.error} />,
            "Logout",
            "Sign out from your account",
            undefined,
            handleLogout
          )}
        </Animated.View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Chatter v1.0.0
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Edit Profile
            </Text>
            
            <TouchableOpacity style={styles.avatarContainer}>
              <Image 
                source={{ uri: userProfile?.avatarUrl }}
                style={styles.modalAvatar}
              />
              <View style={styles.cameraButton}>
                <Camera size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.textSecondary}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.colors.border }]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleEditProfile}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
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
  },
  profileSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  editButton: {
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
  },
  settingsItemSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 24,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  modalButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});