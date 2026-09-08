// test/run-all.js
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const testDir = __dirname;
const testFiles = fs
  .readdirSync(testDir)
  .filter((file) => file.endsWith('.js') && file !== 'run-all.js');

console.log(`\n========================================`);
console.log(`  CDSS TEST SUITE (${testFiles.length} test files)`);
console.log(`========================================\n`);

let passedCount = 0;
let failedCount = 0;
const failures = [];

for (const file of testFiles) {
  const filePath = path.join(testDir, file);
  process.stdout.write(`• Running ${file.padEnd(35)} `);

  const result = spawnSync(process.execPath, [filePath], {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf-8',
    env: process.env,
  });

  if (result.status === 0) {
    console.log(`\x1b[32mPASS\x1b[0m`);
    passedCount++;
  } else {
    console.log(`\x1b[31mFAIL (exit code ${result.status})\x1b[0m`);
    failedCount++;
    failures.push({
      file,
      error: result.stderr || result.stdout || 'Unknown error',
    });
  }
}

console.log(`\n----------------------------------------`);
console.log(`Total: ${testFiles.length} | \x1b[32mPassed: ${passedCount}\x1b[0m | \x1b[31mFailed: ${failedCount}\x1b[0m`);
console.log(`----------------------------------------\n`);

if (failures.length > 0) {
  console.log('FAILURES:\n');
  for (const f of failures) {
    console.log(`[${f.file}]:`);
    console.log(f.error);
    console.log('----------------------------------------');
  }
  process.exit(1);
} else {
  console.log('All tests completed successfully!\n');
  process.exit(0);
}
