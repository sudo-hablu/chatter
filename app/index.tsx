import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { setIsLoading, setUserToken } = useAuth();

  useEffect(() => {
    // Check for existing token and navigate accordingly
    const checkLoginState = async () => {
      try {
        setIsLoading(true);
        const userToken = await AsyncStorage.getItem('userToken');
        const userProfile = await AsyncStorage.getItem('userProfile');
        
        setUserToken(userToken);
        
        // We'll artificially delay to show loading state
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to load auth state:', error);
        setIsLoading(false);
      }
    };
    
    checkLoginState();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Redirect href="/auth/welcome" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});