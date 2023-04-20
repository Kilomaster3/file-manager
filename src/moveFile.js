import { createReadStream, createWriteStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

const copy = async (pathToFile, pathToDir) => {
  try {
    await access(pathToFile);
    const readStream = createReadStream(pathToFile, { encoding: 'utf-8' });
    const writeStream = createWriteStream(pathToDir);

    await pipeline(readStream, writeStream);
  } catch {
    console.log('Operation failed');
  }
};

export default copy;
