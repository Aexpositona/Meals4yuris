import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { useStore } from '@/lib/store';
import { SECTIONS } from '@/lib/types';
import { BASE_PANTRY_ITEMS } from '@/lib/recipes';
import { C } from '@/constants/Colors';

export default function PantryScreen() {
  const { recipes, pantry, customPantryItems, togglePantry, setCustomPantryItems } = useStore();
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('');

  const getAllItems = () => {
    const grouped: Record<string, string[]> = {};
    SECTIONS.forEach(section => {
      const base = BASE_PANTRY_ITEMS[section] || [];
      const custom = customPantryItems[section] || [];
      const recipeItems: string[] = [];
      recipes.forEach(r => r.ingredients.forEach(ing => {
        if (ing.section === section
          && !base.some(b => b.toLowerCase() === ing.name.toLowerCase())
          && !custom.some(c => c.toLowerCase() === ing.name.toLowerCase()))
          recipeItems.push(ing.name);
      }));
      const unique: string[] = [];
      const seen = new Set<string>();
      [...base, ...custom, ...recipeItems].forEach(n => {
        const k = n.toLowerCase();
        if (!seen.has(k)) { seen.add(k); unique.push(n); }
      });
      if (unique.length > 0) grouped[section] = unique;
    });
    return grouped;
  };

  const allItems = getAllItems();
  let totalHave = 0, totalMissing = 0;
  const haveSections: Record<string, string[]> = {};
  const missingSections: Record<string, string[]> = {};

  SECTIONS.forEach(section => {
    const items = allItems[section];
    if (!items) return;
    const have = items.filter(n => pantry[n.toLowerCase()]);
    const missing = items.filter(n => !pantry[n.toLowerCase()]);
    if (have.length > 0) haveSections[section] = have;
    if (missing.length > 0) missingSections[section] = missing;
    totalHave += have.length;
    totalMissing += missing.length;
  });

  const addCustom = (section: string) => {
    if (!newItem.trim()) return;
    setCustomPantryItems({
      ...customPantryItems,
      [section]: [...(customPantryItems[section] || []), newItem.trim()],
    });
    setNewItem('');
    setAddingTo(null);
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <Text style={s.hint}>Toca un producto para moverlo entre secciones</Text>

      {/* En casa */}
      <View style={s.haveSection}>
        <View style={s.sectionHeader}>
          <View style={[s.icon, { backgroundColor: C.green }]}><Text style={s.iconText}>✓</Text></View>
          <Text style={[s.sectionTitle, { color: C.green }]}>En casa</Text>
          <View style={[s.badge, { backgroundColor: C.green + '20' }]}>
            <Text style={[s.badgeText, { color: C.green }]}>{totalHave}</Text>
          </View>
        </View>
        {totalHave === 0 && <Text style={s.emptyText}>Nada marcado aún</Text>}
        {SECTIONS.map(section => {
          const items = haveSections[section];
          if (!items) return null;
          return (
            <View key={section} style={{ marginBottom: 10 }}>
              <Text style={[s.subTitle, { color: C.green }]}>{section}</Text>
              <View style={s.chipRow}>
                {items.map((name, i) => (
                  <TouchableOpacity key={i} onPress={() => togglePantry(name)}>
                    <Text style={s.haveChip}>{name} ✓</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
      </View>

      {/* Falta */}
      <View style={s.missingSection}>
        <View style={s.sectionHeader}>
          <View style={[s.icon, { backgroundColor: C.red }]}><Text style={s.iconText}>✕</Text></View>
          <Text style={[s.sectionTitle, { color: C.red }]}>Falta</Text>
          <View style={[s.badge, { backgroundColor: C.red + '20' }]}>
            <Text style={[s.badgeText, { color: C.red }]}>{totalMissing}</Text>
          </View>
        </View>
        {totalMissing === 0 && <Text style={s.emptyText}>Lo tienes todo!</Text>}
        {SECTIONS.map(section => {
          const items = missingSections[section];
          if (!items) return null;
          return (
            <View key={section} style={{ marginBottom: 10 }}>
              <Text style={[s.subTitle, { color: C.red }]}>{section}</Text>
              <View style={s.chipRow}>
                {items.map((name, i) => (
                  <TouchableOpacity key={i} onPress={() => togglePantry(name)}>
                    <Text style={s.missingChip}>{name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {addingTo === section ? (
                <View style={s.addRow}>
                  <TextInput
                    placeholder="Nuevo producto..."
                    placeholderTextColor={C.text3}
                    value={newItem}
                    onChangeText={setNewItem}
                    onSubmitEditing={() => addCustom(section)}
                    autoFocus
                    style={s.addInput}
                  />
                  <TouchableOpacity style={s.okBtn} onPress={() => addCustom(section)}>
                    <Text style={s.okText}>OK</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setAddingTo(section)}>
                  <Text style={s.addLink}>+ Añadir</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, padding: 16 },
  hint: { color: C.text2, fontSize: 13, textAlign: 'center', marginBottom: 16 },
  haveSection: { backgroundColor: C.green + '08', borderWidth: 1, borderColor: C.green + '25', borderRadius: 14, padding: 16, marginBottom: 16 },
  missingSection: { backgroundColor: C.red + '08', borderWidth: 1, borderColor: C.red + '25', borderRadius: 14, padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  icon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: C.white, fontSize: 15 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  badge: { borderRadius: 99, paddingHorizontal: 9, paddingVertical: 2 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  subTitle: { fontSize: 12, fontWeight: '700', marginBottom: 5, opacity: 0.8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  haveChip: { backgroundColor: C.green + '18', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, fontSize: 12, color: C.green, borderWidth: 1, borderColor: C.green + '30', overflow: 'hidden' },
  missingChip: { backgroundColor: C.card, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, fontSize: 12, color: C.text, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  emptyText: { color: C.text3, fontSize: 13, textAlign: 'center', marginTop: 8 },
  addRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  addInput: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 7, padding: 7, fontSize: 12, color: C.text },
  okBtn: { padding: 7, paddingHorizontal: 12, backgroundColor: C.purple, borderRadius: 7 },
  okText: { color: C.white, fontSize: 12, fontWeight: '600' },
  addLink: { marginTop: 5, color: C.text3, fontSize: 11, borderWidth: 1, borderColor: C.border, borderRadius: 7, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', overflow: 'hidden' },
});
