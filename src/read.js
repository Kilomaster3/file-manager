import { createReadStream } from 'node:fs';

const readFile = async (path, cb) => {
  const readStream = createReadStream(path, 'utf-8');

  readStream.on('data', (chunk) => {
    process.stdout.write(`Data: ${chunk}\n`);
    cb();
  });

  readStream.on('err', () => {
    process.stdout.write('Error\n');
    cb();
  });
};

export default readFile;
