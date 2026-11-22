import { Tabs } from 'expo-router';
import { Activity, Camera, Settings, Users } from 'lucide-react-native';
import { colors } from '@/lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orangeBright,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          height: 72,
          paddingTop: 10,
          paddingBottom: 10,
          borderTopColor: '#232b36',
          backgroundColor: '#0b0d13',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'QG', tabBarIcon: ({ color }) => <Activity size={20} color={color} /> }} />
      <Tabs.Screen name="heroes" options={{ title: 'Héros', tabBarIcon: ({ color }) => <Users size={20} color={color} /> }} />
      <Tabs.Screen name="captures" options={{ title: 'Captures', tabBarIcon: ({ color }) => <Camera size={20} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Réglages', tabBarIcon: ({ color }) => <Settings size={20} color={color} /> }} />
    </Tabs>
  );
}
