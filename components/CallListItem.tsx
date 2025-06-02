import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Phone, Video } from 'lucide-react-native';
import { Call } from '@/types';

interface CallListItemProps {
  call: Call;
}

export const CallListItem: React.FC<CallListItemProps> = ({ call }) => {
  const getCallIcon = () => {
    const iconSize = 16;
    
    if (call.type === 'video') {
      return <Video size={iconSize} color={getCallStatusColor(call.status)} />;
    }
    
    switch (call.direction) {
      case 'incoming':
        return call.status === 'missed' 
          ? <PhoneMissed size={iconSize} color="#EF4444" />
          : <PhoneIncoming size={iconSize} color="#10B981" />;
      case 'outgoing':
        return <PhoneOutgoing size={iconSize} color="#3B82F6" />;
      default:
        return <Phone size={iconSize} color="#6B7280" />;
    }
  };
  
  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'missed':
        return '#EF4444'; // Red for missed
      case 'completed':
        return '#10B981'; // Green for completed
      default:
        return '#6B7280'; // Gray for other statuses
    }
  };
  
  const formatCallTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatCallDuration = (duration: number) => {
    if (duration < 60) {
      return `${duration}s`;
    }
    
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <TouchableOpacity style={styles.container}>
      <Image source={{ uri: call.avatarUrl }} style={styles.avatar} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{call.name}</Text>
        <View style={styles.callInfo}>
          {getCallIcon()}
          <Text 
            style={[
              styles.callStatus,
              { color: getCallStatusColor(call.status) }
            ]}
          >
            {call.direction === 'incoming' ? 'Incoming' : 'Outgoing'} 
            {call.type === 'video' ? ' video call' : ' call'}
            {call.status === 'missed' ? ' · Missed' : ''}
          </Text>
        </View>
      </View>
      
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatCallTime(call.timestamp)}</Text>
        {call.status === 'completed' && call.duration && (
          <Text style={styles.duration}>{formatCallDuration(call.duration)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 8,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  duration: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
});