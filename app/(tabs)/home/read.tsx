import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, CirclePause as PauseCircle, RotateCcw, MessageSquare } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import Button from '../../../components/Button';
import Colors from '../../../constants/Colors';

export default function ListeningScreen() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const audioText = "Technology has dramatically changed how we communicate in the modern world. People can instantly connect with friends and family across the globe through video calls and messaging apps. While this has many advantages, it's important to maintain a healthy balance between digital connections and real-life interactions.";

  const playAudio = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        // Simulate loading and playing audio
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../../../assets/audio/sample.mp3'),
          { shouldPlay: true }
        );
        
        setSound(newSound);
        setIsPlaying(true);
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setHasListened(true);
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const restartAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.playFromPositionAsync(0);
      setIsPlaying(true);
    }
  };

  const handleContinue = useCallback(() => {
    router.push('/(tabs)/home/readAgain');
  }, [router]);

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
        <Text style={styles.title}>Listen to this conversation</Text>
        <Text style={styles.subtitle}>
          Listen carefully to the audio. You can replay it as many times as you need.
        </Text>
      </Animated.View>

      <Animated.View 
        style={styles.audioPlayerContainer}
        entering={FadeInDown.delay(200).duration(500)}
      >
        <View style={styles.playerControls}>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={playAudio}
          >
            {isPlaying ? (
              <PauseCircle size={64} color={Colors.primary} />
            ) : (
              <Play size={64} color={Colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.restartButton}
            onPress={restartAudio}
          >
            <RotateCcw size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.transcriptButton}
          onPress={() => setShowTranscript(!showTranscript)}
        >
          <MessageSquare size={20} color={Colors.primary} />
          <Text style={styles.transcriptButtonText}>
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </Text>
        </TouchableOpacity>

        {showTranscript && (
          <Animated.View 
            style={styles.transcriptContainer}
            entering={FadeInDown.duration(300)}
          >
            <Text style={styles.transcriptText}>{audioText}</Text>
          </Animated.View>
        )}
      </Animated.View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue}
          disabled={!hasListened}
        />
        {!hasListened && (
          <Text style={styles.helperText}>
            Please listen to the audio before continuing
          </Text>
        )}
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
  audioPlayerContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  playButton: {
    marginRight: 24,
  },
  restartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transcriptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
  },
  transcriptButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
  },
  transcriptContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  transcriptText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
  },
  footer: {
    marginTop: 'auto',
  },
  helperText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});