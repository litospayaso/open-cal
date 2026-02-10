#!/usr/bin/env node
import { spawn } from 'child_process';

let cmd = 'npm.cmd';
if (process.platform === 'win32') {
  cmd = 'npm.cmd';
} else {
  cmd = 'npm';
}

const commit = async () => {
  const changeset = spawn(cmd, ['run', 'changeset'], {
    stdio: 'inherit',
    timeout: 600000,
    shell: true,
    detached: true,
  });
  changeset.on('exit', () => {
    process.exit(0);
  });
  changeset.on('error', () => {
    process.exit(1);
  });
  changeset.on('uncaughtException', () => {
    process.exit(1);
  });
};

commit();
