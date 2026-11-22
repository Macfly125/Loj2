import { createClient } from '@supabase/supabase-js';

export type Account = {
  id: number;
  commander_name: string;
  commander_level: number;
  power: number;
  power_delta: number;
  top_current: number;
  top_capacity: number;
  mid_current: number;
  mid_capacity: number;
  updated_at: string;
};

export type Hero = {
  id: string;
  name: string;
  role: string;
  stars: number;
  level: number;
  power: number;
  portrait_key: string;
};

export type Priority = {
  id: string;
  rank: number;
  title: string;
  subtitle: string;
  category: string;
  progress: number;
  icon: string;
};

export type CoachEvent = {
  id: string;
  name: string;
  tag: string;
  recommended_heroes: string[];
  time_remaining: string;
  description: string;
  active: boolean;
};

export type ScreenshotImport = {
  id: string;
  file_name: string;
  status: string;
  detected_at: string;
  summary: string;
  batch_id?: string | null;
  batch_position?: number | null;
  batch_total?: number | null;
};

export const fallbackAccount: Account = {
  id: 1,
  commander_name: 'Warden Kael',
  commander_level: 65,
  power: 1240000,
  power_delta: 3,
  top_current: 145,
  top_capacity: 150,
  mid_current: 50,
  mid_capacity: 62,
  updated_at: new Date().toISOString(),
};

export const fallbackHeroes: Hero[] = [
  { id: 'viktor', name: 'Viktor', role: 'Assaut', stars: 5, level: 58, power: 218400, portrait_key: 'viktor' },
  { id: 'rosa', name: 'Rosa', role: 'Soutien', stars: 4, level: 55, power: 184200, portrait_key: 'rosa' },
  { id: 'kane', name: 'Kane', role: 'Défense', stars: 4, level: 53, power: 176800, portrait_key: 'kane' },
];

export const fallbackPriorities: Priority[] = [
  { id: 'p1', rank: 1, title: 'Améliorer Cellule Bloc C niv. 18', subtitle: 'Temps estimé : 8h 14m', category: 'Bâtiment', progress: 0, icon: 'building' },
  { id: 'p2', rank: 2, title: 'Recherche Sécurité III', subtitle: 'Temps estimé : 1j 6h', category: 'Recherche', progress: 0, icon: 'shield' },
  { id: 'p3', rank: 3, title: 'Monter héros Viktor ★5', subtitle: 'Progression : 88%', category: 'Héros', progress: 88, icon: 'hero' },
];

export const fallbackEvents: CoachEvent[] = [
  {
    id: 'e1',
    name: 'Émeute',
    tag: 'ÉVÉNEMENT ACTIF',
    recommended_heroes: ['Viktor', 'Rosa', 'Kane'],
    time_remaining: '3j 14h',
    description: 'Formez une équipe équilibrée pour maximiser les récompenses de contrôle.',
    active: true,
  },
];

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function loadDashboardData() {
  if (!supabase) {
    return { account: fallbackAccount, priorities: fallbackPriorities, events: fallbackEvents };
  }

  const [accountResponse, prioritiesResponse, eventsResponse] = await Promise.all([
    supabase.from('coach_account').select('*').eq('id', 1).maybeSingle(),
    supabase.from('coach_priorities').select('*').order('rank', { ascending: true }),
    supabase.from('coach_events').select('*').eq('active', true).order('created_at', { ascending: false }),
  ]);

  if (accountResponse.error) throw accountResponse.error;
  if (prioritiesResponse.error) throw prioritiesResponse.error;
  if (eventsResponse.error) throw eventsResponse.error;

  return {
    account: (accountResponse.data as Account | null) ?? fallbackAccount,
    priorities: (prioritiesResponse.data as Priority[] | null) ?? fallbackPriorities,
    events: (eventsResponse.data as CoachEvent[] | null) ?? fallbackEvents,
  };
}

export async function loadHeroes() {
  if (!supabase) return fallbackHeroes;
  const { data, error } = await supabase.from('coach_heroes').select('*').order('power', { ascending: false });
  if (error) throw error;
  return (data as Hero[] | null) ?? fallbackHeroes;
}

export async function loadImports() {
  if (!supabase) return [] as ScreenshotImport[];
  const { data, error } = await supabase.from('coach_screenshot_imports').select('*').order('created_at', { ascending: false }).limit(8);
  if (error) throw error;
  return (data as ScreenshotImport[] | null) ?? [];
}

export async function saveScreenshotImport(fileName: string, batch?: { id: string; position: number; total: number }) {
  const summary = batch
    ? `Capture ${batch.position}/${batch.total} enregistrée automatiquement pour le suivi du compte.`
    : 'Capture enregistrée automatiquement pour le suivi du compte.';
  const batchData = batch
    ? { batch_id: batch.id, batch_position: batch.position, batch_total: batch.total }
    : {};

  if (!supabase) {
    return {
      id: `local-${Date.now()}-${fileName}`,
      file_name: fileName,
      status: 'analysed',
      detected_at: new Date().toISOString(),
      summary,
      ...batchData,
    } satisfies ScreenshotImport;
  }

  const { data, error } = await supabase
    .from('coach_screenshot_imports')
    .insert({ file_name: fileName, status: 'analysed', summary, ...batchData })
    .select('*')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('La capture n’a pas été enregistrée.');
  return data as ScreenshotImport;
}

export async function markAccountSynchronized() {
  const syncedAt = new Date().toISOString();
  if (!supabase) return syncedAt;

  const { data, error } = await supabase
    .from('coach_account')
    .update({ updated_at: syncedAt })
    .eq('id', 1)
    .select('updated_at')
    .maybeSingle();
  if (error) throw error;
  return (data as { updated_at?: string } | null)?.updated_at ?? syncedAt;
}

export function formatSyncTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'en attente';
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function formatPower(power: number) {
  if (power >= 1000000) return `${(power / 1000000).toFixed(2).replace('.', ',')} M`;
  return `${Math.round(power / 1000)} K`;
}
