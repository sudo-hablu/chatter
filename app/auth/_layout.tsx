import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#FFFFFF' },
      animation: 'slide_from_right',
    }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}