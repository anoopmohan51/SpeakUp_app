import { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Mic, CircleStop as StopCircle, Play, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown, useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import Button from '../../../components/Button';
import Colors from '../../../constants/Colors';

export default function IntroductionScreen() {
  const router = useRouter();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
      if (Platform.OS !== 'web') {
        await Audio.requestPermissionsAsync();
      }
      
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
      
      // Get the recorded file URI
      const uri = recording.getURI();
      if (uri) {
        // Create and load sound for playback
        const { sound } = await Audio.Sound.createAsync({ uri });
        setSound(sound);
      }
      
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  const playRecording = async () => {
    if (!sound) return;
    
    try {
      setIsPlaying(true);
      await sound.replayAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.error('Failed to play the recording', err);
      setIsPlaying(false);
    }
  };

  const stopPlayback = async () => {
    if (!sound) return;
    
    try {
      await sound.stopAsync();
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to stop the playback', err);
    }
  };

  const deleteRecording = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setRecordingStatus('idle');
    setRecordingDuration(0);
  };

  const handleContinue = useCallback(() => {
    router.push('/(tabs)/home/read');
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
    <View style={styles.container}>
      <Animated.View 
        style={styles.headerContainer}
        entering={FadeInDown.duration(500)}
      >
        <Text style={styles.title}>Introduce yourself in English</Text>
        <Text style={styles.subtitle}>
          Record a brief introduction about yourself in English. This helps us assess your current speaking level.
        </Text>
      </Animated.View>

      <Animated.View 
        style={styles.promptContainer}
        entering={FadeInDown.delay(200).duration(500)}
      >
        <Text style={styles.promptTitle}>Try saying something like:</Text>
        <Text style={styles.promptText}>
          "Hi, my name is [your name]. I'm from [your country] and I work as a [your job]. I'm learning English because [your reason]."
        </Text>
      </Animated.View>

      <View style={styles.recordingContainer}>
        {recordingStatus === 'idle' ? (
          <TouchableOpacity 
            style={styles.recordButton}
            onPress={startRecording}
          >
            <Mic size={32} color="#FFF" />
            <Text style={styles.recordButtonText}>Tap to Record</Text>
          </TouchableOpacity>
        ) : (
          <Animated.View 
            style={styles.recordingInterface}
            entering={FadeInDown.duration(400)}
          >
            {recordingStatus === 'recording' ? (
              <>
                {renderWaveform()}
                <View style={styles.recordingControls}>
                  <Text style={styles.recordingTime}>{formatTime(recordingDuration)}</Text>
                  <TouchableOpacity 
                    style={styles.stopButton}
                    onPress={stopRecording}
                  >
                    <StopCircle size={56} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {renderWaveform()}
                <View style={styles.playbackControls}>
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={deleteRecording}
                  >
                    <Trash2 size={24} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={isPlaying ? stopPlayback : playRecording}
                  >
                    {isPlaying ? (
                      <StopCircle size={48} color={Colors.primary} />
                    ) : (
                      <Play size={48} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                  
                  <View style={{ width: 40 }} />
                </View>
              </>
            )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
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
  promptContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  promptTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  promptText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  recordingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
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
    fontSize: 16,
    color: '#FFF',
    marginTop: 12,
  },
  recordingInterface: {
    width: '100%',
    alignItems: 'center',
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
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
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 24,
  },
  controlButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  playButton: {
    padding: 8,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 16,
  },
});