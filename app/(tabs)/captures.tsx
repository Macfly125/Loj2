import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CheckCircle2, FileImage, Info, ScanLine, Upload } from 'lucide-react-native';
import { AppHeader } from '@/components/AppHeader';
import { SectionTitle } from '@/components/SectionTitle';
import { TacticalCard } from '@/components/TacticalCard';
import { formatSyncTime, loadImports, markAccountSynchronized, saveScreenshotImport, ScreenshotImport } from '@/lib/coach';
import { colors, spacing } from '@/lib/theme';

export default function CapturesScreen() {
  const [previewUris, setPreviewUris] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [imports, setImports] = useState<ScreenshotImport[]>([]);
  const [picking, setPicking] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [lastSynchronizedAt, setLastSynchronizedAt] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadImports().then(setImports).catch(() => setError('Historique indisponible pour le moment.'));
  }, []);

  async function chooseCapture() {
    setMessage('');
    setError('');
    setPicking(true);
    setProcessedCount(0);
    let savedCount = 0;
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError('Autorise l’accès aux photos pour importer une capture du jeu.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        selectionLimit: 0,
        quality: 0.85,
      });
      if (result.canceled || !result.assets.length) return;

      const assets = result.assets;
      const names = assets.map((asset, index) => asset.fileName ?? `capture-land-of-jail-${index + 1}.png`);
      const batchId = `batch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setPreviewUris(assets.slice(0, 4).map((asset) => asset.uri));
      setFileNames(names);
      setSelectedCount(assets.length);

      for (let index = 0; index < names.length; index += 1) {
        const saved = await saveScreenshotImport(names[index], { id: batchId, position: index + 1, total: names.length });
        savedCount += 1;
        setProcessedCount(savedCount);
        setImports((current) => [saved, ...current]);
      }
      const syncedAt = await markAccountSynchronized();
      setLastSynchronizedAt(syncedAt);
      setMessage(`${savedCount} capture${savedCount > 1 ? 's' : ''} ajoutée${savedCount > 1 ? 's' : ''} automatiquement. Compte synchronisé à ${formatSyncTime(syncedAt)}.`);
    } catch {
      setError(savedCount > 0
        ? `${savedCount} capture${savedCount > 1 ? 's ont été ajoutées' : ' a été ajoutée'}, mais le compte n’a pas pu être synchronisé.`
        : 'Les captures n’ont pas pu être enregistrées. Vérifie les images sélectionnées et réessaie.');
    } finally {
      setPicking(false);
    }
  }

  return (
    <View style={styles.screen}>
      <AppHeader subtitle="Lecture automatique du compte" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>SYNCHRONISATION</Text>
        <Text style={styles.heading}>Captures de jeu</Text>
        <Text style={styles.intro}>Importe une capture de ton compte pour garder ton suivi à jour et retrouver tes recommandations au même endroit.</Text>

        <TacticalCard accent style={styles.importCard}>
          <View style={styles.scannerFrame}>
            {previewUris.length > 0 ? (
              <View style={styles.previewGrid}>
                {previewUris.map((uri, index) => (
                  <View style={styles.previewTile} key={`${uri}-${index}`}>
                    <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
                    <View style={styles.previewIndex}><Text style={styles.previewIndexText}>{index + 1}</Text></View>
                  </View>
                ))}
                {fileNames.length > 4 && <View style={styles.moreTile}><Text style={styles.moreTileText}>+{fileNames.length - 4}</Text></View>}
              </View>
            ) : (
              <>
                <ScanLine size={34} color={colors.orangeBright} />
                <Text style={styles.scannerTitle}>ZONE DE LECTURE</Text>
                <Text style={styles.scannerHint}>Sélectionne plusieurs captures de profil, héros ou événement</Text>
              </>
            )}
          </View>
          <Pressable onPress={chooseCapture} disabled={picking} style={({ pressed }) => [styles.importButton, pressed && styles.pressedButton]}>
            {picking ? <ActivityIndicator color={colors.background} /> : <Upload size={18} color={colors.background} />}
            <Text style={styles.importButtonText}>{picking ? 'TRAITEMENT AUTOMATIQUE' : 'IMPORTER PLUSIEURS CAPTURES'}</Text>
          </Pressable>
          {fileNames.length > 0 && <View style={styles.fileName}><FileImage size={14} color={colors.textMuted} /><Text style={styles.fileNameText}>{fileNames.length} capture{fileNames.length > 1 ? 's' : ''} sélectionnée{fileNames.length > 1 ? 's' : ''}</Text></View>}
          {picking && <View style={styles.processingRow}><ActivityIndicator size="small" color={colors.orangeBright} /><Text style={styles.processingText}>{processedCount} / {selectedCount || '…'} capture{selectedCount > 1 ? 's' : ''} traitée{selectedCount > 1 ? 's' : ''}</Text></View>}
        </TacticalCard>

        {message ? <View style={styles.successBar}><CheckCircle2 size={17} color={colors.green} /><View style={styles.feedbackCopy}><Text style={styles.successText}>{message}</Text>{lastSynchronizedAt ? <Text style={styles.syncDetail}>Dernière modification du compte : {formatSyncTime(lastSynchronizedAt)}</Text> : null}</View></View> : null}
        {error ? <View style={styles.errorBar}><Info size={17} color={colors.yellow} /><Text style={styles.errorText}>{error}</Text></View> : null}

        <SectionTitle eyebrow="SUGGESTION ACTIVE" title="Prochaine analyse" />
        <TacticalCard style={styles.analysisCard}>
          <View style={styles.analysisIcon}><Camera size={20} color={colors.orangeBright} /></View>
          <View style={styles.analysisBody}><Text style={styles.analysisTitle}>Données ajoutées automatiquement</Text><Text style={styles.analysisText}>Chaque capture est enregistrée dans le lot et synchronise la date du compte. La lecture des niveaux dans l’image nécessitera le moteur OCR.</Text></View>
          <Text style={styles.analysisStatus}>À FAIRE</Text>
        </TacticalCard>

        <SectionTitle eyebrow="ARCHIVE LOCALE" title="Dernières captures" action={`${imports.length} import`} />
        <TacticalCard style={styles.historyCard}>
          {imports.length ? imports.slice(0, 8).map((item, index) => <View style={styles.historyRow} key={item.id}><View style={styles.historyNumber}><Text style={styles.historyNumberText}>{String(index + 1).padStart(2, '0')}</Text></View><View style={styles.historyInfo}><Text style={styles.historyFile} numberOfLines={1}>{item.file_name}</Text><Text style={styles.historySummary}>{item.batch_total && item.batch_total > 1 ? `Lot ${item.batch_position}/${item.batch_total} · ` : ''}{item.summary}</Text></View><CheckCircle2 size={16} color={colors.green} /></View>) : <View style={styles.emptyHistory}><Text style={styles.emptyTitle}>Aucune capture enregistrée</Text><Text style={styles.emptyText}>Ton premier import apparaîtra ici.</Text></View>}
        </TacticalCard>
        <Text style={styles.note}>Conseil : capture l’écran complet pour que les niveaux, ressources et héros soient lisibles en une seule fois.</Text>
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
  importCard: { padding: 14, marginBottom: 18 },
  scannerFrame: { minHeight: 166, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', backgroundColor: '#0a0c11', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  previewGrid: { width: '100%', minHeight: 166, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 6, padding: 8 },
  previewTile: { width: '23%', height: 140, position: 'relative', borderWidth: 1, borderColor: colors.orange },
  preview: { width: '100%', height: '100%' },
  previewIndex: { position: 'absolute', left: 4, bottom: 4, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.orange },
  previewIndexText: { color: colors.background, fontSize: 10, fontWeight: '900' },
  moreTile: { width: '23%', height: 140, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  moreTileText: { color: colors.orangeBright, fontSize: 18, fontWeight: '900' },
  scannerTitle: { color: colors.orangeBright, fontSize: 11, fontWeight: '900', letterSpacing: 1.4, marginTop: 12 },
  scannerHint: { color: colors.textDim, fontSize: 11, marginTop: 5, textAlign: 'center', paddingHorizontal: 20 },
  importButton: { minHeight: 48, paddingHorizontal: 12, marginTop: 14, backgroundColor: colors.orange, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: 3 },
  pressedButton: { backgroundColor: colors.orangeBright },
  importButtonText: { color: colors.background, fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  fileName: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  fileNameText: { color: colors.textMuted, fontSize: 11 },
  processingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 11 },
  processingText: { color: colors.orangeBright, fontSize: 11, fontWeight: '800' },
  successBar: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 11, borderWidth: 1, borderColor: '#416437', backgroundColor: '#172516', marginBottom: 18 },
  feedbackCopy: { flex: 1 },
  successText: { color: colors.green, fontSize: 12, lineHeight: 17 },
  syncDetail: { color: colors.textMuted, fontSize: 10, marginTop: 4 },
  errorBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 11, borderWidth: 1, borderColor: '#6c552b', backgroundColor: '#241e12', marginBottom: 18 },
  errorText: { color: colors.yellow, fontSize: 12, flex: 1, lineHeight: 17 },
  analysisCard: { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 28 },
  analysisIcon: { width: 38, height: 38, backgroundColor: colors.orangeSoft, borderWidth: 1, borderColor: colors.orange, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  analysisBody: { flex: 1 },
  analysisTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  analysisText: { color: colors.textMuted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  analysisStatus: { color: colors.orangeBright, fontSize: 9, fontWeight: '900', letterSpacing: 1, marginLeft: 8 },
  historyCard: { paddingHorizontal: 14, marginBottom: 14 },
  historyRow: { minHeight: 65, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, gap: 10 },
  historyNumber: { width: 29, height: 29, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  historyNumberText: { color: colors.orangeBright, fontSize: 10, fontWeight: '900' },
  historyInfo: { flex: 1, minWidth: 0 },
  historyFile: { color: colors.text, fontSize: 12, fontWeight: '800' },
  historySummary: { color: colors.textDim, fontSize: 10, marginTop: 4 },
  emptyHistory: { paddingVertical: 23, alignItems: 'center' },
  emptyTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  emptyText: { color: colors.textDim, fontSize: 11, marginTop: 5 },
  note: { color: colors.textDim, fontSize: 11, lineHeight: 17, textAlign: 'center', paddingHorizontal: 12 },
});
