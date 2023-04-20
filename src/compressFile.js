import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress } from 'node:zlib';
import { access, rm } from 'node:fs/promises';

const compressFile = async (pathToFile, destination, cb) => {
  try {
    await access(pathToFile);
    const compress = createBrotliCompress();
    const readStream = createReadStream(pathToFile);
    const writeStream = createWriteStream(destination);

    readStream
      .pipe(compress)
      .pipe(writeStream)
      .on('finish', async () => {
        try {
          await rm(pathToFile);
        } catch (err) {
        console.log(err);
      }
      cb();
    }).on('error', () => {
        console.log('Operation failed');
        cb();
    });
  } catch (err) {
    console.log('Operation failed');
    cb();
  }
};

export default compressFile;
