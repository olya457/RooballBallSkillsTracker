import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {colors, shadow} from '../styles/theme';

type PrimaryButtonProps = {
  label: string;
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'ghost' | 'danger';
};

export const PrimaryButton = ({
  label,
  icon,
  onPress,
  disabled,
  loading,
  style,
  variant = 'primary',
}: PrimaryButtonProps) => {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({pressed}) => [
        styles.button,
        isPrimary && styles.primary,
        isGhost && styles.ghost,
        isDanger && styles.danger,
        isPrimary && shadow,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.bg : colors.yellow} />
      ) : (
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          maxFontSizeMultiplier={1}
          style={[
            styles.label,
            !isPrimary && styles.altLabel,
            disabled && styles.disabledText,
          ]}>
          {icon ? `${icon} ` : ''}
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  primary: {
    backgroundColor: colors.yellow,
  },
  ghost: {
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.card,
  },
  danger: {
    borderWidth: 1,
    borderColor: '#7A2233',
    backgroundColor: '#3A1224',
  },
  pressed: {
    opacity: 0.88,
    transform: [{scale: 0.99}],
  },
  disabled: {
    backgroundColor: '#302E52',
    borderColor: '#302E52',
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    includeFontPadding: false,
  },
  altLabel: {
    color: colors.yellow,
  },
  disabledText: {
    color: '#807D9D',
  },
});
