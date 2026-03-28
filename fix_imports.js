import fs from 'fs';

const data = fs.readFileSync('src/data/apps.ts', 'utf8');

// Find all used icons
const iconRegex = /icon:\s*([a-zA-Z0-9_]+)/g;
const icons = new Set();
let match;
while ((match = iconRegex.exec(data)) !== null) {
  if (match[1] === 'ImageIcon') {
    icons.add('Image as ImageIcon');
  } else {
    icons.add(match[1]);
  }
}

const imports = `import {\n    ${Array.from(icons).join(',\n    ')}\n} from 'lucide-react';\n\n`;

// replace everything before 'export const APPS = ['
const fixedData = imports + data.substring(data.indexOf('export const APPS = ['));
fs.writeFileSync('src/data/apps.ts', fixedData);
console.log('Fixed imports in apps.ts!');
