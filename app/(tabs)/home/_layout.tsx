import { Stack } from 'expo-router';
import Colors from '../../../constants/Colors';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
          color: Colors.text,
        },
        headerTintColor: Colors.primary,
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="difficulty"
        options={{
          title: 'Speaking Blocks',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="field"
        options={{
          title: 'Your Field',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="gender"
        options={{
          title: 'Your Gender',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: 'Native Language',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="name"
        options={{
          title: 'Your Name',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="email"
        options={{
          title: 'Your Email',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="introduction"
        options={{
          title: 'Self Introduction',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="read"
        options={{
          title: 'Read Aloud',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="readAgain"
        options={{
          title: 'Read Again',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="aiTutor"
        options={{
          title: 'AI English Tutor',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}