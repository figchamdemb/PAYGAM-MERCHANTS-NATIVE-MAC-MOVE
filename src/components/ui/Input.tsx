/**
 * ✅ REUSABLE INPUT COMPONENT
 *
 * Consistent text input component used across all screens
 * Imports colors from central config file
 *
 * Features:
 * - Label support
 * - Error message display
 * - Icon support (left/right)
 * - Secure text entry (password)
 * - Placeholder
 * - Multi-line support
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../config/colors';
import { Icon } from './Icon';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  iconLibrary?: 'material' | 'material-community' | 'ionicons' | 'font-awesome' | 'feather';
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  multiline?: boolean;
  numberOfLines?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  iconLibrary = 'material',
  onRightIconPress,
  containerStyle,
  inputStyle,
  secureTextEntry,
  multiline = false,
  numberOfLines = 1,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return isPasswordVisible ? 'visibility' : 'visibility-off';
    }
    return rightIcon;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          multiline && styles.inputContainerMultiline,
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Icon
              name={leftIcon}
              library={iconLibrary}
              size={20}
              color={isFocused ? colors.primary : colors.text.secondary}
            />
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
          placeholderTextColor={colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...textInputProps}
        />

        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={handleRightIconPress}
            disabled={!secureTextEntry && !onRightIconPress}
          >
            <Icon
              name={renderRightIcon() || ''}
              library={iconLibrary}
              size={20}
              color={isFocused ? colors.primary : colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border.light,
    borderRadius: 8,
    backgroundColor: colors.background.primary,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background.primary,
  },
  inputContainerError: {
    borderColor: colors.status.error,
  },
  inputContainerMultiline: {
    alignItems: 'flex-start',
    minHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  inputMultiline: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  leftIconContainer: {
    paddingLeft: 16,
    justifyContent: 'center',
  },
  rightIconContainer: {
    paddingRight: 16,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: colors.status.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
