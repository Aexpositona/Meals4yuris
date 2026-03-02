import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, TextInput, FlatList,
  StyleSheet,
} from 'react-native';
import { useStore } from '@/lib/store';
import { DAYS, MEALS } from '@/lib/types';
import { C } from '@/constants/Colors';

export default function PlanScreen() {
  const { recipes, plan, weekTab, setWeekTab, assignRecipe, removeFromPlan } = useStore();
  const [selectingFor, setSelectingFor] = useState<{ day: string; meal: string } | null>(null);
  const [search, setSearch] = useState('');

  const filledMeals = Object.keys(plan).filter(k => k.startsWith(weekTab + '-')).length;
  const weekCals = Object.entries(plan)
    .filter(([k]) => k.startsWith(weekTab + '-'))
    .reduce((sum, [, rid]) => {
      const r = recipes.find(x => x.id === rid);
      return sum + (r?.cal || 0);
    }, 0);
  const avgCalsPerDay = filledMeals > 0 ? Math.round(weekCals / 7) : 0;

  const filteredRecipes = search
    ? recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    : recipes;

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

      {filledMeals > 0 && (
        <View style={s.calCard}>
          <Text style={s.calLabel}>Estimación semanal: </Text>
          <Text style={[s.calValue, {
            color: avgCalsPerDay >= 2800 ? C.green : avgCalsPerDay >= 2200 ? '#d4a017' : C.red,
          }]}>{avgCalsPerDay} kcal/día</Text>
          <Text style={s.calTarget}> obj ≥ 2.800</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {DAYS.map(day => (
          <View key={day} style={s.dayBlock}>
            <Text style={s.dayTitle}>{day}</Text>
            <View style={s.mealsRow}>
              {MEALS.map(meal => {
                const key = `${weekTab}-${day}-${meal}`;
                const rid = plan[key];
                const recipe = recipes.find(r => r.id === rid);
                return (
                  <View key={meal} style={[s.mealCard, recipe && s.mealCardFilled]}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.mealLabel}>{meal}</Text>
                      {recipe ? (
                        <>
                          <Text style={s.mealName} numberOfLines={1}>{recipe.name}</Text>
                          {recipe.cal > 0 && <Text style={s.mealCal}>{recipe.cal} kcal</Text>}
                        </>
                      ) : (
                        <Text style={s.mealEmpty}>Sin asignar</Text>
                      )}
                    </View>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      {recipe && (
                        <TouchableOpacity onPress={() => removeFromPlan(day, meal)} hitSlop={8}>
                          <Text style={{ color: '#ef4444', fontSize: 16 }}>✕</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={() => { setSelectingFor({ day, meal }); setSearch(''); }} hitSlop={8}>
                        <Text style={{ color: C.purple, fontSize: 20 }}>{recipe ? '✎' : '+'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={!!selectingFor} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Elegir receta</Text>
            {selectingFor && (
              <Text style={s.modalSub}>{selectingFor.day} — {selectingFor.meal}</Text>
            )}
            <TextInput
              placeholder="Buscar receta..."
              placeholderTextColor={C.text3}
              value={search}
              onChangeText={setSearch}
              style={s.input}
            />
            <FlatList
              data={filteredRecipes}
              keyExtractor={r => r.id}
              style={{ maxHeight: 400 }}
              renderItem={({ item: r }) => (
                <TouchableOpacity
                  style={s.recipeOption}
                  onPress={() => {
                    if (selectingFor) assignRecipe(selectingFor.day, selectingFor.meal, r.id);
                    setSelectingFor(null);
                  }}>
                  <Text style={s.recipeOptionName}>{r.name}</Text>
                  {r.cal > 0 && <Text style={s.recipeOptionCal}>{r.cal} kcal</Text>}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={s.cancelBtn} onPress={() => setSelectingFor(null)}>
              <Text style={s.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, padding: 16 },
  weekTabs: { flexDirection: 'row', gap: 4, backgroundColor: C.card2, borderRadius: 10, padding: 4, marginBottom: 12 },
  weekTab: { flex: 1, padding: 8, borderRadius: 8, alignItems: 'center' },
  weekTabActive: { backgroundColor: C.green },
  weekTabText: { color: C.text2, fontSize: 13, fontWeight: '500' },
  weekTabTextActive: { color: C.white, fontWeight: '700' },
  calCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.card, borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: C.border },
  calLabel: { fontSize: 13, color: C.text2 },
  calValue: { fontSize: 15, fontWeight: '700' },
  calTarget: { fontSize: 12, color: C.text3 },
  dayBlock: { marginBottom: 14 },
  dayTitle: { fontSize: 13, color: C.purple, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  mealsRow: { flexDirection: 'row', gap: 8 },
  mealCard: { flex: 1, backgroundColor: C.card, borderRadius: 12, padding: 10, borderWidth: 2, borderColor: C.border, minHeight: 56, flexDirection: 'row', alignItems: 'center' },
  mealCardFilled: { borderColor: C.green + '44' },
  mealLabel: { fontSize: 10, color: C.text3, textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5 },
  mealName: { fontSize: 13, fontWeight: '500', color: C.white, marginTop: 2 },
  mealCal: { fontSize: 11, color: C.purple, marginTop: 1 },
  mealEmpty: { fontSize: 13, color: C.text3, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: C.card, borderRadius: 16, padding: 24, width: '90%', maxHeight: '75%', borderWidth: 1, borderColor: C.border },
  modalTitle: { fontSize: 16, fontWeight: '700', color: C.white, marginBottom: 4 },
  modalSub: { fontSize: 13, color: C.text2, marginBottom: 12 },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 10, fontSize: 14, color: C.text, marginBottom: 12 },
  recipeOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: C.card2, borderRadius: 10, marginBottom: 6, borderWidth: 1, borderColor: C.border },
  recipeOptionName: { fontSize: 13, fontWeight: '600', color: C.white, flex: 1 },
  recipeOptionCal: { fontSize: 11, color: C.purple, marginLeft: 8 },
  cancelBtn: { marginTop: 10, padding: 10, backgroundColor: C.card2, borderRadius: 8, alignItems: 'center' },
  cancelText: { color: C.text2, fontSize: 14 },
});
