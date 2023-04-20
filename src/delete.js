import { access, rm } from 'node:fs/promises';

const removeFile = async (path) => {
  try {
    await access(path);
    await rm(path);
  } catch {
    throw new Error('Operation failed');
  }
}

export default removeFile;
