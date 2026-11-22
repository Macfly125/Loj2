import { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Activity, Building2, ChevronRight, Clock3, Flame, RefreshCw, Shield, Sparkles, Target, TrendingUp, Zap } from 'lucide-react-native';
import { AppHeader } from '@/components/AppHeader';
import { HeroAvatar } from '@/components/HeroAvatar';
import { SectionTitle } from '@/components/SectionTitle';
import { TacticalCard } from '@/components/TacticalCard';
import { Account, CoachEvent, fallbackAccount, fallbackEvents, fallbackPriorities, formatPower, formatSyncTime, loadDashboardData, Priority } from '@/lib/coach';
import { colors, spacing } from '@/lib/theme';

function PriorityIcon({ type }: { type: string }) {
  if (type === 'building') return <Building2 size={21} color={colors.orangeBright} />;
  if (type === 'shield') return <Shield size={21} color={colors.orangeBright} />;
  return <Sparkles size={21} color={colors.orangeBright} />;
}

function ResourceBar({ label, current, capacity, icon }: { label: string; current: number; capacity: number; icon: 'zap' | 'clock' }) {
  const fill = Math.min(current / capacity, 1);
  return (
    <View style={styles.resourceRow}>
      <View style={styles.resourceLabel}>
        {icon === 'zap' ? <Zap size={15} color={colors.orangeBright} /> : <Clock3 size={15} color={colors.orangeBright} />}
        <Text style={styles.resourceName}>{label}</Text>
      </View>
      <View style={styles.resourceTrack}>
        <View style={[styles.resourceFill, { width: `${fill * 100}%` }]} />
      </View>
      <Text style={styles.resourceValue}>{current}/{capacity}</Text>
    </View>
  );
}

