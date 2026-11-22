import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bell, Shield } from 'lucide-react-native';
import { colors } from '@/lib/theme';

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  onBellPress?: () => void;
};

export function AppHeader({ title = 'Warden Coach', subtitle = 'QG tactique', onBellPress }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandGroup}>
        <View style={styles.logo}>
          <Shield size={22} color={colors.orangeBright} strokeWidth={2.5} />
        </View>
        <View>
          <Text style={styles.brand}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <Pressable onPress={onBellPress} style={styles.bellButton} accessibilityLabel="Notifications">
        <Bell size={20} color={colors.textMuted} />
        <View style={styles.dot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2530',
    backgroundColor: '#0b0d13',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.orange,
    backgroundColor: colors.orangeSoft,
    transform: [{ rotate: '45deg' }],
  },
  brand: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  bellButton: {
    position: 'relative',
    padding: 8,
  },
  dot: {
    position: 'absolute',
    right: 6,
    top: 5,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.orange,
    borderWidth: 1,
    borderColor: '#0b0d13',
  },
});
