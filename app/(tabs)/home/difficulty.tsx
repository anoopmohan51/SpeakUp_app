import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../../constants/Colors';
import Button from '../../../components/Button';

const difficulties = [
  { id: 1, label: 'I\'m afraid of making mistakes' },
  { id: 2, label: 'I don\'t know enough words' },
  { id: 3, label: 'I can\'t pronounce words correctly' },
  { id: 4, label: 'I get nervous when speaking' },
  { id: 5, label: 'I can\'t think fast enough in English' },
  { id: 6, label: 'I don\'t have anyone to practice with' },
];

export default function DifficultyScreen() {
  const router = useRouter();
  const [selectedDifficulties, setSelectedDifficulties] = useState<number[]>([]);

  const toggleDifficulty = useCallback((id: number) => {
    setSelectedDifficulties(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const handleContinue = useCallback(() => {
    // Save selected difficulties to state management or context here
    router.push('/(tabs)/home/field');
  }, [router]);

  return (
    <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>What stops you from speaking English?</Text>
        <Text style={styles.subtitle}>Select all that apply to you</Text>
      </View>

      <View style={styles.optionsContainer}>
        {difficulties.map((difficulty, index) => (
          <Animated.View 
            key={difficulty.id}
            entering={FadeInDown.delay(index * 100).duration(400)}
          >
            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedDifficulties.includes(difficulty.id) && styles.selectedCard
              ]}
              onPress={() => toggleDifficulty(difficulty.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionText,
                selectedDifficulties.includes(difficulty.id) && styles.selectedText
              ]}>
                {difficulty.label}
              </Text>
              
              {selectedDifficulties.includes(difficulty.id) && (
                <View style={styles.checkIconContainer}>
                  <Check size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue}
          disabled={selectedDifficulties.length === 0}
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
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCard: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  selectedText: {
    color: Colors.primary,
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: 16,
  },
});