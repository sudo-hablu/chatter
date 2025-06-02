import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function OTPScreen() {
  const router = useRouter();
  const { method, contact } = useLocalSearchParams();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  // Countdown timer for resending OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);
  
  const handleOtpChange = (text: string, index: number) => {
    // Update the OTP digit
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Auto focus to next input
    if (text.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleResendOtp = () => {
    if (canResend) {
      // Reset OTP fields
      setOtp(['', '', '', '']);
      
      // Reset timer
      setTimeLeft(60);
      setCanResend(false);
      
      // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  };
  
  const handleVerifyOtp = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 4) {
      setIsVerifying(true);
      
      // Simulate OTP verification with a delay
      setTimeout(() => {
        setIsVerifying(false);
        router.push('/auth/profile');
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>
      
      <Animated.View 
        style={styles.contentContainer}
        entering={FadeInUp.delay(100).duration(800)}
      >
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to {'\n'}
          <Text style={styles.contactText}>{contact as string}</Text>
        </Text>
        
        <Animated.View 
          style={styles.otpContainer}
          entering={FadeInDown.delay(300).duration(500)}
        >
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              selectionColor="#3B82F6"
            />
          ))}
        </Animated.View>
        
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive the code?{' '}
            {canResend ? (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.resendButton}>Resend</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>Resend in {timeLeft}s</Text>
            )}
          </Text>
        </View>
      </Animated.View>
      
      <Animated.View
        style={styles.buttonContainer}
        entering={FadeInUp.delay(500).duration(500)}
      >
        <TouchableOpacity
          style={[
            styles.verifyButton,
            otp.every((digit) => digit !== '') ? styles.enabledButton : styles.disabledButton
          ]}
          onPress={handleVerifyOtp}
          disabled={otp.some((digit) => digit === '') || isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.buttonText}>Verify</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
  },
  backButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  contactText: {
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 40,
  },
  otpInput: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    backgroundColor: '#F9FAFB',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  resendButton: {
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  timerText: {
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  buttonContainer: {
    marginBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  verifyButton: {
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