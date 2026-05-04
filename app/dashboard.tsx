// app/dashboard.tsx
// This file now redirects to the (tabs) layout
import { Redirect } from 'expo-router';

export default function Dashboard() {
  return <Redirect href="/(tabs)" />;
}
