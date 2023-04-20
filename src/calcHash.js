import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const calcHash = async (path) => {
  try {
    const buffer = await readFile(path);
    const calculateHash = createHash('sha256');
    calculateHash.update(buffer);

    const hex = calculateHash.digest('hex');
    console.log(hex);
  } catch {
    console.log('Operation failed');
  }
};

export default calcHash;
