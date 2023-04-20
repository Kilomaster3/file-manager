import { readdir } from 'node:fs/promises';

const list = async (path) => {
  try {
    const result = await readdir(path, { withFileTypes: true });
    return result;
  } catch {
    throw new Error('Operation failed');
  }
};

export default list;
