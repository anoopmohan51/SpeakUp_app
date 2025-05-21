import { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Mic, CircleStop as StopCircle } from 'lucide-react-native';
import Animated, { FadeInDown, useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import Button from '../../../components/Button';
import Colors from '../../../constants/Colors';

export default function ReadScreen() {
  const router = useRouter();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const animatedHeight = useSharedValue(0);
  const randomHeights = Array.from({ length: 30 }, () => Math.random() * 0.8 + 0.2);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(animatedHeight.value * 100, { duration: 300 }),
    };
  });

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setRecordingStatus('recording');
      setRecordingDuration(0);
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
        animatedHeight.value = Math.random() * 0.8 + 0.2;
      }, 1000);
      
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setRecordingStatus('recorded');
    
    try {
      await recording.stopAndUnloadAsync();
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  const handleContinue = useCallback(() => {
    router.push('/(tabs)/home/readAgain');
  }, [router]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderWaveform = () => {
    return (
      <View style={styles.waveformContainer}>
        {randomHeights.map((height, index) => (
          <Animated.View
            key={index}
            style={[
              styles.waveformBar,
              { height: recordingStatus === 'recording' ? undefined : height * 60 },
              recordingStatus === 'recording' ? animatedStyle : null
            ]}
          />
        ))}
      </View>
    );
  };

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
        <Text style={styles.title}>Read this topic aloud</Text>
        <Text style={styles.subtitle}>
          Please read the following passage out loud. This helps us evaluate your pronunciation and fluency.
        </Text>
      </Animated.View>

      <Animated.View 
        style={styles.passageContainer}
        entering={FadeInDown.delay(200).duration(500)}
      >
        <Text style={styles.passageText}>
          Technology has dramatically changed how we communicate in the modern world. People can instantly connect with friends and family across the globe through video calls and messaging apps. While this has many advantages, it's important to maintain a healthy balance between digital connections and real-life interactions. What do you think about this topic?
        </Text>
      </Animated.View>

      <View style={styles.recordingContainer}>
        {recordingStatus === 'idle' ? (
          <TouchableOpacity 
            style={styles.recordButton}
            onPress={startRecording}
          >
            <Mic size={28} color="#FFF" />
            <Text style={styles.recordButtonText}>Tap to Start Reading</Text>
          </TouchableOpacity>
        ) : (
          <Animated.View 
            style={styles.recordingInterface}
            entering={FadeInDown.duration(400)}
          >
            {renderWaveform()}
            <View style={styles.recordingControls}>
              <Text style={styles.recordingTime}>{formatTime(recordingDuration)}</Text>
              {recordingStatus === 'recording' && (
                <TouchableOpacity 
                  style={styles.stopButton}
                  onPress={stopRecording}
                >
                  <StopCircle size={56} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue}
          disabled={recordingStatus !== 'recorded'}
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
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  passageContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  passageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    lineHeight: 26,
  },
  recordingContainer: {
    alignItems: 'center',
    marginBottom: 40,
    minHeight: 150,
  },
  recordButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  recordButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFF',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  recordingInterface: {
    width: '100%',
    alignItems: 'center',
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  recordingTime: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.text,
    marginRight: 32,
  },
  stopButton: {
    padding: 8,
  },
  waveformContainer: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waveformBar: {
    width: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  footer: {
    marginTop: 16,
  },
});