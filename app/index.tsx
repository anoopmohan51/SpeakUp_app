import { View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';

export default function IndexPage() {
  // Automatically redirect to the welcome screen
  return <Redirect href="/(tabs)/home" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});