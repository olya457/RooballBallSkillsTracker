import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../styles/theme';

type CompactKeyboardProps = {
  visible: boolean;
  onKey: (value: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onClear: () => void;
  onDone: () => void;
};

const letterRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

export const CompactKeyboard = ({
  visible,
  onKey,
  onBackspace,
  onSpace,
  onClear,
  onDone,
}: CompactKeyboardProps) => {
  const [shift, setShift] = useState(false);

  if (!visible) {
    return null;
  }

  const pressKey = (value: string) => {
    onKey(shift ? value.toUpperCase() : value);
  };

  return (
    <View style={styles.wrap}>
      {letterRows.map((row, rowIndex) => (
        <View
          key={row}
          style={[styles.row, rowIndex === 1 && styles.rowInset]}>
          {row.split('').map(letter => (
            <Pressable
              key={letter}
              onPress={() => pressKey(letter)}
              style={styles.key}>
              <Text style={styles.keyText}>
                {shift ? letter.toUpperCase() : letter}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
      <View style={styles.row}>
        <Pressable onPress={() => setShift(current => !current)} style={styles.actionKey}>
          <Text style={[styles.actionText, shift && styles.actionTextActive]}>
            ⇧
          </Text>
        </Pressable>
        <Pressable onPress={onSpace} style={styles.spaceKey}>
          <Text style={styles.actionText}>space</Text>
        </Pressable>
        <Pressable onPress={onBackspace} style={styles.actionKey}>
          <Text style={styles.actionText}>⌫</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        {['.', ',', '-', "'"].map(item => (
          <Pressable
            key={item}
            onPress={() => onKey(item)}
            style={styles.symbolKey}>
            <Text style={styles.keyText}>{item}</Text>
          </Pressable>
        ))}
        <Pressable onPress={onClear} style={styles.clearKey}>
          <Text style={styles.clearText}>clear</Text>
        </Pressable>
        <Pressable onPress={onDone} style={styles.doneKey}>
          <Text style={styles.doneText}>done</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(24, 22, 57, 0.96)',
    padding: 8,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  rowInset: {
    paddingHorizontal: 12,
  },
  key: {
    flex: 1,
    minHeight: 28,
    borderRadius: 8,
    backgroundColor: '#27234F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
  },
  actionKey: {
    width: 44,
    minHeight: 30,
    borderRadius: 9,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceKey: {
    flex: 1,
    minHeight: 30,
    borderRadius: 9,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolKey: {
    width: 36,
    minHeight: 30,
    borderRadius: 9,
    backgroundColor: '#27234F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearKey: {
    flex: 1,
    minHeight: 30,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#7A2233',
    backgroundColor: '#2A1428',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneKey: {
    flex: 1,
    minHeight: 30,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.yellow,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: colors.mutedStrong,
    fontSize: 12,
    fontWeight: '900',
  },
  actionTextActive: {
    color: colors.yellow,
  },
  clearText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '900',
  },
  doneText: {
    color: colors.yellow,
    fontSize: 12,
    fontWeight: '900',
  },
});
