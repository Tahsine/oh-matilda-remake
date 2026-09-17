// Images mockées — re-emballe oh-matilda-—-ai-agent-chat/src/data/mockData.ts:7-143
// svgURI = helper data:image/svg+xml,... pour <img src> sans fichier (voir mockData.ts:3)
// Ici fusionné directement, pas de src/lib/svg.ts séparé.

// helper inline — c'est juste encodeURIComponent pour faire une data-uri
const svgURI = (s: string) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);

export const IMG_SANTORINI = svgURI(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#bfe4ff"/>
      <stop offset="1" stop-color="#eef8ff"/>
    </linearGradient>
    <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2f7cc0"/>
      <stop offset="1" stop-color="#175086"/>
    </linearGradient>
  </defs>
  <rect width="400" height="170" fill="url(#skyGrad)"/>
  <circle cx="330" cy="42" r="20" fill="#fff6d8"/>
  <g fill="#ffffff" opacity=".85">
    <ellipse cx="90" cy="46" rx="34" ry="10"/>
    <ellipse cx="122" cy="53" rx="26" ry="8"/>
    <ellipse cx="250" cy="30" rx="30" ry="9"/>
  </g>
  <rect y="150" width="400" height="110" fill="url(#seaGrad)"/>
  <path d="M240 152 L320 142 L400 152 L400 160 L240 160 Z" fill="#7fa8cc" opacity=".5"/>
  <path d="M0 260 L0 148 C40 138 90 130 130 126 C180 121 214 152 244 176 L284 260 Z" fill="#9c7b5c"/>
  <path d="M0 260 L0 168 C50 158 110 148 150 148 C192 148 222 192 242 260 Z" fill="#b08a68"/>
  <g>
    <rect x="30" y="118" width="34" height="36" rx="3" fill="#fdfdfb"/>
    <path d="M30 118 a17 17 0 0 1 34 0 z" fill="#2a6db0"/>
    <rect x="42" y="130" width="7" height="10" rx="1" fill="#2a6db0"/>
    <rect x="70" y="132" width="26" height="26" rx="3" fill="#f4f2ec"/>
    <rect x="78" y="140" width="6" height="8" rx="1" fill="#3279bd"/>
    <rect x="100" y="114" width="30" height="44" rx="3" fill="#fdfdfb"/>
    <path d="M100 114 a15 15 0 0 1 30 0 z" fill="#3279bd"/>
    <rect x="110" y="128" width="6" height="9" rx="1" fill="#2a6db0"/>
    <rect x="134" y="136" width="24" height="26" rx="3" fill="#efece4"/>
    <rect x="141" y="144" width="6" height="8" rx="1" fill="#3279bd"/>
    <rect x="162" y="148" width="20" height="20" rx="2" fill="#fdfdfb"/>
  </g>
  <path d="M46 260 C64 212 94 192 124 188" stroke="#8a6a4c" stroke-width="3" fill="none" opacity=".45"/>
</svg>
`);

export const IMG_WA_BEFORE = svgURI(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
  <rect width="320" height="200" fill="#ECE5DD"/>
  <rect width="320" height="30" fill="#075E54"/>
  <circle cx="24" cy="15" r="9" fill="#ffffff" opacity="0.9"/>
  <text x="42" y="20" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="700" fill="#ffffff">Sam</text>
  <rect x="14" y="46" width="140" height="34" rx="12" fill="#ffffff"/>
  <rect x="24" y="56" width="90" height="6" rx="3" fill="#c9c9c9"/>
  <rect x="24" y="67" width="60" height="6" rx="3" fill="#c9c9c9"/>
  <rect x="10" y="164" width="270" height="26" rx="13" fill="#ffffff"/>
  <text x="20" y="181" font-family="Arial,Helvetica,sans-serif" font-size="11" fill="#1c211c">Running late, sorry!</text>
  <circle cx="296" cy="177" r="14" fill="#1e9e53"/>
  <path d="M291 181l10-9-2 12z" fill="#ffffff"/>
</svg>
`);

