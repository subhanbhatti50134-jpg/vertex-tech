const fs = require('fs');
const path = require('path');

const W = 800;
const H = 600;

const projects = [
  {
    id: 'nyvexa',
    title: 'NYVEXA AI',
    subtitle: 'Streaming Chat • Agents • Research',
    colors: ['#0066FF', '#071426'],
    icon: 'AI',
    theme: 'ai'
  },
  {
    id: 'rupee-pulse',
    title: 'RUPEE PULSE',
    subtitle: 'Crypto Dashboard • Binance • PKR',
    colors: ['#00A8FF', '#0A1628'],
    icon: '$',
    theme: 'crypto'
  },
  {
    id: 'snj-gold-lab',
    title: 'SNJ GOLD LAB',
    subtitle: 'Jewelry Inventory • Transactions',
    colors: ['#3D6FB8', '#101C30'],
    icon: 'Au',
    theme: 'gold'
  },
  {
    id: 'app-sweeper',
    title: 'APP SWEEPER',
    subtitle: 'Linux Cleaner • Zero Dependency',
    colors: ['#7FB2FF', '#0C2240'],
    icon: '🧹',
    theme: 'cleaner'
  },
  {
    id: 'gold-silver-pos',
    title: 'GOLD & SILVER POS',
    subtitle: 'Android POS • Shop Management',
    colors: ['#0050CC', '#132B4D'],
    icon: '₹',
    theme: 'pos'
  },
  {
    id: 'streamcam',
    title: 'STREAMCAM',
    subtitle: 'Camera Stream • Live Viewing',
    colors: ['#2BB3FF', '#081A2E'],
    icon: '📹',
    theme: 'camera'
  },
  {
    id: 'rate-portal',
    title: 'RATE PORTAL',
    subtitle: 'Gold & Silver Rates • Live',
    colors: ['#1A3FFF', '#050E1C'],
    icon: '₿',
    theme: 'rates'
  },
  {
    id: 'student-management',
    title: 'STUDENT MGMT',
    subtitle: 'C++ • OOP • File Records',
    colors: ['#5C8FE8', '#0E1F38'],
    icon: 'S',
    theme: 'student'
  },
  {
    id: 'my-portfolio',
    title: 'DEV PORTFOLIO',
    subtitle: 'Dark System • Custom Motion',
    colors: ['#2447C8', '#0A1830'],
    icon: '< />',
    theme: 'portfolio'
  }
];

const outDir = path.join(__dirname, 'public', 'discs');
fs.mkdirSync(outDir, { recursive: true });

function iconFor(theme) {
  switch (theme) {
    case 'ai': return `<circle cx="400" cy="280" r="42" fill="none" stroke="#ffffff" stroke-width="3"/><path d="M360 280 Q400 230 440 280 Q400 330 360 280" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.4"/><circle cx="400" cy="280" r="10" fill="#ffffff"/>`;
    case 'crypto': return `<rect x="360" y="240" width="80" height="80" rx="8" fill="none" stroke="#ffffff" stroke-width="3"/><path d="M360 280 L400 240 L440 280 L400 320 Z" fill="none" stroke="#ffffff" stroke-width="3"/>`;
    case 'gold': return `<circle cx="400" cy="280" r="36" fill="none" stroke="#FFD700" stroke-width="4"/><path d="M370 280 L400 250 L430 280 L400 310 Z" fill="#FFD700"/>`;
    case 'cleaner': return `<path d="M370 250 Q400 240 430 250 Q430 310 400 340 Q370 310 370 250 Z" fill="#ffffff"/><path d="M370 250 L400 340 M430 250 L370 340" stroke="#ffffff" stroke-width="3"/>`;
    case 'pos': return `<rect x="350" y="250" width="100" height="60" rx="6" fill="none" stroke="#ffffff" stroke-width="3"/><rect x="370" y="270" width="30" height="20" rx="2" fill="#ffffff" opacity="0.6"/><rect x="410" y="270" width="30" height="20" rx="2" fill="#ffffff" opacity="0.6"/><rect x="370" y="300" width="30" height="20" rx="2" fill="#ffffff" opacity="0.4"/><rect x="410" y="300" width="30" height="20" rx="2" fill="#ffffff" opacity="0.4"/>`;
    case 'camera': return `<rect x="360" y="250" width="80" height="70" rx="10" fill="none" stroke="#ffffff" stroke-width="3"/><circle cx="400" cy="285" r="22" fill="#ffffff"/><circle cx="400" cy="285" r="8" fill="#ffffff" opacity="0.3"/><rect x="385" y="320" width="30" height="10" rx="5" fill="#ffffff" opacity="0.5"/>`;
    case 'rates': return `<rect x="350" y="250" width="100" height="60" rx="6" fill="none" stroke="#ffffff" stroke-width="2"/><path d="M350 280 L390 250 L430 280 L390 310 Z" fill="none" stroke="#ffffff" stroke-width="2"/><circle cx="400" cy="285" r="4" fill="#ffffff"/>`;
    case 'student': return `<rect x="360" y="250" width="80" height="70" rx="4" fill="#ffffff"/><path d="M370 270 L390 290 L410 270" fill="none" stroke="#2447C8" stroke-width="3"/><rect x="370" y="310" width="24" height="8" fill="#2447C8"/><rect x="406" y="310" width="24" height="8" fill="#2447C8"/>`;
    case 'portfolio': return `<circle cx="400" cy="280" r="30" fill="none" stroke="#ffffff" stroke-width="3"/><path d="M375 260 L400 300 L425 260" fill="none" stroke="#ffffff" stroke-width="3"/><path d="M375 300 L400 260 L425 300" fill="none" stroke="#ffffff" stroke-width="3"/>`;
    default: return `<circle cx="400" cy="280" r="30" fill="#ffffff"/>`;
  }
}

function circuitPattern(themeColor) {
  return `<g stroke="${themeColor}" stroke-width="2" opacity="0.15">
    <path d="M0 300 H100 V200 H300 V400 H700 V300"/>
    <circle cx="100" cy="200" r="4" fill="${themeColor}"/>
    <circle cx="300" cy="400" r="4" fill="${themeColor}"/>
    <circle cx="700" cy="300" r="4" fill="${themeColor}"/>
  </g>`;
}

for (const p of projects) {
  const [c1, c2] = p.colors;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#grad)"/>
    ${circuitPattern(c1)}
    <g filter="url(#glow)">
      ${iconFor(p.theme)}
    </g>
    <text x="${W/2}" y="${H * 0.72}" font-family="Instrument Sans, Arial, sans-serif" font-size="42" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.05em">${p.title}</text>
    <text x="${W/2}" y="${H * 0.82}" font-family="Instrument Sans, Arial, sans-serif" font-size="16" font-weight="500" fill="#ffffff" text-anchor="middle" opacity="0.7" letter-spacing="0.15em">${p.subtitle}</text>
  </svg>`;

  const filePath = path.join(outDir, `${p.id}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated ${filePath}`);
}

console.log('\nAll project images generated successfully!');