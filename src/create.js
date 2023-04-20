import {access, appendFile} from 'node:fs/promises';

const createFile = async (path) => {
  try {
    const response = await access(path);
    if(!response) {
      return Promise.reject(new Error('Operation failed'));
    }
  } catch {
    await appendFile(path, '');
  }
};

export default createFile;
