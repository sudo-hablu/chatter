import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { CreditCard as Edit2, Trash2, MessageCircle, Copy } from 'lucide-react-native';

interface MessageOptionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onReply: () => void;
  onCopy: () => void;
  onClose: () => void;
}

export const MessageOptions: React.FC<MessageOptionsProps> = ({
  onEdit,
  onDelete,
  onReply,
  onCopy,
  onClose,
}) => {
  const { theme } = useTheme();

  const options = [
    { icon: MessageCircle, label: 'Reply', onPress: onReply },
    { icon: Edit2, label: 'Edit', onPress: onEdit },
    { icon: Copy, label: 'Copy', onPress: onCopy },
    { icon: Trash2, label: 'Delete', onPress: onDelete, destructive: true },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.label}
          style={styles.option}
          onPress={() => {
            option.onPress();
            onClose();
          }}
        >
          <option.icon
            size={20}
            color={option.destructive ? theme.colors.error : theme.colors.text}
          />
          <Text
            style={[
              styles.optionText,
              {
                color: option.destructive ? theme.colors.error : theme.colors.text,
              },
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    position: 'absolute',
    bottom: '100%',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  option: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
  },
  optionText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});