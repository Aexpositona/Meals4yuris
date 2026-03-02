export const C = {
  purple: '#8420CD',
  green: '#328A2C',
  red: '#b83232',
  bg: '#0d0d0d',
  card: '#1a1a1a',
  card2: '#222222',
  border: '#2a2a2a',
  text: '#e5e5e5',
  text2: '#999999',
  text3: '#555555',
  white: '#ffffff',
} as const;

export default {
  light: {
    text: C.text,
    background: C.bg,
    tint: C.purple,
    tabIconDefault: C.text3,
    tabIconSelected: C.purple,
  },
  dark: {
    text: C.text,
    background: C.bg,
    tint: C.purple,
    tabIconDefault: C.text3,
    tabIconSelected: C.purple,
  },
};
