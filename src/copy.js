import { createReadStream, createWriteStream } from 'node:fs';
import { access, rm } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

const copy = async (pathToFile, pathToDir, removeAfter, cb) => {
  try {
    await access(pathToFile);
    const response = await access(pathToDir);

    if (!response) {
      return Promise.reject('Operation failed');
    }
  } catch {
    const readStream = createReadStream(pathToFile, {encoding: 'utf8'});
    const writeStream = createWriteStream(pathToDir);

    await pipeline(
      readStream
        .on('end', async () => {
          if (removeAfter) {
            await rm(pathToFile);
          }
        })
        .on('error', () => {
          console.log('Operation failed');
          cb();
        }),
      writeStream.on('error', () => {
        console.log('Operation failed');
        cb();
      })
    );
  }
};

export default copy;
