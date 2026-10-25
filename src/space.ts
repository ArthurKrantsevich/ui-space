/** Шкала отступов на сетке 4 px и плотность интерфейса одним множителем. */

export const SCALE = [4, 8, 12, 16, 24, 32, 48, 64];

export type Density = "compact" | "comfortable" | "spacious";
export const DENSITY: Record<Density, { label: string; k: number }> = {
  compact: { label: "Компактно", k: 0.75 },
  comfortable: { label: "Обычно", k: 1 },
  spacious: { label: "Свободно", k: 1.25 },
};

export const rem = (px: number) => `${+(px / 16).toFixed(4)}rem`;

/** Роль каждой ступени — подсказка, где её использовать. */
export const ROLE: Record<number, string> = {
  4: "иконка и подпись",
  8: "связанные элементы",
  12: "поля кнопки по вертикали",
  16: "основной шаг: поля, кнопки",
  24: "между группами",
  32: "поля крупных блоков",
  48: "между секциями",
  64: "между секциями страницы",
};

export function cssFile(d: Density) {
  const k = DENSITY[d].k;
  return `:root {
  --density: ${k}; /* 0.75 компактно · 1 обычно · 1.25 свободно */
${SCALE.map((px, i) => `  --space-${i + 1}: calc(${rem(px)} * var(--density)); /* ${px}px — ${ROLE[px]} */`).join("\n")}

  --tap: 2.75rem; /* 44px — минимальная зона нажатия */
}

.card   { padding: var(--space-6); border-radius: 1rem; }
.card > .inner { border-radius: calc(1rem - var(--space-6)); }  /* внешний − поле */
.group  { display: flex; gap: var(--space-2); }
.stack  { display: grid; gap: var(--space-5); }
.button { padding: var(--space-3) var(--space-5); gap: var(--space-2); min-height: var(--tap); }
`;
}
