import { useEffect, useState, type CSSProperties } from "react";
import { ButtonLab, FixLab, GroupsLab, RadiusLab, TouchLab } from "./Labs";
import { cssFile, DENSITY, ROLE, SCALE, type Density } from "./space";

const VIEWS = [
  { id: "", label: "Шкала" },
  { id: "groups", label: "Группы" },
  { id: "button", label: "Кнопка" },
  { id: "fix", label: "Разбор экрана" },
  { id: "radius", label: "Скругления" },
  { id: "touch", label: "Зона нажатия" },
];

const useHash = () => {
  const read = () => location.hash.replace(/^#\/?/, "");
  const [h, setH] = useState(read);
  useEffect(() => {
    const on = () => setH(read());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return h;
};

export function App() {
  const view = useHash();
  return (
    <div className="app">
      <nav className="nav" aria-label="Разделы">
        <span className="logo">
          <i />
          Отступы
        </span>
        {VIEWS.map((v) => (
          <a key={v.id} href={`#/${v.id}`} aria-current={view === v.id ? "page" : undefined}>
            {v.label}
          </a>
        ))}
      </nav>
      {view === "" && <Tool />}
      {view === "groups" && <GroupsLab />}
      {view === "button" && <ButtonLab />}
      {view === "fix" && <FixLab />}
      {view === "radius" && <RadiusLab />}
      {view === "touch" && <TouchLab />}
    </div>
  );
}

/** Панель настроек — пример интерфейса, на котором видны отступы. Все размеры приходят снаружи. */
export type Gaps = { pad: number; between: number; rows: number; related: number; spread: boolean };
export function SettingsPanel({ g, outline }: { g: Gaps; outline?: boolean }) {
  const row: CSSProperties = { display: "flex", alignItems: "center", justifyContent: g.spread ? "space-between" : "flex-start", gap: g.related * 2, minHeight: g.spread ? 40 : undefined };
  return (
    <div className={`settings ${outline ? "outline" : ""}`} style={{ padding: g.pad, gap: g.between }}>
      <div className="grp" style={{ display: "grid", gap: g.related }}>
        <div className="s-title">Модель для чата</div>
        <div className="s-desc">Выберите, как ассистент отвечает в вашем рабочем пространстве.</div>
      </div>
      <div className="grp" style={{ display: "grid", gap: g.rows }}>
        <div style={row}>
          <span>Модель</span>
          <span className="pill">Быстрая ▾</span>
        </div>
        <div style={row}>
          <span>Длина ответа</span>
          <span className="range">
            <i style={{ width: "62%" }} />
          </span>
        </div>
        <div style={row}>
          <span>Показывать источники</span>
          <span className="switch on" />
        </div>
        <div style={row}>
          <span>Лимит в день</span>
          <span className="pill">200 запросов</span>
        </div>
      </div>
      <div className="grp" style={{ display: "flex", gap: g.related * 2, justifyContent: g.spread ? "flex-end" : "flex-start" }}>
        <button className="btn">Сбросить</button>
        <button className="btn primary">Применить</button>
      </div>
    </div>
  );
}

function Tool() {
  const [d, setD] = useState<Density>("comfortable");
  const [copied, setCopied] = useState(false);
  const k = DENSITY[d].k;
  const g: Gaps = { pad: 24 * k, between: 24 * k, rows: 16 * k, related: 4 * k, spread: true };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cssFile(d));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* буфер обмена недоступен — CSS виден справа, его можно выделить */
    }
  };
  return (
    <main className="tool">
      <aside className="panel">
        <h2>Плотность</h2>
        <div className="seg vertical" role="radiogroup">
          {(Object.keys(DENSITY) as Density[]).map((x) => (
            <button key={x} id={`d-${x}`} role="radio" aria-checked={d === x} onClick={() => setD(x)}>
              {DENSITY[x].label} · ×{DENSITY[x].k}
            </button>
          ))}
        </div>
        <h2>Шкала, шаг 4 px</h2>
        <div className="scale">
          {SCALE.map((px, i) => (
            <div key={px} className="step">
              <span className="step-name">space-{i + 1}</span>
              <span className="bar" style={{ width: px * k * 2 }} />
              <span className="step-px">{+(px * k).toFixed(1)}</span>
            </div>
          ))}
        </div>
        <button id="copy" className="btn primary wide" onClick={copy}>
          {copied ? "Скопировано ✓" : "Скопировать CSS"}
        </button>
      </aside>
      <section className="stage">
        <SettingsPanel g={g} />
      </section>
      <section className="roles">
        {SCALE.map((px) => (
          <div className="role" key={px}>
            <b>{px}px</b>
            <span>{ROLE[px]}</span>
          </div>
        ))}
        <pre className="css-out">{cssFile(d)}</pre>
      </section>
    </main>
  );
}
