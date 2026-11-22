import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/lib/theme';

type TacticalCardProps = {
  children: ReactNode;
  accent?: boolean;
  style?: object;
};

export function TacticalCard({ children, accent = false, style }: TacticalCardProps) {
  return (
    <View style={[styles.card, accent && styles.accentCard, style]}>
      {accent && <View style={styles.glowLine} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  accentCard: {
    borderColor: colors.borderStrong,
  },
  glowLine: {
    position: 'absolute',
    top: 0,
    left: 18,
    right: 18,
    height: 2,
    backgroundColor: colors.orange,
  },
});
