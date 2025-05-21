import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../../constants/Colors';
import Button from '../../../components/Button';

export default function EmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = useCallback(() => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Save email to state management or context
    router.push('/(tabs)/home/introduction');
  }, [router, email]);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) setError('');
  };

  return (
    <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View 
        style={styles.headerContainer}
        entering={FadeInDown.duration(500)}
      >
        <View style={styles.iconContainer}>
          <Mail size={24} color={Colors.primary} />
        </View>
        <Text style={styles.title}>What's your email?</Text>
        <Text style={styles.subtitle}>We'll use this to create your account and save your progress</Text>
      </Animated.View>

      <Animated.View 
        style={styles.inputContainer}
        entering={FadeInDown.delay(300).duration(500)}
      >
        <Text style={styles.inputLabel}>Email address</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Enter your email"
          placeholderTextColor={Colors.textTertiary}
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </Animated.View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue}
          disabled={email.trim().length === 0}
        />
        <Text style={styles.privacyText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.error,
    marginTop: 8,
  },
  footer: {
    marginTop: 16,
  },
  privacyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 16,
  },
});