function PriorityRow({ item }: { item: Priority }) {
  return (
    <TacticalCard style={styles.priorityCard}>
      <View style={styles.rankBlock}>
        <Text style={styles.rankNumber}>{item.rank}</Text>
      </View>
      <View style={styles.priorityIcon}><PriorityIcon type={item.icon} /></View>
      <View style={styles.priorityBody}>
        <Text style={styles.priorityTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.prioritySubtitle}>{item.subtitle}</Text>
        {item.progress > 0 && (
          <View style={styles.progressLine}>
            <Text style={styles.progressText}>{item.progress}%</Text>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${item.progress}%` }]} /></View>
          </View>
        )}
      </View>
      <ChevronRight size={17} color={colors.textDim} />
    </TacticalCard>
  );
}

function EventCard({ event }: { event: CoachEvent }) {
  return (
    <TacticalCard accent style={styles.eventCard}>
      <View style={styles.eventTopline}>
        <View style={styles.eventLabel}><Flame size={14} color={colors.orangeBright} /><Text style={styles.eventTag}>{event.tag}</Text></View>
        <Text style={styles.eventTimer}>{event.time_remaining}</Text>
      </View>
      <Text style={styles.eventName}>Événement {event.name}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>
      <View style={styles.teamRow}>
        <View style={styles.teamAvatars}>
          {event.recommended_heroes.map((hero) => <HeroAvatar key={hero} name={hero} size={36} />)}
        </View>
        <View>
          <Text style={styles.teamLabel}>ÉQUIPE RECOMMANDÉE</Text>
          <Text style={styles.teamNames}>{event.recommended_heroes.join('  ·  ')}</Text>
        </View>
      </View>
    </TacticalCard>
  );
}

export default function DashboardScreen() {
  const [account, setAccount] = useState<Account>(fallbackAccount);
  const [priorities, setPriorities] = useState<Priority[]>(fallbackPriorities);
  const [events, setEvents] = useState<CoachEvent[]>(fallbackEvents);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError('');
    try {
      const data = await loadDashboardData();
      setAccount(data.account);
      setPriorities(data.priorities);
      setEvents(data.events);
    } catch {
      setError('Synchronisation indisponible. Les dernières données connues restent affichées.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <View style={styles.screen}>
      <AppHeader subtitle={`Compte connecté · niv. ${account.commander_level}`} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.orange} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroIntro}>
          <View>
            <Text style={styles.kicker}>ANALYSE DU JOUR · 08:42</Text>
            <Text style={styles.heading}>Priorités du jour</Text>
            <Text style={styles.introCopy}>Les meilleures actions pour faire progresser ton compte.</Text>
            <View style={styles.syncLine}><Activity size={13} color={colors.green} /><Text style={styles.syncText}>Compte synchronisé à {formatSyncTime(account.updated_at)}</Text></View>
          </View>
          <Pressable style={styles.refreshButton} onPress={refresh} accessibilityLabel="Rafraîchir l'analyse">
            <RefreshCw size={18} color={colors.orangeBright} />
          </Pressable>
        </View>

        {error ? <View style={styles.errorBar}><Activity size={16} color={colors.yellow} /><Text style={styles.errorText}>{error}</Text></View> : null}

        <TacticalCard accent style={styles.powerCard}>
          <View style={styles.powerHeader}><View style={styles.powerLabel}><TrendingUp size={16} color={colors.orangeBright} /><Text style={styles.powerCaption}>PUISSANCE GLOBALE</Text></View><Text style={styles.delta}>+{account.power_delta}%</Text></View>
          <View style={styles.powerLine}><Text style={styles.powerValue}>{formatPower(account.power)}</Text><Text style={styles.powerHint}>cette semaine</Text></View>
          <View style={styles.resourceDivider} />
          <ResourceBar label="Énergie" current={account.top_current} capacity={account.top_capacity} icon="zap" />
          <ResourceBar label="Minéraux" current={account.mid_current} capacity={account.mid_capacity} icon="clock" />
        </TacticalCard>

        <SectionTitle eyebrow="PLAN D'ACTION" title="Tâches urgentes" action={`${priorities.length} actions`} />
        <View style={styles.listGap}>{priorities.map((item) => <PriorityRow item={item} key={item.id} />)}</View>

        <SectionTitle eyebrow="À NE PAS MANQUER" title="Événements actifs" />
        <View style={styles.listGap}>{events.length ? events.map((event) => <EventCard event={event} key={event.id} />) : <Text style={styles.emptyText}>Aucun événement actif détecté.</Text>}</View>

        <View style={styles.footerNote}><Target size={15} color={colors.textDim} /><Text style={styles.footerText}>Mise à jour automatique à chaque synchronisation de capture.</Text></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 32, maxWidth: 720, width: '100%', alignSelf: 'center' },
  heroIntro: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 12, marginBottom: 18 },
  kicker: { color: colors.orange, fontSize: 10, fontWeight: '900', letterSpacing: 1.8, marginBottom: 6 },
  heading: { color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  introCopy: { color: colors.textMuted, fontSize: 13, marginTop: 7, lineHeight: 20 },
  syncLine: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  syncText: { color: colors.green, fontSize: 10, fontWeight: '800' },
  refreshButton: { width: 42, height: 42, borderRadius: 4, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  errorBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, marginBottom: 14, borderWidth: 1, borderColor: '#6c552b', backgroundColor: '#241e12' },
  errorText: { flex: 1, color: colors.yellow, fontSize: 12, lineHeight: 17 },
  powerCard: { padding: spacing.md, marginBottom: 28 },
  powerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  powerLabel: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  powerCaption: { color: colors.textMuted, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  delta: { color: colors.green, fontSize: 14, fontWeight: '900' },
  powerLine: { flexDirection: 'row', alignItems: 'baseline', gap: 9, marginTop: 9 },
  powerValue: { color: colors.orangeBright, fontSize: 42, fontWeight: '900', letterSpacing: -1.5 },
  powerHint: { color: colors.textDim, fontSize: 12 },
  resourceDivider: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
  resourceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 9, gap: 8 },
  resourceLabel: { flexDirection: 'row', alignItems: 'center', gap: 5, width: 85 },
  resourceName: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  resourceTrack: { height: 7, flex: 1, backgroundColor: colors.black, borderRadius: 2, overflow: 'hidden' },
  resourceFill: { height: '100%', backgroundColor: colors.orange, borderRadius: 2 },
  resourceValue: { width: 49, color: colors.text, fontSize: 11, fontWeight: '800', textAlign: 'right' },
  listGap: { gap: 9, marginBottom: 28 },
  priorityCard: { flexDirection: 'row', alignItems: 'center', minHeight: 74, paddingRight: 10 },
  rankBlock: { width: 45, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.orangeSoft, borderRightWidth: 1, borderRightColor: colors.orange },
  rankNumber: { color: colors.orangeBright, fontSize: 25, fontWeight: '900' },
  priorityIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceRaised },
  priorityBody: { flex: 1, minWidth: 0 },
  priorityTitle: { color: colors.text, fontSize: 14, fontWeight: '900' },
  prioritySubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  progressLine: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 7 },
  progressText: { color: colors.textMuted, fontSize: 10, width: 27 },
  progressTrack: { flex: 1, height: 5, backgroundColor: colors.black, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.orange },
  eventCard: { padding: spacing.md },
  eventTopline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eventLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eventTag: { color: colors.orangeBright, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  eventTimer: { color: colors.text, fontSize: 12, fontWeight: '900' },
  eventName: { color: colors.text, fontSize: 23, fontWeight: '900', marginTop: 14 },
  eventDescription: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18, paddingTop: 13, borderTopWidth: 1, borderTopColor: colors.border },
  teamAvatars: { flexDirection: 'row', gap: -8 },
  teamLabel: { color: colors.textDim, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  teamNames: { color: colors.orangeBright, fontSize: 12, fontWeight: '900', marginTop: 3 },
  emptyText: { color: colors.textMuted, paddingVertical: 16 },
  footerNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 2 },
  footerText: { color: colors.textDim, fontSize: 11 },
});
