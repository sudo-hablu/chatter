import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';
import { Message as MessageType } from '@/types';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isSentByMe = message.sender === 'me';
  
  const renderMessageStatus = () => {
    if (!isSentByMe) return null;
    
    switch(message.status) {
      case 'sending':
        return <View style={styles.statusDot} />;
      case 'sent':
        return <Check size={14} color="#9CA3AF" />;
      case 'delivered':
        return <CheckCheck size={14} color="#9CA3AF" />;
      case 'read':
        return <CheckCheck size={14} color="#3B82F6" />;
      default:
        return null;
    }
  };
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.container,
        isSentByMe ? styles.sentContainer : styles.receivedContainer
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isSentByMe ? styles.sentBubble : styles.receivedBubble
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isSentByMe ? styles.sentText : styles.receivedText
          ]}
        >
          {message.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.timestamp,
              isSentByMe ? styles.sentTimestamp : styles.receivedTimestamp
            ]}
          >
            {formattedTime}
          </Text>
          {renderMessageStatus()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  sentContainer: {
    alignSelf: 'flex-end',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sentBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  sentText: {
    color: '#FFFFFF',
  },
  receivedText: {
    color: '#1F2937',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  sentTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receivedTimestamp: {
    color: '#9CA3AF',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});