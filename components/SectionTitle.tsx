import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/lib/theme';

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  action?: string;
};

export function SectionTitle({ eyebrow, title, action }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <View>
        {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>
      {action && <Text style={styles.action}>{action}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eyebrow: {
    color: colors.orange,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 3,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  action: {
    color: colors.orangeBright,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
