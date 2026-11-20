const SHAPES = {
  tee: (<><path d="M68 32 Q100 58 132 32 L172 56 L154 92 L138 82 L138 214 L62 214 L62 82 L46 92 L28 56 Z" /><path d="M68 32 Q100 58 132 32" fill="none" /></>),
  hoodie: (<><path d="M64 44 Q100 30 136 44 L180 78 L166 156 L144 150 V224 H56 V150 L34 156 L20 78 Z" /><path d="M70 44 Q100 -4 130 44 Q100 70 70 44 Z" /><path d="M72 176 H128 L136 206 H64 Z" fill="none" /></>),
  pants: (<><path d="M62 28 H138 L148 222 H108 L100 96 L92 222 H52 Z" /><path d="M62 44 H138" fill="none" /></>),
  dress: (<><path d="M78 24 H90 Q100 46 110 24 H122 L134 90 L170 226 H30 L66 90 Z" /><path d="M66 90 H134" fill="none" /></>),
  coat: (<><path d="M66 30 Q100 54 134 30 L182 64 L172 170 L148 166 V232 H52 V166 L28 170 L18 64 Z" /><path d="M100 56 V232" fill="none" /></>),
  tote: (<><path d="M48 92 H152 L160 226 H40 Z" /><path d="M74 92 Q74 40 100 40 Q126 40 126 92" fill="none" /></>),
  beanie: (<><path d="M52 152 Q52 62 100 62 Q148 62 148 152 Z" /><rect x="46" y="150" width="108" height="30" rx="4" /><circle cx="100" cy="52" r="10" /></>),
  belt: (<><rect x="14" y="116" width="172" height="20" rx="2" /><rect x="144" y="108" width="30" height="36" rx="3" fill="none" /><path d="M60 126 H130" fill="none" /></>),
};

const MAP = [
  ["hoodie", "hoodie"], ["coat", "coat"], ["dress", "dress"], ["chino", "pants"],
  ["jean", "pants"], ["trouser", "pants"], ["tote", "tote"], ["bag", "tote"],
  ["beanie", "beanie"], ["belt", "belt"],
];

export function garmentKind(title = "") {
  const t = title.toLowerCase();
  return (MAP.find(([k]) => t.includes(k)) || ["", "tee"])[1];
}

export default function GarmentArt({ title, kind, color = "#14224a", stitch = "#f2a900" }) {
  const shape = SHAPES[kind || garmentKind(title)];
  return (
    <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g fill={color} stroke={stitch} strokeWidth="1.6" strokeDasharray="5 4" strokeLinejoin="round" strokeLinecap="round">
        {shape}
      </g>
    </svg>
  );
}
