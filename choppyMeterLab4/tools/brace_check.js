const fs = require('fs');
const path = 'd:/Rust/choppyMeterLab4/js/indicatorJS_Ver2.js';
const s = fs.readFileSync(path, 'utf8');
const fs = require('fs');
const path = 'd:/Rust/choppyMeterLab4/js/indicatorJS_Ver2.js';
const s = fs.readFileSync(path, 'utf8');
const lines = s.split(/\r?\n/);
const stack = [];

let inSingle = false, inDouble = false, inTemplate = false, inBlockComment = false, inLineComment = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const ch = line[j];
    const prev = j > 0 ? line[j - 1] : '';

    if (inLineComment) continue;
    if (!inSingle && !inDouble && !inTemplate && ch === '/' && line[j + 1] === '*') { inBlockComment = true; j++; continue; }
    if (inBlockComment) {
      if (ch === '*' && line[j + 1] === '/') { inBlockComment = false; j++; }
      continue;
    }
    if (!inSingle && !inDouble && !inTemplate && ch === '/' && line[j + 1] === '/') { inLineComment = true; break; }

    if (!inDouble && !inTemplate && ch === '\'') {
      if (!inSingle) inSingle = true; else if (prev !== '\\') inSingle = false;
      continue;
    }
    if (!inSingle && !inTemplate && ch === '"') {
      if (!inDouble) inDouble = true; else if (prev !== '\\') inDouble = false;
      continue;
    }
    if (!inSingle && !inDouble && ch === '`') {
      if (!inTemplate) inTemplate = true; else if (prev !== '\\') inTemplate = false;
      continue;
    }

    // If inside any string/template, skip counting braces
    if (inSingle || inDouble || inTemplate) continue;

    if (ch === '{') stack.push({ line: i + 1, col: j + 1, snippet: lines[i].slice(0, 300) });
    else if (ch === '}') {
      if (stack.length === 0) {
        console.log('Unmatched } at', i + 1, j + 1);
      } else stack.pop();
    }
  }
  inLineComment = false; // reset at end of line
}

if (stack.length > 0) {
  console.log('Unmatched opening braces:', stack.length);
  console.log('Last 20 unmatched opens (most recent last):');
  const slice = stack.slice(-20);
  slice.forEach(s => console.log('  line', s.line, 'col', s.col, 'snippet:', s.snippet.replace(/\t/g,'    ')));
} else console.log('All braces matched');
