import { useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Play, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../../constants/Colors';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const handleGetStarted = useCallback(() => {
    router.push('/(tabs)/home/difficulty');
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <Animated.View entering={FadeIn.delay(300).duration(1000)} style={styles.header}>
        <Text style={styles.logoText}>SpeakUp</Text>
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(600).duration(1000)} style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg' }}
          style={styles.image}
          resizeMode="cover"
        />
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(900).duration(1000)} style={styles.contentContainer}>
        <Text style={styles.title}>Build your English speaking confidence</Text>
        <Text style={styles.subtitle}>
          Get personalized guidance and practice speaking English with confidence through interactive exercises and AI-powered feedback.
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={handleGetStarted} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Get Started</Text>
          <ArrowRight size={20} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.demoContainer}>
          <Play size={16} color={Colors.primary} />
          <Text style={styles.demoText}>Watch demo</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.primary,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
    marginRight: 8,
  },
  demoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
  },
});