import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Briefcase } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../../constants/Colors';
import Button from '../../../components/Button';

const commonFields = [
  'Technology & IT',
  'Healthcare',
  'Education',
  'Finance & Banking',
  'Marketing & Advertising',
  'Engineering',
  'Customer Service',
  'Student',
];

export default function FieldScreen() {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState('');
  const [customField, setCustomField] = useState('');

  const handleContinue = useCallback(() => {
    // Save selected field to state management or context
    const finalField = selectedField === 'Other' ? customField : selectedField;
    // Save finalField to your state management solution
    
    router.push('/(tabs)/home/gender');
  }, [router, selectedField, customField]);

  const selectField = useCallback((field: string) => {
    setSelectedField(field);
    if (field !== 'Other') {
      setCustomField('');
    }
  }, []);

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
          <Briefcase size={24} color={Colors.primary} />
        </View>
        <Text style={styles.title}>What's your field of work?</Text>
        <Text style={styles.subtitle}>We'll tailor your learning experience to your professional needs</Text>
      </Animated.View>

      <View style={styles.fieldsContainer}>
        {commonFields.map((field, index) => (
          <Animated.View 
            key={field}
            entering={FadeInDown.delay(index * 50).duration(400)}
          >
            <Button 
              title={field}
              variant={selectedField === field ? 'filled' : 'outline'}
              onPress={() => selectField(field)}
              style={styles.fieldButton}
            />
          </Animated.View>
        ))}
        
        <Animated.View entering={FadeInDown.delay(commonFields.length * 50).duration(400)}>
          <Button 
            title="Other"
            variant={selectedField === 'Other' ? 'filled' : 'outline'}
            onPress={() => selectField('Other')}
            style={styles.fieldButton}
          />
        </Animated.View>
        
        {selectedField === 'Other' && (
          <Animated.View 
            entering={FadeInDown.duration(300)}
            style={styles.customInputContainer}
          >
            <TextInput
              style={styles.customInput}
              placeholder="Enter your field"
              value={customField}
              onChangeText={setCustomField}
              placeholderTextColor={Colors.textTertiary}
            />
          </Animated.View>
        )}
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue}
          disabled={selectedField === '' || (selectedField === 'Other' && customField === '')}
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
    paddingHorizontal: 16,
  },
  fieldsContainer: {
    marginBottom: 32,
  },
  fieldButton: {
    marginBottom: 12,
  },
  customInputContainer: {
    marginTop: 8,
  },
  customInput: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  footer: {
    marginTop: 16,
  },
});