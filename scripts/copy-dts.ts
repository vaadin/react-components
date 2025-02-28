import { globIterate as glob } from 'glob';
import { constants, copyFile, mkdir } from 'node:fs/promises';
import { packageURL, srcURL } from './utils/config.js';

for await (const file of glob(['**/*.d.ts'], { cwd: srcURL })) {
  const dest = new URL(file, packageURL);
  await mkdir(new URL('./', dest), { recursive: true });
  await copyFile(new URL(file, srcURL), dest, constants.COPYFILE_FICLONE);
}
