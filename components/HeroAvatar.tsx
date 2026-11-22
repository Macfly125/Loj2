import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/lib/theme';

type HeroAvatarProps = {
  name: string;
  size?: number;
  muted?: boolean;
};

const heroColors: Record<string, string> = {
  Viktor: '#6e3f2f',
  Rosa: '#733c48',
  Kane: '#31505e',
};

export function HeroAvatar({ name, size = 48, muted = false }: HeroAvatarProps) {
  const initial = name.slice(0, 1).toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, muted && styles.muted, { backgroundColor: heroColors[name] ?? colors.surfaceSoft }]}>
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{initial}</Text>
      <View style={styles.status} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 1,
    borderColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: { opacity: 0.7 },
  initial: {
    color: colors.text,
    fontWeight: '800',
  },
  status: {
    position: 'absolute',
    right: -1,
    bottom: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.background,
  },
});
