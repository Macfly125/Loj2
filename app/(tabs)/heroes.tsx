import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, Crosshair, Shield, Sparkles, Users } from 'lucide-react-native';
import { AppHeader } from '@/components/AppHeader';
import { HeroAvatar } from '@/components/HeroAvatar';
import { SectionTitle } from '@/components/SectionTitle';
import { TacticalCard } from '@/components/TacticalCard';
import { fallbackHeroes, formatPower, Hero, loadHeroes } from '@/lib/coach';
import { colors, spacing } from '@/lib/theme';

function roleIcon(role: string) {
  if (role === 'Défense') return <Shield size={16} color={colors.orangeBright} />;
  if (role === 'Soutien') return <Sparkles size={16} color={colors.orangeBright} />;
  return <Crosshair size={16} color={colors.orangeBright} />;
}

function HeroRow({ hero }: { hero: Hero }) {
  return (
    <Pressable style={({ pressed }) => [styles.heroRow, pressed && styles.pressed]}>
      <HeroAvatar name={hero.name} size={54} />
      <View style={styles.heroInfo}>
        <View style={styles.heroTitleLine}><Text style={styles.heroName}>{hero.name}</Text><Text style={styles.stars}>{'★'.repeat(hero.stars)}</Text></View>
        <View style={styles.roleLine}>{roleIcon(hero.role)}<Text style={styles.role}>{hero.role} · Niveau {hero.level}</Text></View>
        <View style={styles.heroProgress}><View style={styles.heroTrack}><View style={[styles.heroFill, { width: `${Math.min(hero.level / 60, 1) * 100}%` }]} /></View><Text style={styles.heroPower}>{formatPower(hero.power)}</Text></View>
      </View>
      <ChevronRight size={18} color={colors.textDim} />
    </Pressable>
  );
}

export default function HeroesScreen() {
  const [heroes, setHeroes] = useState<Hero[]>(fallbackHeroes);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHeroes().then(setHeroes).catch(() => setError('Impossible de synchroniser les héros. Les dernières données sont affichées.'));
  }, []);

  const totalPower = heroes.reduce((sum, hero) => sum + hero.power, 0);

  return (
    <View style={styles.screen}>
      <AppHeader subtitle="Roster et recommandations" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>UNITÉS DISPONIBLES</Text>
        <Text style={styles.heading}>Mes héros</Text>
        <Text style={styles.intro}>Ton équipe recommandée est calculée selon l'événement actif et tes niveaux actuels.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.statsRow}>
          <TacticalCard style={styles.statCard}><Users size={18} color={colors.orangeBright} /><Text style={styles.statValue}>{heroes.length}</Text><Text style={styles.statLabel}>HÉROS ACTIFS</Text></TacticalCard>
          <TacticalCard style={styles.statCard}><Crosshair size={18} color={colors.orangeBright} /><Text style={styles.statValue}>{formatPower(totalPower)}</Text><Text style={styles.statLabel}>PUISSANCE TOTALE</Text></TacticalCard>
        </View>
        <SectionTitle eyebrow="ROSTER" title="Classement puissance" action="Trié automatiquement" />
        <TacticalCard style={styles.listCard}>{heroes.map((hero, index) => <View key={hero.id}>{index > 0 && <View style={styles.separator} />}<HeroRow hero={hero} /></View>)}</TacticalCard>
        <TacticalCard accent style={styles.tipCard}><View style={styles.tipIcon}><Sparkles size={18} color={colors.orangeBright} /></View><View style={styles.tipBody}><Text style={styles.tipTitle}>Conseil du coach</Text><Text style={styles.tipText}>Viktor est ton meilleur investissement immédiat : il complète l'Émeute et sa progression est déjà à 88%.</Text></View></TacticalCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 32, maxWidth: 720, width: '100%', alignSelf: 'center' },
  kicker: { color: colors.orange, fontSize: 10, fontWeight: '900', letterSpacing: 1.8, marginTop: 12, marginBottom: 6 },
  heading: { color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  intro: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 7, marginBottom: 20 },
  error: { color: colors.yellow, fontSize: 12, marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: { flex: 1, padding: 14, minHeight: 92 },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 10 },
  statLabel: { color: colors.textDim, fontSize: 9, fontWeight: '900', letterSpacing: 1, marginTop: 3 },
  listCard: { marginBottom: 18 },
  heroRow: { minHeight: 86, padding: 14, flexDirection: 'row', alignItems: 'center' },
  pressed: { backgroundColor: colors.surfaceRaised },
  heroInfo: { flex: 1, marginHorizontal: 12, minWidth: 0 },
  heroTitleLine: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  heroName: { color: colors.text, fontSize: 16, fontWeight: '900' },
  stars: { color: colors.orangeBright, fontSize: 11, letterSpacing: 1 },
  roleLine: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  role: { color: colors.textMuted, fontSize: 11 },
  heroProgress: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 9 },
  heroTrack: { flex: 1, height: 5, backgroundColor: colors.black, overflow: 'hidden', borderRadius: 2 },
  heroFill: { height: '100%', backgroundColor: colors.orange },
  heroPower: { color: colors.orangeBright, fontSize: 11, fontWeight: '900', width: 47, textAlign: 'right' },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 80 },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 14 },
  tipIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.orange, backgroundColor: colors.orangeSoft, marginRight: 10 },
  tipBody: { flex: 1 },
  tipTitle: { color: colors.orangeBright, fontSize: 13, fontWeight: '900' },
  tipText: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 4 },
});
