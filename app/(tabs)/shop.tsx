import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '@/lib/store';
import { SECTIONS } from '@/lib/types';
import { C } from '@/constants/Colors';

export default function ShopScreen() {
  const { recipes, plan, pantry, checkedItems, weekTab, setWeekTab, toggleChecked, clearChecked } = useStore();

  const getShoppingList = () => {
    const items: Record<string, { name: string; qty: number; unit: string; section: string; qty2?: number; unit2?: string }> = {};
    Object.entries(plan).forEach(([key, rid]) => {
      if (!key.startsWith(weekTab + '-')) return;
      const recipe = recipes.find(r => r.id === rid);
      if (!recipe) return;
      recipe.ingredients.forEach(ing => {
        const k = ing.name.toLowerCase();
        if (pantry[k]) return;
        if (items[k]) {
          if (items[k].unit === ing.unit) items[k].qty += ing.qty;
          else { items[k].qty2 = (items[k].qty2 || 0) + ing.qty; items[k].unit2 = ing.unit; }
        } else {
          items[k] = { ...ing };
        }
      });
    });
    const grouped: Record<string, typeof items[string][]> = {};
    SECTIONS.forEach(s => { grouped[s] = []; });
    Object.values(items).forEach(i => {
      const sec = i.section || '🛒 Otros';
      if (!grouped[sec]) grouped[sec] = [];
      grouped[sec].push(i);
    });
    return grouped;
  };

  const shoppingList = getShoppingList();
  const totalItems = Object.values(shoppingList).flat().length;

  return (
    <View style={s.container}>
      <View style={s.weekTabs}>
        <TouchableOpacity
          style={[s.weekTab, weekTab === 'this' && s.weekTabActive]}
          onPress={() => setWeekTab('this')}>
          <Text style={[s.weekTabText, weekTab === 'this' && s.weekTabTextActive]}>Esta semana</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.weekTab, weekTab === 'next' && s.weekTabActive]}
          onPress={() => setWeekTab('next')}>
          <Text style={[s.weekTabText, weekTab === 'next' && s.weekTabTextActive]}>Próxima</Text>
        </TouchableOpacity>
      </View>

      {totalItems === 0 ? (
        <View style={s.empty}>
          <Text style={{ fontSize: 40 }}>🛒</Text>
          <Text style={s.emptyText}>Asigna recetas a la semana para generar la lista</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {SECTIONS.map(section => {
            const items = shoppingList[section] || [];
            if (items.length === 0) return null;
            return (
              <View key={section} style={{ marginBottom: 18 }}>
                <Text style={s.sectionTitle}>{section}</Text>
                {items.map((item, i) => {
                  const ck = `${weekTab}-${section}-${item.name}`;
                  const checked = !!checkedItems[ck];
                  return (
                    <TouchableOpacity key={i} style={[s.item, checked && s.itemChecked]} onPress={() => toggleChecked(ck)}>
                      <View style={[s.checkbox, checked && s.checkboxChecked]}>
                        {checked && <Text style={s.checkmark}>✓</Text>}
                      </View>
                      <Text style={[s.itemName, checked && s.itemNameChecked]}>{item.name}</Text>
                      <Text style={s.itemQty}>
                        {item.qty} {item.unit}{item.qty2 ? ` + ${item.qty2} ${item.unit2}` : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
          <TouchableOpacity style={s.clearBtn} onPress={clearChecked}>
            <Text style={s.clearText}>Desmarcar todo</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, padding: 16 },
  weekTabs: { flexDirection: 'row', gap: 4, backgroundColor: C.card2, borderRadius: 10, padding: 4, marginBottom: 16 },
  weekTab: { flex: 1, padding: 8, borderRadius: 8, alignItems: 'center' },
  weekTabActive: { backgroundColor: C.green },
  weekTabText: { color: C.text2, fontSize: 13, fontWeight: '500' },
  weekTabTextActive: { color: C.white, fontWeight: '700' },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 14, color: C.text3, marginTop: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: C.green, marginBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, paddingHorizontal: 14, backgroundColor: C.card, borderRadius: 10, marginBottom: 5, borderWidth: 1, borderColor: C.border },
  itemChecked: { opacity: 0.6 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: C.text3, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: C.purple, borderWidth: 0 },
  checkmark: { color: C.white, fontSize: 14, fontWeight: '700' },
  itemName: { flex: 1, fontSize: 14, color: C.text },
  itemNameChecked: { textDecorationLine: 'line-through', color: C.text3 },
  itemQty: { fontSize: 13, color: C.text2, fontWeight: '500' },
  clearBtn: { padding: 12, borderWidth: 1, borderColor: C.border, borderRadius: 10, backgroundColor: C.card, alignItems: 'center', marginTop: 8 },
  clearText: { color: C.text2, fontSize: 13 },
});
