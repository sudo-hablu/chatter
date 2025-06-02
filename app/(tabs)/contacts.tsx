import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { UserPlus, Search, Users } from 'lucide-react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { generateMockContacts } from '@/utils/mockData';
import { Contact } from '@/types';
import { ContactListItem } from '@/components/ContactListItem';

export default function ContactsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  useEffect(() => {
    // Generate mock contacts
    setContacts(generateMockContacts(25));
  }, []);
  
  const filteredContacts = searchQuery
    ? contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;
    
  // Group contacts by first letter
  const groupedContacts = filteredContacts.reduce((groups, contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(contact);
    return groups;
  }, {} as Record<string, Contact[]>);
  
  // Convert grouped contacts to sections
  const sections = Object.keys(groupedContacts)
    .sort()
    .map(letter => ({
      title: letter,
      data: groupedContacts[letter].sort((a, b) => a.name.localeCompare(b.name))
    }));
  
  const handleAddContact = () => {
    // In a real app, this would open the contact creation screen
    console.log("Add new contact");
  };
  
  const handleContactPress = (contactId: string) => {
    // In a real app, this would navigate to the contact profile or start a new chat
    console.log("Contact pressed:", contactId);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.delay(100).duration(800)}
      >
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity 
          style={styles.addContactButton} 
          onPress={handleAddContact}
        >
          <UserPlus size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Search Bar */}
      <Animated.View 
        style={styles.searchContainer}
        entering={FadeInUp.delay(200).duration(800)}
      >
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>
      
      {/* Contacts List */}
      {filteredContacts.length > 0 ? (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.title}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInRight.delay(200 + index * 50).duration(500)}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>{item.title}</Text>
                {item.data.map((contact, contactIndex) => (
                  <ContactListItem
                    key={contact.id}
                    contact={contact}
                    onPress={() => handleContactPress(contact.id)}
                  />
                ))}
              </View>
            </Animated.View>
          )}
          contentContainerStyle={styles.contactsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Users size={32} color="#8B5CF6" />
          </View>
          <Text style={styles.emptyTitle}>No contacts found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? 'Try a different search term' : 'Add contacts to start chatting'}
          </Text>
        </View>
      )}
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
  addContactButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  contactsList: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#8B5CF6',
    marginBottom: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F3FF',
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
  },
});