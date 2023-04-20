import { rename as renameNode } from 'node:fs/promises';
import { access } from 'node:fs';

const renameFile = async (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    access(newPath, async (err) => {
      err ? await renameNode(oldPath, newPath) : reject(new Error('Operation failed'));
    });
  });
};

export default renameFile;
