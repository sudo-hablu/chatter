import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();
  const [contactMethod, setContactMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const validatePhone = (phone: string) => {
    const regex = /^\+?[0-9]{10,14}$/;
    return regex.test(phone);
  };
  
  const handleContinue = () => {
    // Store the contact info for the OTP screen
    const contactInfo = contactMethod === 'email' ? email : phone;
    router.push({
      pathname: '/auth/otp',
      params: { 
        method: contactMethod,
        contact: contactInfo
      }
    });
  };
  
  // Validate input when it changes
  const handleInputChange = (text: string) => {
    if (contactMethod === 'email') {
      setEmail(text);
      setIsValid(validateEmail(text));
    } else {
      setPhone(text);
      setIsValid(validatePhone(text));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          style={styles.contentContainer}
          entering={FadeInUp.delay(100).duration(800)}
        >
          <Text style={styles.title}>Welcome to Chatter</Text>
          <Text style={styles.subtitle}>
            Start chatting with friends, family, and colleagues in just a few steps.
          </Text>
          
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, contactMethod === 'email' && styles.activeToggle]}
              onPress={() => setContactMethod('email')}
            >
              <MessageCircle size={20} color={contactMethod === 'email' ? '#3B82F6' : '#6B7280'} />
              <Text style={[styles.toggleText, contactMethod === 'email' && styles.activeToggleText]}>Email</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.toggleButton, contactMethod === 'phone' && styles.activeToggle]}
              onPress={() => setContactMethod('phone')}
            >
              <Phone size={20} color={contactMethod === 'phone' ? '#3B82F6' : '#6B7280'} />
              <Text style={[styles.toggleText, contactMethod === 'phone' && styles.activeToggleText]}>Phone</Text>
            </TouchableOpacity>
          </View>
          
          <Animated.View 
            style={styles.inputContainer}
            entering={FadeInDown.delay(300).duration(500)}
          >
            <Text style={styles.inputLabel}>
              {contactMethod === 'email' ? 'Email Address' : 'Phone Number'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={contactMethod === 'email' ? 'you@example.com' : '+1 (555) 123-4567'}
              value={contactMethod === 'email' ? email : phone}
              onChangeText={handleInputChange}
              keyboardType={contactMethod === 'email' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
              autoComplete={contactMethod === 'email' ? 'email' : 'tel'}
              autoCorrect={false}
            />
            <Text style={styles.helpText}>
              {contactMethod === 'email'
                ? 'We\'ll send a verification code to this email address'
                : 'We\'ll send a verification code to this phone number'}
            </Text>
          </Animated.View>
        </Animated.View>

        <Animated.View 
          style={styles.buttonContainer}
          entering={FadeInUp.delay(500).duration(500)}
        >
          <TouchableOpacity
            style={[styles.continueButton, isValid ? styles.enabledButton : styles.disabledButton]}
            onPress={handleContinue}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 60,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeToggle: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  activeToggleText: {
    color: '#3B82F6',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  helpText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
  },
  enabledButton: {
    opacity: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
});