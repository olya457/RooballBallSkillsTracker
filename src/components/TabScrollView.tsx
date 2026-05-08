import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type TabScrollViewProps = {
  children: React.ReactNode;
  bottomInset: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const TabScrollView = ({
  children,
  bottomInset,
  contentContainerStyle,
}: TabScrollViewProps) => (
  <ScrollView
    style={styles.scroll}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={[
      styles.content,
      {paddingBottom: bottomInset + 24},
      contentContainerStyle,
    ]}>
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
});
