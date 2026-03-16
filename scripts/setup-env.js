#!/usr/bin/env node
import { copyFileSync, existsSync } from 'fs';

const dirs = ['server', 'client'];

dirs.forEach(dir => {
  const example = `${dir}/.env.example`;
  const target = `${dir}/.env`;

  if (existsSync(example)) {
    if (!existsSync(target)) {
      copyFileSync(example, target);
      console.log(`✓ Created ${target}`);
    } else {
      console.log(`→ ${target} already exists, skipping`);
    }
  } else {
    console.log(`✗ ${example} not found`);
  }
});

console.log('\nEnvironment setup complete!');
