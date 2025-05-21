import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { User, Award, Settings, LogOut, BookOpen, ChartBar as BarChart2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../constants/Colors';

export default function ProfileScreen() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(500)}
      >
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.emailText}>john.doe@example.com</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Intermediate</Text>
        </View>
      </Animated.View>

      <View style={styles.statsContainer}>
        <Animated.View 
          style={styles.statCard}
          entering={FadeInDown.delay(100).duration(500)}
        >
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Days Streak</Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.statCard}
          entering={FadeInDown.delay(200).duration(500)}
        >
          <Text style={styles.statValue}>15</Text>
          <Text style={styles.statLabel}>Lessons Completed</Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.statCard}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <Text style={styles.statValue}>85%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </Animated.View>
      </View>

      <Animated.View 
        style={styles.section}
        entering={FadeInDown.delay(400).duration(500)}
      >
        <Text style={styles.sectionTitle}>Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65% Complete</Text>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.section}
        entering={FadeInDown.delay(500).duration(500)}
      >
        <Text style={styles.sectionTitle}>Menu</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: Colors.primaryLight }]}>
              <User size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: Colors.accentLight }]}>
              <BookOpen size={20} color={Colors.accent} />
            </View>
            <Text style={styles.menuItemText}>My Lessons</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: Colors.warningLight }]}>
              <BarChart2 size={20} color={Colors.warning} />
            </View>
            <Text style={styles.menuItemText}>Statistics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: Colors.successLight }]}>
              <Award size={20} color={Colors.success} />
            </View>
            <Text style={styles.menuItemText}>Achievements</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: Colors.infoLight }]}>
              <Settings size={20} color={Colors.info} />
            </View>
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: Colors.errorLight }]}>
              <LogOut size={20} color={Colors.error} />
            </View>
            <Text style={styles.menuItemText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.primary,
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 4,
  },
  emailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  progressContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  menuContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
});