import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, TextInput,
  StyleSheet,
} from 'react-native';
import { useStore } from '@/lib/store';
import { SECTIONS } from '@/lib/types';
import { C } from '@/constants/Colors';

const uid = () => 'r' + Date.now() + Math.random().toString(36).slice(2, 6);

interface IngForm { name: string; qty: string; unit: string; section: string }

export default function RecipesScreen() {
  const { recipes, addRecipe, updateRecipe, deleteRecipe } = useStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [ings, setIngs] = useState<IngForm[]>([{ name: '', qty: '', unit: '', section: SECTIONS[0] }]);

  const filtered = search
    ? recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    : recipes;

  const resetForm = () => {
    setName('');
    setIngs([{ name: '', qty: '', unit: '', section: SECTIONS[0] }]);
    setEditId(null);
    setShowForm(false);
  };

  const startEdit = (r: typeof recipes[0]) => {
    setName(r.name);
    setIngs(r.ingredients.map(i => ({ ...i, qty: String(i.qty) })));
    setEditId(r.id);
    setShowForm(true);
  };

  const save = () => {
    const validIngs = ings.filter(i => i.name.trim());
    if (!name.trim() || validIngs.length === 0) return;
    const recipe = {
      id: editId || uid(),
      name: name.trim(),
      cal: 0,
      ingredients: validIngs.map(i => ({ ...i, qty: Number(i.qty) || 0 })),
    };
    if (editId) updateRecipe(recipe);
    else addRecipe(recipe);
    resetForm();
  };

  const updateIng = (idx: number, field: keyof IngForm, val: string) => {
    const newIngs = [...ings];
    newIngs[idx] = { ...newIngs[idx], [field]: val };
    setIngs(newIngs);
  };

  return (
    <View style={s.container}>
      <TextInput
        placeholder="Buscar receta..."
        placeholderTextColor={C.text3}
        value={search}
        onChangeText={setSearch}
        style={s.input}
      />

      <TouchableOpacity style={s.addBtn} onPress={() => { resetForm(); setShowForm(true); }}>
        <Text style={s.addBtnText}>+ Añadir nueva receta</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map(r => (
          <View key={r.id} style={s.card}>
            <View style={s.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.cardName}>{r.name}</Text>
                {r.cal > 0 && <Text style={s.cardCal}>{r.cal} kcal / 2 pers.</Text>}
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity style={s.editBtn} onPress={() => startEdit(r)}>
                  <Text style={s.editBtnText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.deleteBtn} onPress={() => deleteRecipe(r.id)}>
                  <Text style={s.deleteBtnText}>Borrar</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={s.ingList}>
              {r.ingredients.map((ing, i) => (
                <Text key={i} style={s.ingChip}>{ing.qty}{ing.unit} {ing.name}</Text>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={showForm} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <ScrollView contentContainerStyle={s.modalScroll}>
            <View style={s.modalContent}>
              <Text style={s.modalTitle}>{editId ? 'Editar receta' : 'Nueva receta'}</Text>
              <TextInput
                placeholder="Nombre de la receta"
                placeholderTextColor={C.text3}
                value={name}
                onChangeText={setName}
                style={[s.input, { marginBottom: 16 }]}
              />
              <Text style={s.ingsLabel}>Ingredientes (para 2 personas)</Text>
              {ings.map((ing, idx) => (
                <View key={idx} style={s.ingRow}>
                  <TextInput placeholder="Ingrediente" placeholderTextColor={C.text3} value={ing.name} onChangeText={v => updateIng(idx, 'name', v)} style={[s.smallInput, { flex: 2 }]} />
                  <TextInput placeholder="Qty" placeholderTextColor={C.text3} keyboardType="numeric" value={ing.qty} onChangeText={v => updateIng(idx, 'qty', v)} style={[s.smallInput, { width: 50 }]} />
                  <TextInput placeholder="Ud" placeholderTextColor={C.text3} value={ing.unit} onChangeText={v => updateIng(idx, 'unit', v)} style={[s.smallInput, { width: 55 }]} />
                  <TouchableOpacity onPress={() => setIngs(ings.filter((_, i) => i !== idx))}>
                    <Text style={{ color: '#ef4444', fontSize: 16 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={s.addIngBtn} onPress={() => setIngs([...ings, { name: '', qty: '', unit: '', section: SECTIONS[0] }])}>
                <Text style={s.addIngText}>+ Ingrediente</Text>
              </TouchableOpacity>
              <View style={s.formActions}>
                <TouchableOpacity style={s.saveBtn} onPress={save}>
                  <Text style={s.saveBtnText}>{editId ? 'Guardar cambios' : 'Guardar receta'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.cancelFormBtn} onPress={resetForm}>
                  <Text style={s.cancelFormText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, padding: 16 },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 10, fontSize: 14, color: C.text, marginBottom: 12 },
  addBtn: { padding: 12, borderWidth: 2, borderColor: C.purple + '55', borderRadius: 12, backgroundColor: C.purple + '15', alignItems: 'center', marginBottom: 16 },
  addBtnText: { color: C.purple, fontWeight: '600', fontSize: 14 },
  card: { backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: C.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontSize: 14, fontWeight: '700', color: C.white },
  cardCal: { fontSize: 12, color: C.purple },
  editBtn: { backgroundColor: C.purple + '20', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  editBtnText: { color: C.purple, fontSize: 12 },
  deleteBtn: { backgroundColor: 'rgba(239,68,68,0.15)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  deleteBtnText: { color: '#ef4444', fontSize: 12 },
  ingList: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: 6 },
  ingChip: { backgroundColor: C.card2, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5, fontSize: 11, color: C.text2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalScroll: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: C.card, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: C.border },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.white, marginBottom: 16 },
  ingsLabel: { fontWeight: '600', fontSize: 13, color: C.text2, marginBottom: 8 },
  ingRow: { flexDirection: 'row', gap: 5, marginBottom: 6, alignItems: 'center' },
  smallInput: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 6, padding: 8, fontSize: 13, color: C.text },
  addIngBtn: { borderWidth: 1, borderColor: C.purple + '55', borderRadius: 8, padding: 6, paddingHorizontal: 12, backgroundColor: C.purple + '10', alignSelf: 'flex-start', marginTop: 4 },
  addIngText: { color: C.purple, fontSize: 13 },
  formActions: { flexDirection: 'row', gap: 8, marginTop: 20 },
  saveBtn: { flex: 1, padding: 12, backgroundColor: C.purple, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { color: C.white, fontWeight: '600', fontSize: 14 },
  cancelFormBtn: { flex: 1, padding: 12, backgroundColor: C.card2, borderRadius: 10, alignItems: 'center' },
  cancelFormText: { color: C.text2, fontSize: 14 },
});
