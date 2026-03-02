import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { C } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Pantalla no encontrada</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Volver al inicio</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: C.bg },
  title: { fontSize: 20, fontWeight: 'bold', color: C.text },
  link: { marginTop: 15, paddingVertical: 15 },
  linkText: { fontSize: 14, color: C.purple },
});
