import { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Mic, Send, Bot, Headphones, VolumeX, CircleStop as StopCircle, ChevronDown } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import Colors from '../../../constants/Colors';

type MessageType = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
};

export default function AiTutorScreen() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const waveformHeight = useSharedValue(0);
  const waveformStyle = useAnimatedStyle(() => ({
    height: waveformHeight.value,
  }));
  
  // Initialize with AI greeting
  useEffect(() => {
    const initialMessage = {
      id: Date.now().toString(),
      sender: 'ai' as const,
      text: `Hi there! I'm your AI English tutor. Based on your speaking samples, I can help you with pronunciation, vocabulary, and conversation practice. What would you like to work on today?`,
      timestamp: new Date(),
    };
    
    setMessages([initialMessage]);
  }, []);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Simulate the AI responding to user input
  const simulateAiResponse = useCallback((userText: string) => {
    // Wait a brief moment to simulate AI thinking
    setTimeout(() => {
      let aiResponse = '';
      
      // Simple keyword detection for canned responses
      if (userText.toLowerCase().includes('pronunciation')) {
        aiResponse = "I noticed you had some difficulty with words like 'dramatically' and 'communicate'. Let's practice those. Repeat after me: dra-MAT-i-cal-ly. Put the emphasis on the 'MAT' syllable.";
      } else if (userText.toLowerCase().includes('vocabulary')) {
        aiResponse = "Let's build your technology vocabulary. Some useful words are: 'interface', 'digital literacy', 'connectivity', and 'virtual interaction'. Which of these would you like to learn more about?";
      } else if (userText.toLowerCase().includes('nervous') || userText.toLowerCase().includes('afraid')) {
        aiResponse = "It's completely normal to feel nervous when speaking a new language. The key is practice in a safe environment - which is exactly what we're doing! Let's start with simple conversations that you might have in your daily life.";
      } else {
        aiResponse = "That's a great question! To improve your English speaking skills, consistent practice is key. Would you like to focus on pronunciation, vocabulary, or having a conversation about a specific topic?";
      }
      
      const newMessage = {
        id: Date.now().toString(),
        sender: 'ai' as const,
        text: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
    }, 1500);
  }, []);
  
  const handleSendMessage = useCallback(() => {
    if (inputText.trim() === '') return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      text: inputText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    simulateAiResponse(inputText);
    setInputText('');
  }, [inputText, simulateAiResponse]);

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
      setIsRecording(true);
      
      // Animate the waveform
      const interval = setInterval(() => {
        waveformHeight.value = withTiming(
          Math.random() * 20 + 10,
          { duration: 200 }
        );
      }, 200);
      
      return () => clearInterval(interval);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    
    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      
      // Simulate speech-to-text conversion
      setTimeout(() => {
        const transcribedText = getRandomUserMessage();
        setInputText(transcribedText);
      }, 1000);
      
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  const playAiMessage = useCallback((message: string) => {
    setIsListening(true);
    
    // Simulate speech playback with a timeout
    setTimeout(() => {
      setIsListening(false);
    }, message.length * 60); // Rough estimate of speech duration
  }, []);
  
  const stopPlayback = useCallback(() => {
    setIsListening(false);
  }, []);

  const getRandomUserMessage = () => {
    const messages = [
      "I'm really nervous about speaking English in meetings at work.",
      "Can you help me practice my pronunciation?",
      "I don't know enough vocabulary for business conversations.",
      "What's the best way to improve my fluency?",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.containerInner}>
        <Animated.View 
          entering={FadeInDown.duration(500)}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Chat with your AI tutor</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <Animated.View 
              key={message.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
              style={[
                styles.messageContainer,
                message.sender === 'user' ? styles.userMessageContainer : styles.aiMessageContainer
              ]}
            >
              {message.sender === 'ai' && (
                <View style={styles.avatarContainer}>
                  <Bot size={20} color={Colors.primary} />
                </View>
              )}
              
              <View style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userMessageBubble : styles.aiMessageBubble
              ]}>
                <Text style={[
                  styles.messageText,
                  message.sender === 'user' ? styles.userMessageText : styles.aiMessageText
                ]}>
                  {message.text}
                </Text>
              </View>
              
              {message.sender === 'ai' && (
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => playAiMessage(message.text)}
                  disabled={isListening}
                >
                  {isListening ? (
                    <StopCircle size={20} color={Colors.primary} />
                  ) : (
                    <Headphones size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            </Animated.View>
          ))}
          
          {isListening && (
            <Animated.View 
              entering={FadeIn.duration(300)}
              style={styles.listeningIndicator}
            >
              <Text style={styles.listeningText}>Playing audio...</Text>
              <TouchableOpacity onPress={stopPlayback}>
                <VolumeX size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor={Colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            
            {!isRecording ? (
              <TouchableOpacity 
                style={styles.micButton}
                onPress={startRecording}
              >
                <Mic size={20} color={Colors.primary} />
              </TouchableOpacity>
            ) : (
              <Animated.View style={[styles.recordingIndicator, waveformStyle]}>
                <TouchableOpacity onPress={stopRecording}>
                  <StopCircle size={20} color={Colors.error} />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  containerInner: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 0 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text,
  },
  settingsButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  userMessageBubble: {
    backgroundColor: Colors.primary,
  },
  aiMessageBubble: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFF',
    fontFamily: 'Inter-Regular',
  },
  aiMessageText: {
    color: Colors.text,
    fontFamily: 'Inter-Regular',
  },
  playButton: {
    marginLeft: 8,
    alignSelf: 'center',
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'center',
    marginVertical: 8,
  },
  listeningText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.primary,
    marginRight: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  micButton: {
    paddingLeft: 12,
    paddingBottom: 8,
  },
  recordingIndicator: {
    paddingLeft: 12,
    paddingBottom: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
});