export const IMG_WA_AFTER = svgURI(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
  <rect width="320" height="200" fill="#ECE5DD"/>
  <rect width="320" height="30" fill="#075E54"/>
  <circle cx="24" cy="15" r="9" fill="#ffffff" opacity="0.9"/>
  <text x="42" y="20" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="700" fill="#ffffff">Sam</text>
  <rect x="14" y="46" width="140" height="34" rx="12" fill="#ffffff"/>
  <rect x="24" y="56" width="90" height="6" rx="3" fill="#c9c9c9"/>
  <rect x="24" y="67" width="60" height="6" rx="3" fill="#c9c9c9"/>
  <rect x="150" y="90" width="160" height="34" rx="12" fill="#DCF8C6"/>
  <rect x="160" y="100" width="90" height="6" rx="3" fill="#5b8a5b"/>
  <rect x="160" y="111" width="60" height="6" rx="3" fill="#5b8a5b"/>
  <path d="M280 118l4 4 8-9" stroke="#4fc3f7" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="10" y="164" width="270" height="26" rx="13" fill="#ffffff"/>
  <text x="20" y="181" font-family="Arial,Helvetica,sans-serif" font-size="11" fill="#9aa39a">Message</text>
  <circle cx="296" cy="177" r="14" fill="#d8dbd3"/>
</svg>
`);

export const IMG_SETTINGS_OFF = svgURI(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
  <rect width="320" height="200" fill="#f4f5f2"/>
  <rect width="320" height="38" fill="#ffffff"/>
  <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#1c211c">Settings</text>
  <rect x="14" y="52" width="292" height="50" rx="12" fill="#ffffff" stroke="#e4e6e0"/>
  <circle cx="36" cy="77" r="12" fill="#dfe8de"/>
  <path d="M29 77c3-5 10-7 15-2" stroke="#1e9e53" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <text x="58" y="81" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#1c211c">Wi-Fi</text>
  <text x="58" y="94" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#767d78">Off</text>
  <rect x="246" y="65" width="46" height="24" rx="12" fill="#d8dbd3"/>
  <circle cx="258" cy="77" r="9" fill="#ffffff"/>
</svg>
`);

export const IMG_SETTINGS_ON = svgURI(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
  <rect width="320" height="200" fill="#f4f5f2"/>
  <rect width="320" height="38" fill="#ffffff"/>
  <text x="16" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#1c211c">Settings</text>
  <rect x="14" y="52" width="292" height="50" rx="12" fill="#ffffff" stroke="#e4e6e0"/>
  <circle cx="36" cy="77" r="12" fill="#dfe8de"/>
  <path d="M29 77c3-5 10-7 15-2" stroke="#1e9e53" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <text x="58" y="81" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#1c211c">Wi-Fi</text>
  <text x="58" y="94" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" fill="#1e9e53" font-weight="600">Connected · Home_5G</text>
  <rect x="246" y="65" width="46" height="24" rx="12" fill="#1e9e53"/>
  <circle cx="280" cy="77" r="9" fill="#ffffff"/>
</svg>
`);

export const IMG_DESK = svgURI(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6e7cb"/>
      <stop offset="1" stop-color="#e9d2ac"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#woodGrad)"/>
  <polygon points="250,0 400,0 400,120 150,300 60,300" fill="#ffffff" opacity=".18"/>
  <rect y="210" width="400" height="90" fill="#b9895c"/>
  <rect y="210" width="400" height="10" fill="#a1744b"/>
  <g>
    <rect x="70" y="120" width="150" height="95" rx="8" fill="#d9dde0" stroke="#b9bfc4"/>
    <circle cx="105" cy="150" r="10" fill="#e2725b"/>
    <rect x="130" y="165" width="22" height="14" rx="3" fill="#5aa46b"/>
    <circle cx="185" cy="145" r="8" fill="#f2b53c"/>
    <rect x="160" y="180" width="16" height="16" rx="8" fill="#4a90d9"/>
    <rect x="90" y="180" width="18" height="12" rx="2" fill="#9b6bd3"/>
  </g>
  <g>
    <rect x="250" y="170" width="34" height="42" rx="6" fill="#e2725b"/>
    <path d="M284 180 a12 12 0 0 1 0 24" fill="none" stroke="#e2725b" stroke-width="6"/>
  </g>
  <g transform="rotate(-6 320 200)">
    <rect x="290" y="180" width="70" height="46" rx="4" fill="#f8f4ea"/>
    <rect x="290" y="180" width="70" height="8" fill="#d9d2c2"/>
    <line x1="298" y1="198" x2="350" y2="198" stroke="#b9b2a2" stroke-width="2"/>
    <line x1="298" y1="208" x2="344" y2="208" stroke="#b9b2a2" stroke-width="2"/>
  </g>
</svg>
`);
