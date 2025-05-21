import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../../constants/Colors';
import Button from '../../../components/Button';

const genderOptions = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'non-binary', label: 'Non-binary' },
  { id: 'prefer-not', label: 'Prefer not to say' },
];

export default function GenderScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState('');

  const handleContinue = useCallback(() => {
    // Save selected gender to state management or context
    router.push('/(tabs)/home/language');
  }, [router, selectedGender]);

  return (
    <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={styles.headerContainer}
        entering={FadeInDown.duration(500)}
      >
        <View style={styles.iconContainer}>
          <User size={24} color={Colors.primary} />
        </View>
        <Text style={styles.title}>What's your gender?</Text>
        <Text style={styles.subtitle}>This helps us personalize your learning experience</Text>
      </Animated.View>

      <View style={styles.optionsContainer}>
        {genderOptions.map((option, index) => (
          <Animated.View 
            key={option.id}
            entering={FadeInDown.delay(index * 100).duration(400)}
          >
            <Button 
              title={option.label}
              variant={selectedGender === option.id ? 'filled' : 'outline'}
              onPress={() => setSelectedGender(option.id)}
              style={styles.genderButton}
            />
          </Animated.View>
        ))}
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue}
          disabled={selectedGender === ''}
        />
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
  },
  optionsContainer: {
    marginBottom: 32,
  },
  genderButton: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 16,
  },
});