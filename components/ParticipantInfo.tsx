import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Phone, Video, X } from 'lucide-react-native';

interface ParticipantInfoProps {
  participant: {
    id: string;
    name: string;
    avatarUrl: string;
    status?: string;
    phone?: string;
    email?: string;
  };
  onClose: () => void;
}

export const ParticipantInfo: React.FC<ParticipantInfoProps> = ({ participant, onClose }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image source={{ uri: participant.avatarUrl }} style={styles.avatar} />
          <Text style={[styles.name, { color: theme.colors.text }]}>{participant.name}</Text>
          {participant.status && (
            <Text style={[styles.status, { color: theme.colors.textSecondary }]}>
              {participant.status}
            </Text>
          )}
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          >
            <Phone size={24} color={theme.colors.primaryText} />
            <Text style={[styles.actionText, { color: theme.colors.primaryText }]}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          >
            <Video size={24} color={theme.colors.primaryText} />
            <Text style={[styles.actionText, { color: theme.colors.primaryText }]}>
              Video Call
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.infoSection, { borderColor: theme.colors.border }]}>
          {participant.phone && (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Phone
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {participant.phone}
              </Text>
            </View>
          )}

          {participant.email && (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Email
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {participant.email}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 120,
    justifyContent: 'center',
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  infoSection: {
    paddingHorizontal: 24,
    borderTopWidth: 1,
  },
  infoItem: {
    paddingVertical: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});