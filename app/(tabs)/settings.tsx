import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { BellRing, ChevronRight, Database, Info, LockKeyhole, RefreshCw, Smartphone } from 'lucide-react-native';
import { AppHeader } from '@/components/AppHeader';
import { TacticalCard } from '@/components/TacticalCard';
import { colors, spacing } from '@/lib/theme';

function SettingRow({ icon, title, description, children, onPress }: { icon: React.ReactNode; title: string; description: string; children?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}>
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingCopy}><Text style={styles.settingTitle}>{title}</Text><Text style={styles.settingDescription}>{description}</Text></View>
      {children ?? <ChevronRight size={17} color={colors.textDim} />}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const [autoSync, setAutoSync] = useState(true);
  const [alerts, setAlerts] = useState(true);

  return (
    <View style={styles.screen}>
      <AppHeader subtitle="Configuration du QG" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>CENTRE DE COMMANDE</Text>
        <Text style={styles.heading}>Réglages</Text>
        <Text style={styles.intro}>Configure le suivi automatique et la façon dont Warden Coach te prévient.</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileMark}><Smartphone size={23} color={colors.orangeBright} /></View>
          <View style={styles.profileCopy}><Text style={styles.profileName}>Warden Kael</Text><Text style={styles.profileDetail}>Compte local · niveau 65</Text></View>
          <View style={styles.connected}><View style={styles.connectedDot} /><Text style={styles.connectedText}>ACTIF</Text></View>
        </View>

        <Text style={styles.groupTitle}>AUTOMATISATIONS</Text>
        <TacticalCard style={styles.settingsCard}>
          <SettingRow icon={<RefreshCw size={18} color={colors.orangeBright} />} title="Synchronisation automatique" description="Actualiser les conseils après chaque capture importée."><Switch value={autoSync} onValueChange={setAutoSync} trackColor={{ false: colors.border, true: colors.orangeSoft }} thumbColor={autoSync ? colors.orangeBright : colors.textDim} /></SettingRow>
          <View style={styles.divider} />
          <SettingRow icon={<BellRing size={18} color={colors.orangeBright} />} title="Alertes d’événements" description="Afficher les événements importants à l’ouverture du QG."><Switch value={alerts} onValueChange={setAlerts} trackColor={{ false: colors.border, true: colors.orangeSoft }} thumbColor={alerts ? colors.orangeBright : colors.textDim} /></SettingRow>
        </TacticalCard>

        <Text style={styles.groupTitle}>DONNÉES ET CONFIDENTIALITÉ</Text>
        <TacticalCard style={styles.settingsCard}>
          <SettingRow icon={<Database size={18} color={colors.orangeBright} />} title="Données du compte" description="Héros, événements, priorités et historique des captures." />
          <View style={styles.divider} />
          <SettingRow icon={<LockKeyhole size={18} color={colors.orangeBright} />} title="Stockage privé" description="Les captures restent sur ton appareil dans cette version." />
        </TacticalCard>

        <View style={styles.infoBox}><Info size={16} color={colors.textDim} /><Text style={styles.infoText}>Warden Coach ne se connecte pas directement au jeu. Utilise une capture après chaque session pour garder les recommandations à jour.</Text></View>
        <Text style={styles.version}>WARDEN COACH · PROTOCOLE 01.00</Text>
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
  profileCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface, padding: 14, marginBottom: 28 },
  profileMark: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.orange, backgroundColor: colors.orangeSoft, marginRight: 11 },
  profileCopy: { flex: 1 },
  profileName: { color: colors.text, fontSize: 16, fontWeight: '900' },
  profileDetail: { color: colors.textMuted, fontSize: 11, marginTop: 3 },
  connected: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  connectedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  connectedText: { color: colors.green, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  groupTitle: { color: colors.textDim, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 9 },
  settingsCard: { paddingHorizontal: 14, marginBottom: 25 },
  settingRow: { minHeight: 77, flexDirection: 'row', alignItems: 'center' },
  pressed: { opacity: 0.75 },
  settingIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, marginRight: 11 },
  settingCopy: { flex: 1, paddingRight: 10 },
  settingTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  settingDescription: { color: colors.textMuted, fontSize: 11, lineHeight: 16, marginTop: 3 },
  divider: { height: 1, backgroundColor: colors.border },
  infoBox: { flexDirection: 'row', gap: 8, padding: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginTop: 2 },
  infoText: { flex: 1, color: colors.textDim, fontSize: 11, lineHeight: 17 },
  version: { textAlign: 'center', color: colors.textDim, fontSize: 9, letterSpacing: 1.5, fontWeight: '800', marginTop: 25 },
});
