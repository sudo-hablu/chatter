import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Phone, CirclePlus as PlusCircle } from 'lucide-react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { generateMockCalls } from '@/utils/mockData';
import { Call } from '@/types';
import { CallListItem } from '@/components/CallListItem';

export default function CallsScreen() {
  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    // Generate mock call data
    setCalls(generateMockCalls(12));
  }, []);

  const handleNewCall = () => {
    // In a real app, this would open the contacts list or dial pad
    console.log("New call initiated");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.delay(100).duration(800)}
      >
        <Text style={styles.headerTitle}>Calls</Text>
        <TouchableOpacity style={styles.newCallButton} onPress={handleNewCall}>
          <PlusCircle size={24} color="#0EA5E9" />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Call List */}
      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(200 + index * 50).duration(500)}>
            <CallListItem call={item} />
          </Animated.View>
        )}
        contentContainerStyle={styles.callsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Phone size={32} color="#0EA5E9" />
            </View>
            <Text style={styles.emptyTitle}>No call history</Text>
            <Text style={styles.emptySubtitle}>
              Start calling your contacts to see your call history here
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  newCallButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FBFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callsList: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});