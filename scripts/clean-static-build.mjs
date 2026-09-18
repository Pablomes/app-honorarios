import { rm } from 'node:fs/promises';
import { join } from 'node:path';

const outputPath = join('dist', 'app-industralizacion');

await Promise.all([
  rm(join(outputPath, 'prerendered-routes.json'), { force: true }),
  rm(join(outputPath, 'server'), { recursive: true, force: true })
]);
