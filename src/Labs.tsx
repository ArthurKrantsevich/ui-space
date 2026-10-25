import { useState, type CSSProperties } from "react";
import { SettingsPanel, type Gaps } from "./App";

/** Учебные экраны: каждый показывает одну идею из ролика и работает сам по себе. */

const Range = ({ id, label, value, min, max, step = 1, onChange }: { id: string; label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) => (
  <label className="slider" htmlFor={id}>
    <span className="slider-head">
      {label} <b>{value}px</b>
    </span>
    <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
  </label>
);

// ── группы: отступ внутри группы меньше, чем между группами ─
export function GroupsLab() {
  const [inside, setInside] = useState(16);
  const [between, setBetween] = useState(16);
  const ok = inside < between;
  return (
    <main className="lab">
      <h1>Какие кнопки вместе?</h1>
      <div className="toolbar">
        <button className="btn">← Назад</button>
        <span style={{ width: between }} className="gap-mark b" />
        <button className="btn">Сохранить черновик</button>
        <span style={{ width: inside }} className="gap-mark i" />
        <button className="btn primary">Опубликовать</button>
      </div>
      <div className={`verdict ${ok ? "ok" : "bad"}`}>{ok ? `Читается: внутри ${inside} px < между ${between} px` : `Не читается: внутри ${inside} px ≥ между ${between} px`}</div>
      <div className="sliders">
        <Range id="inside" label="Внутри группы" value={inside} min={4} max={32} step={4} onChange={setInside} />
        <Range id="between" label="Между группами" value={between} min={4} max={64} step={4} onChange={setBetween} />
      </div>
    </main>
  );
}

// ── кнопка: внутренний отступ меньше внешнего, по вертикали меньше, чем по горизонтали ─
export function ButtonLab() {
  const [gap, setGap] = useState(24);
  const [px, setPx] = useState(16);
  const [py, setPy] = useState(16);
  const warn: string[] = [];
  if (gap > px) warn.push("Иконка дальше от текста, чем текст от края");
  if (py >= px) warn.push("Поля одинаковые — кнопка выглядит раздутой");
  return (
    <main className="lab">
      <div className="btn-stage">
        <button className="big-btn" style={{ padding: `${py}px ${px}px`, gap }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Новый проект
        </button>
      </div>
      <div className={`verdict ${warn.length ? "bad" : "ok"}`}>{warn.length ? warn.join(" · ") : "Сбалансировано: зазор ≤ полей, поля по бокам в 2 раза больше"}</div>
      <div className="sliders three">
        <Range id="gap" label="Иконка — текст" value={gap} min={4} max={32} step={2} onChange={setGap} />
        <Range id="px" label="Поля по бокам" value={px} min={8} max={40} step={2} onChange={setPx} />
        <Range id="py" label="Поля сверху и снизу" value={py} min={4} max={24} step={2} onChange={setPy} />
      </div>
    </main>
  );
}

// ── разбор экрана: всё по 8 px → группы, поля, разнос ─
const FIX: { label: string; g: Gaps; css: string[] }[] = [
  { label: "Всё по 8 px", g: { pad: 8, between: 8, rows: 8, related: 8, spread: false }, css: ["/* последовательно, но тесно */", ".panel { padding: 8px; gap: 8px; }"] },
  { label: "Поля 24 px", g: { pad: 24, between: 8, rows: 8, related: 8, spread: false }, css: [".panel { padding: 24px; }"] },
  { label: "Между группами 24 px", g: { pad: 24, between: 24, rows: 8, related: 8, spread: false }, css: [".panel { gap: 24px; }"] },
  { label: "Связанное ближе", g: { pad: 24, between: 24, rows: 16, related: 4, spread: false }, css: [".head    { gap: 4px; }", ".options { gap: 16px; }"] },
  { label: "Разнести по краям", g: { pad: 24, between: 24, rows: 16, related: 4, spread: true }, css: [".row     { justify-content: space-between; }", ".actions { justify-content: flex-end; }"] },
];
export function FixLab() {
  const [step, setStep] = useState(0);
  return (
    <main className="lab two">
      <div className="stage">
        <SettingsPanel g={FIX[step].g} outline />
      </div>
      <div className="side">
        <div className="seg vertical" role="radiogroup" aria-label="Шаг">
          {FIX.map((x, i) => (
            <button key={x.label} id={`fix-${i}`} role="radio" aria-checked={step === i} onClick={() => setStep(i)}>
              {i}. {x.label}
            </button>
          ))}
        </div>
        <pre className="code">
          {FIX.slice(0, step + 1).flatMap((x, i) =>
            x.css.map((l, j) => (
              <span key={`${i}-${j}`} className={i === step ? "new" : ""}>
                {l + "\n"}
              </span>
            )),
          )}
        </pre>
      </div>
    </main>
  );
}

// ── вложенные скругления: внутренний радиус = внешний − поле ─
export function RadiusLab() {
  const [outer, setOuter] = useState(28);
  const [pad, setPad] = useState(12);
  const [formula, setFormula] = useState(false);
  const inner = formula ? Math.max(0, outer - pad) : outer;
  const box: CSSProperties = { borderRadius: outer, padding: pad };
  return (
    <main className="lab">
      <div className="radius-stage">
        <div className="r-outer" style={box}>
          <div className="r-inner" style={{ borderRadius: inner }}>
            <span>radius: {inner}px</span>
          </div>
        </div>
        <pre className="code small">{`.outer { border-radius: ${outer}px; padding: ${pad}px; }\n.inner { border-radius: ${formula ? `calc(${outer}px - ${pad}px)` : `${outer}px`}; }${formula ? `  /* = ${inner}px */` : "  /* тот же радиус */"}`}</pre>
      </div>
      <div className="sliders">
        <Range id="outer" label="Внешний радиус" value={outer} min={8} max={40} step={2} onChange={setOuter} />
        <Range id="pad" label="Поле" value={pad} min={4} max={32} step={2} onChange={setPad} />
      </div>
      <button id="radius-formula" className="btn primary" onClick={() => setFormula((v) => !v)}>
        {formula ? "Как было: одинаковый радиус" : "Внутренний = внешний − поле"}
      </button>
    </main>
  );
}

// ── зона нажатия: значок 24 px, а нажимать удобно от 44 px ─
const ICONS = ["M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z", "M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14", "M4 12v8h16v-8M12 3v12M7 8l5-5 5 5", "M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"];
export function TouchLab() {
  const [show, setShow] = useState(false);
  const [big, setBig] = useState(false);
  const size = big ? 44 : 24;
  return (
    <main className="lab">
      <h1>Попадите пальцем</h1>
      <div className="touch-row" style={{ gap: big ? 8 : 4 }}>
        {ICONS.map((d, i) => (
          <span key={i} className={`hit ${show ? "show" : ""}`} style={{ width: size, height: size }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={d} />
            </svg>
          </span>
        ))}
      </div>
      <div className="facts">
        <span className={size >= 24 ? "ok" : "bad"}>WCAG 2.2 AA — от 24 px</span>
        <span className={size >= 44 ? "ok" : "bad"}>WCAG AAA и Apple — от 44 px</span>
        <span className={size >= 48 ? "ok" : "bad"}>Material — 48 dp</span>
      </div>
      <div className="btn-row">
        <button id="touch-show" className="btn" onClick={() => setShow((v) => !v)}>
          {show ? "Скрыть зону нажатия" : "Показать зону нажатия"}
        </button>
        <button id="touch-big" className="btn primary" onClick={() => setBig((v) => !v)}>
          {big ? "Вернуть 24 px" : "Зона 44 px, значок тот же"}
        </button>
      </div>
      <pre className="code small">{".icon-button {\n  min-width: 2.75rem;   /* 44px */\n  min-height: 2.75rem;\n  display: grid;\n  place-items: center;  /* значок остаётся 24px */\n}"}</pre>
    </main>
  );
}
