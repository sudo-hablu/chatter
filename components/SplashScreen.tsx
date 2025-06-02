import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { MessageCircle } from 'lucide-react-native';

export const SplashScreen = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 700, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1, { duration: 700, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1, // Infinite repeats
      false
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <MessageCircle size={60} color="#3B82F6" />
      </Animated.View>
      <Text style={styles.title}>Chatter</Text>
      <Text style={styles.subtitle}>Connect with everyone</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 32,
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: 16,
    color: '#6B7280',
  },
});