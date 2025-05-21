import { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Mic, CircleStop as StopCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown, useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import Button from '../../../components/Button';
import Colors from '../../../constants/Colors';

export default function ReadAgainScreen() {
  const router = useRouter();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [feedback, setFeedback] = useState<{ word: string, issues: string[] }[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const animatedHeight = useSharedValue(0);
  const randomHeights = Array.from({ length: 30 }, () => Math.random() * 0.8 + 0.2);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(animatedHeight.value * 100, { duration: 300 }),
    };
  });

  // Mock function to simulate AI pronunciation feedback
  useEffect(() => {
    if (recordingStatus === 'recorded') {
      // Simulate AI analysis with a delay
      const timeout = setTimeout(() => {
        setFeedback([
          { word: 'dramatically', issues: ['Stress on wrong syllable'] },
          { word: 'communicate', issues: ['Unclear vowel sounds'] },
          { word: 'advantages', issues: ['Dropping the final "s" sound'] },
        ]);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [recordingStatus]);

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
      setFeedback([]);
      
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
    router.push('/(tabs)/home/aiTutor');
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

  const renderFeedback = () => {
    if (feedback.length === 0) return null;
    
    return (
      <Animated.View 
        style={styles.feedbackContainer}
        entering={FadeInDown.duration(500)}
      >
        <Text style={styles.feedbackTitle}>Pronunciation Feedback:</Text>
        {feedback.map((item, index) => (
          <View key={index} style={styles.feedbackItem}>
            <View style={styles.feedbackIconContainer}>
              <AlertCircle size={16} color={Colors.warning} />
            </View>
            <View style={styles.feedbackTextContainer}>
              <Text style={styles.feedbackWord}>{item.word}</Text>
              <Text style={styles.feedbackIssue}>{item.issues.join(', ')}</Text>
            </View>
          </View>
        ))}
      </Animated.View>
    );
  };

  return (
    <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Read the passage again</Text>
        <Text style={styles.subtitle}>
          Let's try once more. We'll provide feedback on your pronunciation.
        </Text>
      </View>

      <View style={styles.passageContainer}>
        <Text style={styles.passageText}>
          Technology has <Text style={styles.highlightWord}>dramatically</Text> changed how we <Text style={styles.highlightWord}>communicate</Text> in the modern world. People can instantly connect with friends and family across the globe through video calls and messaging apps. While this has many <Text style={styles.highlightWord}>advantages</Text>, it's important to maintain a healthy balance between digital connections and real-life interactions. What do you think about this topic?
        </Text>
      </View>

      <View style={styles.recordingContainer}>
        {recordingStatus === 'idle' ? (
          <TouchableOpacity 
            style={styles.recordButton}
            onPress={startRecording}
          >
            <Mic size={28} color="#FFF" />
            <Text style={styles.recordButtonText}>Tap to Read Again</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.recordingInterface}>
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
          </View>
        )}
      </View>

      {renderFeedback()}

      <View style={styles.footer}>
        <Button 
          title="Continue to AI Tutor" 
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
  highlightWord: {
    backgroundColor: Colors.highlightBackground,
    color: Colors.primary,
    fontFamily: 'Inter-SemiBold',
    borderRadius: 4,
    overflow: 'hidden',
  },
  recordingContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
  feedbackContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  feedbackTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  feedbackItem: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: Colors.warningLight,
    borderRadius: 8,
    padding: 10,
  },
  feedbackIconContainer: {
    marginRight: 10,
    paddingTop: 2,
  },
  feedbackTextContainer: {
    flex: 1,
  },
  feedbackWord: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.text,
    marginBottom: 2,
  },
  feedbackIssue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footer: {
    marginTop: 16,
  },
});