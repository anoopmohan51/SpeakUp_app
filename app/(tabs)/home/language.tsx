import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Globe, Search, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../../constants/Colors';
import Button from '../../../components/Button';

const popularLanguages = [
  'Spanish', 'Chinese', 'Arabic', 'French', 'Russian', 
  'Portuguese', 'German', 'Japanese', 'Hindi', 'Korean'
];

export default function LanguageScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const filteredLanguages = searchQuery
    ? popularLanguages.filter(lang => 
        lang.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularLanguages;

  const handleContinue = useCallback(() => {
    // Save selected language to state management or context
    router.push('/(tabs)/home/name');
  }, [router, selectedLanguage]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
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
          <Globe size={24} color={Colors.primary} />
        </View>
        <Text style={styles.title}>What's your native language?</Text>
        <Text style={styles.subtitle}>We'll customize your learning based on your language background</Text>
      </Animated.View>

      <Animated.View 
        style={styles.searchContainer}
        entering={FadeInDown.delay(200).duration(500)}
      >
        <Search size={20} color={Colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search languages"
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </Animated.View>

      <View style={styles.languagesContainer}>
        {filteredLanguages.length > 0 ? (
          filteredLanguages.map((language, index) => (
            <Animated.View 
              key={language}
              entering={FadeInDown.delay(300 + index * 50).duration(400)}
            >
              <Button 
                title={language}
                variant={selectedLanguage === language ? 'filled' : 'outline'}
                onPress={() => setSelectedLanguage(language)}
                style={styles.languageButton}
              />
            </Animated.View>
          ))
        ) : (
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Text style={styles.noResultsText}>
              No languages found. Try a different search.
            </Text>
          </Animated.View>
        )}
        
        <Animated.View entering={FadeInDown.delay(300 + filteredLanguages.length * 50).duration(400)}>
          <Button 
            title="Other"
            variant={selectedLanguage === 'Other' ? 'filled' : 'outline'}
            onPress={() => setSelectedLanguage('Other')}
            style={styles.languageButton}
          />
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue}
          disabled={selectedLanguage === ''}
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
    marginBottom: 24,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: {
    padding: 8,
  },
  languagesContainer: {
    marginBottom: 32,
  },
  languageButton: {
    marginBottom: 12,
  },
  noResultsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  footer: {
    marginTop: 16,
  },
});