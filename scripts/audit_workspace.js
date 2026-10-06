// scripts/audit_workspace.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

function getHash(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(data).digest('hex');
  } catch (e) {
    return null;
  }
}

function scanDir(dirPath, baseDir = '') {
  let results = [];
  if (!fs.existsSync(dirPath)) return results;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanDir(fullPath, relPath));
    } else {
      const stat = fs.statSync(fullPath);
      results.push({
        name: entry.name,
        relPath: relPath.replace(/\\/g, '/'),
        fullPath,
        size: stat.size,
        hash: getHash(fullPath),
      });
    }
  }
  return results;
}

console.log('Scanning workspace...');
const allFiles = scanDir(ROOT);

// Categorize files
const rootFiles = [];
const subprojects = {
  'SHREE-RADHE-KRISHNA-DIGITAL-SERVICE': [],
  'SRK_Digital_Service_Project': [],
  'JARVIS-AI-OPERATING-SYSTEM': [],
  '_ARCHIVED_ORIGINALS': [],
};

allFiles.forEach(f => {
  const parts = f.relPath.split('/');
  if (parts.length === 1) {
    rootFiles.push(f);
  } else if (subprojects[parts[0]]) {
    subprojects[parts[0]].push(f);
  } else {
    rootFiles.push(f);
  }
});

console.log(`\n========================================`);
console.log(`WORKSPACE INVENTORY AUDIT REPORT`);
console.log(`========================================`);
console.log(`Total non-ignored files: ${allFiles.length}`);
console.log(`- Canonical Root Project Files: ${rootFiles.length}`);
console.log(`- Subfolder SHREE-RADHE-KRISHNA-DIGITAL-SERVICE: ${subprojects['SHREE-RADHE-KRISHNA-DIGITAL-SERVICE'].length}`);
console.log(`- Subfolder SRK_Digital_Service_Project: ${subprojects['SRK_Digital_Service_Project'].length}`);
console.log(`- Subfolder JARVIS-AI-OPERATING-SYSTEM: ${subprojects['JARVIS-AI-OPERATING-SYSTEM'].length}`);
console.log(`- Backup Archive _ARCHIVED_ORIGINALS: ${subprojects['_ARCHIVED_ORIGINALS'].length}`);

// Detect Duplicate Hashes
const hashMap = {};
allFiles.forEach(f => {
  if (!f.hash) return;
  if (!hashMap[f.hash]) hashMap[f.hash] = [];
  hashMap[f.hash].push(f.relPath);
});

const duplicateHashes = Object.entries(hashMap).filter(([h, list]) => list.length > 1);
console.log(`\nIdentical Content Duplicates (exact SHA256 match): ${duplicateHashes.length} clusters`);
duplicateHashes.slice(0, 15).forEach(([h, list]) => {
  console.log(`  Hash: ${h.substring(0, 8)}... (${list.length} copies):`);
  list.forEach(p => console.log(`    - ${p}`));
});

// Detect Same Filename across directories
const nameMap = {};
allFiles.forEach(f => {
  if (!nameMap[f.name]) nameMap[f.name] = [];
  nameMap[f.name].push(f.relPath);
});

const duplicateNames = Object.entries(nameMap).filter(([n, list]) => list.length > 1);
console.log(`\nSame Filename Occurrences: ${duplicateNames.length} names found across different folders`);
duplicateNames.slice(0, 15).forEach(([n, list]) => {
  console.log(`  File: "${n}" in:`);
  list.forEach(p => console.log(`    - ${p}`));
});
