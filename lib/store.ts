import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, Plan, Pantry, CheckedItems, CustomPantryItems } from './types';
import { RECIPES } from './recipes';

const STORAGE_KEY = 'meals4yuris-data-v1';

interface AppState {
  recipes: Recipe[];
  plan: Plan;
  pantry: Pantry;
  checkedItems: CheckedItems;
  customPantryItems: CustomPantryItems;
  weekTab: 'this' | 'next';
  loaded: boolean;

  load: () => Promise<void>;
  setWeekTab: (tab: 'this' | 'next') => void;
  setRecipes: (recipes: Recipe[]) => void;
  setPlan: (plan: Plan) => void;
  setPantry: (pantry: Pantry) => void;
  setCheckedItems: (items: CheckedItems) => void;
  setCustomPantryItems: (items: CustomPantryItems) => void;
  assignRecipe: (day: string, meal: string, recipeId: string) => void;
  removeFromPlan: (day: string, meal: string) => void;
  togglePantry: (name: string) => void;
  toggleChecked: (key: string) => void;
  clearChecked: () => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
}

const persist = async (state: Partial<AppState>) => {
  const data = {
    recipes: state.recipes,
    plan: state.plan,
    pantry: state.pantry,
    checkedItems: state.checkedItems,
    customPantryItems: state.customPantryItems,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const useStore = create<AppState>((set, get) => ({
  recipes: RECIPES,
  plan: {},
  pantry: {},
  checkedItems: {},
  customPantryItems: {},
  weekTab: 'this',
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set({
          recipes: data.recipes?.length > 0 ? data.recipes : RECIPES,
          plan: data.plan ?? {},
          pantry: data.pantry ?? {},
          checkedItems: data.checkedItems ?? {},
          customPantryItems: data.customPantryItems ?? {},
          loaded: true,
        });
        return;
      }
    } catch {}
    set({ loaded: true });
  },

  setWeekTab: (tab) => set({ weekTab: tab }),

  setRecipes: (recipes) => { set({ recipes }); persist(get()); },
  setPlan: (plan) => { set({ plan }); persist(get()); },
  setPantry: (pantry) => { set({ pantry }); persist(get()); },
  setCheckedItems: (checkedItems) => { set({ checkedItems }); persist(get()); },
  setCustomPantryItems: (customPantryItems) => { set({ customPantryItems }); persist(get()); },

  assignRecipe: (day, meal, recipeId) => {
    const { plan, weekTab } = get();
    const newPlan = { ...plan, [`${weekTab}-${day}-${meal}`]: recipeId };
    set({ plan: newPlan });
    persist(get());
  },

  removeFromPlan: (day, meal) => {
    const { plan, weekTab } = get();
    const newPlan = { ...plan };
    delete newPlan[`${weekTab}-${day}-${meal}`];
    set({ plan: newPlan });
    persist(get());
  },

  togglePantry: (name) => {
    const { pantry } = get();
    const key = name.toLowerCase();
    const newPantry = { ...pantry };
    if (newPantry[key]) delete newPantry[key];
    else newPantry[key] = true;
    set({ pantry: newPantry });
    persist(get());
  },

  toggleChecked: (key) => {
    const { checkedItems } = get();
    const newChecked = { ...checkedItems };
    if (newChecked[key]) delete newChecked[key];
    else newChecked[key] = true;
    set({ checkedItems: newChecked });
    persist(get());
  },

  clearChecked: () => { set({ checkedItems: {} }); persist(get()); },

  addRecipe: (recipe) => {
    const { recipes } = get();
    set({ recipes: [...recipes, recipe] });
    persist(get());
  },

  updateRecipe: (recipe) => {
    const { recipes } = get();
    set({ recipes: recipes.map(r => r.id === recipe.id ? recipe : r) });
    persist(get());
  },

  deleteRecipe: (id) => {
    const { recipes, plan } = get();
    const newPlan = { ...plan };
    Object.keys(newPlan).forEach(k => { if (newPlan[k] === id) delete newPlan[k]; });
    set({ recipes: recipes.filter(r => r.id !== id), plan: newPlan });
    persist(get());
  },
}));
