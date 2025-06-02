import { Chat, Contact, Message, Call } from '@/types';

// Mock data generator functions
export const generateMockChats = (count: number): Chat[] => {
  const chats: Chat[] = [];
  
  for (let i = 0; i < count; i++) {
    const isOnline = Math.random() > 0.6;
    const unreadCount = Math.random() > 0.6 ? Math.floor(Math.random() * 10) + 1 : 0;
    const sender = Math.random() > 0.5 ? 'me' : `contact_${i}`;
    const messageStatus = sender === 'me' ? getRandomMessageStatus() : undefined;
    
    chats.push({
      id: `contact_${i}`,
      name: getRandomName(),
      avatarUrl: getRandomAvatar(),
      isOnline,
      lastMessage: {
        id: `msg_${i}`,
        text: getRandomMessage(),
        timestamp: getRandomTimestamp(),
        sender,
        status: messageStatus
      },
      unreadCount: sender === 'me' ? 0 : unreadCount
    });
  }
  
  return chats;
};

export const generateMockContacts = (count: number): Contact[] => {
  const contacts: Contact[] = [];
  
  for (let i = 0; i < count; i++) {
    contacts.push({
      id: `contact_${i}`,
      name: getRandomName(),
      avatarUrl: getRandomAvatar(),
      isOnline: Math.random() > 0.7,
      status: Math.random() > 0.3 ? getRandomStatus() : undefined,
      phone: getRandomPhoneNumber()
    });
  }
  
  return contacts.sort((a, b) => a.name.localeCompare(b.name));
};

export const generateMockMessages = (count: number, contactId: string): Message[] => {
  const messages: Message[] = [];
  let currentDate = new Date();
  
  for (let i = 0; i < count; i++) {
    // Alternate between sender and receiver
    const sender = i % 2 === 0 ? contactId : 'me';
    
    // Randomly determine message status for sent messages
    const status = sender === 'me' ? getRandomMessageStatus() : undefined;
    
    // Make the timestamp progressively older
    currentDate = new Date(currentDate.getTime() - Math.floor(Math.random() * 60 * 60 * 1000));
    
    messages.push({
      id: `msg_${i}`,
      text: getRandomConversationMessage(i, count),
      timestamp: currentDate.toISOString(),
      sender,
      status
    });
  }
  
  // Return messages in chronological order (oldest first)
  return messages.reverse();
};

export const generateMockCalls = (count: number): Call[] => {
  const calls: Call[] = [];
  
  for (let i = 0; i < count; i++) {
    const direction = Math.random() > 0.5 ? 'incoming' : 'outgoing';
    const status = getRandomCallStatus();
    const type = Math.random() > 0.7 ? 'video' : 'audio';
    const duration = status === 'completed' ? Math.floor(Math.random() * 600) : undefined;
    
    calls.push({
      id: `call_${i}`,
      name: getRandomName(),
      avatarUrl: getRandomAvatar(),
      timestamp: getRandomTimestamp(),
      duration,
      status,
      direction,
      type
    });
  }
  
  return calls;
};

export const getContactById = (id: string): Contact | null => {
  // In a real app, this would fetch the contact from a database
  // For demo purposes, we'll generate a random contact
  if (!id) return null;
  
  return {
    id,
    name: getRandomName(),
    avatarUrl: getRandomAvatar(),
    isOnline: Math.random() > 0.5,
    status: getRandomStatus(),
    phone: getRandomPhoneNumber()
  };
};

// Helper functions
function getRandomName(): string {
  const firstNames = [
    'Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace',
    'Helen', 'Ivan', 'Julia', 'Kevin', 'Laura', 'Mike', 'Nina',
    'Oliver', 'Penny', 'Quentin', 'Rachel', 'Steve', 'Tina',
    'Ursula', 'Victor', 'Wendy', 'Xavier', 'Yasmine', 'Zack'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller',
    'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White',
    'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
    'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

function getRandomAvatar(): string {
  // Use Pexels for random avatars
  const avatarUrls = [
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/6386956/pexels-photo-6386956.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'
  ];
  
  return avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
}

function getRandomMessage(): string {
  const messages = [
    'Hey, how are you?',
    'Can we talk later?',
    'Did you see the news today?',
    'I\'ll be there in 10 minutes',
    'What do you think about the new update?',
    'Let\'s meet tomorrow',
    'Thanks for your help!',
    'I\'m busy right now, can I call you later?',
    'Happy birthday! 🎉',
    'Check out this link',
    'Are you free this weekend?',
    'The meeting is canceled',
    'Don\'t forget to bring your laptop',
    'I just sent you an email',
    'Can you help me with something?'
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

function getRandomConversationMessage(index: number, total: number): string {
  // Create a more realistic conversation flow for a chat
  if (total <= 5) return getRandomMessage();
  
  // Beginning of conversation
  if (index < 2) {
    const greetings = [
      "Hey there!",
      "Hi, how are you?",
      "Hello, got a minute?",
      "Hey, are you free to chat?",
      "What's up?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Middle of conversation
  if (index < total - 2) {
    const conversation = [
      "How's your day going?",
      "Did you finish that project?",
      "I was thinking about our discussion yesterday.",
      "Have you had lunch yet?",
      "Can you send me the files we talked about?",
      "Are you coming to the meeting tomorrow?",
      "I need some advice on something.",
      "Let's catch up this weekend if you're free.",
      "What do you think about the new policy?",
      "I just finished reading that book you recommended!",
      "Did you watch the game last night?",
      "I'm really excited about the upcoming changes.",
      "That makes sense, I'll check it out."
    ];
    return conversation[Math.floor(Math.random() * conversation.length)];
  }
  
  // End of conversation
  const closings = [
    "I have to go now, talk later!",
    "Thanks for the chat!",
    "Let's continue this tomorrow.",
    "I'll get back to you on this.",
    "Got to run, bye for now!"
  ];
  return closings[Math.floor(Math.random() * closings.length)];
}

function getRandomTimestamp(): string {
  const now = new Date();
  const randomMinutes = Math.floor(Math.random() * 60 * 24 * 7); // Random time within the last week
  const timestamp = new Date(now.getTime() - randomMinutes * 60 * 1000);
  
  return timestamp.toISOString();
}

function getRandomMessageStatus(): 'sending' | 'sent' | 'delivered' | 'read' {
  const statuses: ('sending' | 'sent' | 'delivered' | 'read')[] = ['sending', 'sent', 'delivered', 'read'];
  const weights = [0.05, 0.15, 0.3, 0.5]; // More likely to be read
  
  let random = Math.random();
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      return statuses[i];
    }
    random -= weights[i];
  }
  
  return 'read';
}

function getRandomCallStatus(): 'ongoing' | 'completed' | 'missed' | 'rejected' {
  const statuses: ('ongoing' | 'completed' | 'missed' | 'rejected')[] = ['ongoing', 'completed', 'missed', 'rejected'];
  const weights = [0.05, 0.6, 0.25, 0.1]; // Most calls should be completed
  
  let random = Math.random();
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      return statuses[i];
    }
    random -= weights[i];
  }
  
  return 'completed';
}

function getRandomStatus(): string {
  const statuses = [
    'Available',
    'At work',
    'In a meeting',
    'Busy',
    'On vacation',
    'Do not disturb',
    'Studying',
    'At the gym'
  ];
  
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRandomPhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const firstPart = Math.floor(Math.random() * 900) + 100;
  const secondPart = Math.floor(Math.random() * 9000) + 1000;
  
  return `+1 (${areaCode}) ${firstPart}-${secondPart}`;
}