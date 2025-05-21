import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  title,
  onPress,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const getButtonStyles = () => {
    let buttonStyles = [styles.button];
    
    // Add size-specific styles
    if (size === 'small') buttonStyles.push(styles.buttonSmall);
    if (size === 'large') buttonStyles.push(styles.buttonLarge);
    
    // Add variant-specific styles
    if (variant === 'filled') buttonStyles.push(styles.buttonFilled);
    if (variant === 'outline') buttonStyles.push(styles.buttonOutline);
    if (variant === 'text') buttonStyles.push(styles.buttonText);
    
    // Add disabled styles
    if (disabled) {
      if (variant === 'filled') buttonStyles.push(styles.buttonFilledDisabled);
      if (variant === 'outline') buttonStyles.push(styles.buttonOutlineDisabled);
      if (variant === 'text') buttonStyles.push(styles.buttonTextDisabled);
    }
    
    return buttonStyles;
  };
  
  const getTextStyles = () => {
    let textStyles = [styles.buttonLabel];
    
    // Add size-specific text styles
    if (size === 'small') textStyles.push(styles.buttonLabelSmall);
    if (size === 'large') textStyles.push(styles.buttonLabelLarge);
    
    // Add variant-specific text styles
    if (variant === 'filled') textStyles.push(styles.buttonLabelFilled);
    if (variant === 'outline') textStyles.push(styles.buttonLabelOutline);
    if (variant === 'text') textStyles.push(styles.buttonLabelText);
    
    // Add disabled text styles
    if (disabled) {
      if (variant === 'filled') textStyles.push(styles.buttonLabelFilledDisabled);
      if (variant === 'outline') textStyles.push(styles.buttonLabelOutlineDisabled);
      if (variant === 'text') textStyles.push(styles.buttonLabelTextDisabled);
    }
    
    return textStyles;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'filled' ? '#FFFFFF' : Colors.primary} 
        />
      ) : (
        <Text style={getTextStyles()}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonLarge: {
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  buttonFilled: {
    backgroundColor: Colors.primary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonText: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  buttonFilledDisabled: {
    backgroundColor: Colors.disabled,
  },
  buttonOutlineDisabled: {
    borderColor: Colors.disabled,
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
  buttonLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonLabelSmall: {
    fontSize: 14,
  },
  buttonLabelLarge: {
    fontSize: 18,
  },
  buttonLabelFilled: {
    color: '#FFFFFF',
  },
  buttonLabelOutline: {
    color: Colors.text,
  },
  buttonLabelText: {
    color: Colors.primary,
  },
  buttonLabelFilledDisabled: {
    color: '#FFFFFF',
  },
  buttonLabelOutlineDisabled: {
    color: Colors.textTertiary,
  },
  buttonLabelTextDisabled: {
    color: Colors.textTertiary,
  },
});