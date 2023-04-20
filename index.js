import { rename } from 'node:fs/promises';

import * as os from 'node:os';
import { access } from 'node:fs';
import path from 'node:path';

import list from './src/list.js';
import read from './src/read.js';
import removeFile from './src/delete.js';
import createFile from './src/create.js';
import decompressFile from './src/decompressFile.js';
import compressFile from './src/compressFile.js';
import copyFile from './src/copy.js';
import calcHash from './src/calcHash.js';


const homedirPath = os.homedir();
process.chdir(homedirPath);

const showPathToWorkingDir = () => {
  console.log(`You are currently in ${process.cwd()}`);
}

const userName = process.argv.length > 2 ? process.argv[2].match(/--username\s*=\s*(.*)/)[1] : 'guest';

console.log(`Welcome to the File Manager, ${userName}!`);
showPathToWorkingDir();

process.stdin.on('data', async (data) => {
  if (data.toString().match('.exit')) {
    console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
    process.exit();
  }

  else if (data.toString().match('up\n')) {
    const currentDir = process.cwd();
    process.chdir(path.dirname(currentDir));
    showPathToWorkingDir();
  }

  else if (data.toString().match(/^cd\s+/g)) {
    const currentDir = process.cwd();
    const enteredPath = data.toString().match(/cd\s+(.*)/)[1];
    try {
      process.chdir(path.resolve(currentDir, enteredPath));
    } catch (err) {
      console.log('Invalid input');
    } finally {
      showPathToWorkingDir();
    }
  }

  else if (data.toString().match(/^ls\n/)) {
    const currentDir = process.cwd();
    const filesList = await list(path.resolve(currentDir));

    const sortedFileList = filesList.map((item) => {
        if (item.isDirectory()) {
          return { Name: item.name, Type: 'directory' };
        }

        return { Name: item.name, Type: 'file' };
      })
      .sort((a, b) => {
        if (a.Type > b.Type) {
          return 1;
        }
        if (a.Type < b.Type) {
          return -1;
        }

        return 0;
      });

    console.table(sortedFileList, ['Name', 'Type']);
    showPathToWorkingDir();
  }

  else if (data.toString().match(/^cat\s+(.*)\n/)) {
    const currentDir = process.cwd();
    const path = data.toString().match(/cat\s+(.*)/)[1];
    const pathToFile = path.resolve(currentDir, path);
    await read(pathToFile, showPathToWorkingDir);
  }

  else if (data.toString().match(/^add\s+(.*)\n/)) {
    const currentDir = process.cwd();
    const file = data.toString().match(/add\s+(.*)/)[1];
    const pathToNewFile = path.resolve(currentDir, file);

    try {
      await createFile(pathToNewFile);
    } catch {
      console.log('File already exists');
    } finally {
      showPathToWorkingDir();
    }
  }

  else if (data.toString().match(/^rn\s*(.*)\s+(.*)\n/)) {
    const currentDir = process.cwd();
    const enteredString = data.toString().match(/^rn\s+(.+)\s+(.+)/);
    const enteredPath = enteredString[1];
    const fileName = enteredString[2];
    const oldPath = path.resolve(currentDir, enteredPath);
    const oldPathDirName = path.dirname(oldPath);
    const newPath = path.resolve(oldPathDirName, fileName);

    access(newPath, async (err) => {
      if (err) {
        try {
          await rename(oldPath, newPath);
        } catch {
          console.log('No such file or directory');
        } finally {
          showPathToWorkingDir();
        }
      } else {
        console.log('Operation failed');
      }
    });
  }

  else if (data.toString().match(/^rm\s+/g)) {
    const currentDir = process.cwd();
    const path = data.toString().match(/rm\s+(.*)/)[1];
    const pathToFile = path.resolve(currentDir, path);
    await removeFile(pathToFile);
    showPathToWorkingDir();
  }

  else if (data.toString().match(/^os\s+--(.+)/g)) {
    const enteredArgs = data.toString().match(/^os\s+--(.+)/)[1];

    if (enteredArgs === 'EOL') {
      console.log(JSON.stringify(os.EOL));
      showPathToWorkingDir();
    } else if (enteredArgs === 'cpus') {
      console.log(os.cpus());
      showPathToWorkingDir();
    } else if (enteredArgs === 'homedir') {
      console.log(os.homedir());
      showPathToWorkingDir();
    } else if (enteredArgs === 'username') {
      const { username } = os.userInfo();
      console.log(username);
      showPathToWorkingDir();
    } else if (enteredArgs === 'architecture') {
      console.log(os.arch());
      showPathToWorkingDir();
    } else {
      console.log('Invalid input');
      showPathToWorkingDir();
    }
  }

  else if (data.toString().match(/^(cp|mv)\s*(.*)\s+(.*)\n/)) {
    const currentDir = process.cwd();
    const enteredString = data.toString().match(/^(cp|mv)\s+(.+)\s+(.+)/);
    const operation = enteredString[1];
    const pathToFile = path.resolve(currentDir, enteredString[2]);
    const name = path.parse(pathToFile);

    const pathToNewDir = path.resolve(currentDir, enteredString[3], name.base);

    try {
      await copyFile(pathToFile, pathToNewDir, operation === 'mv', showPathToWorkingDir);
      showPathToWorkingDir();
    } catch (error) {
      console.log(error);
    }
  }

  else if (data.toString().match(/^hash\s+/g)) {
    const currentDir = process.cwd();
    const path = data.toString().match(/hash\s+(.*)/)[1];
    const pathToFile = path.resolve(currentDir, path);
    await calcHash(pathToFile);
    showPathToWorkingDir();
  }

  else if (data.toString().match(/^(compress|decompress)\s+(.*)\s+(.*)\n/g)) {
    const currentDir = process.cwd();
    const enteredString = data.toString().match(/^(compress|decompress)\s+(.+)\s+(.+)/);
    const operation = enteredString[1];
    const pathToFile = path.resolve(currentDir, enteredString[2]);
    const fileName = path.parse(pathToFile);
    const pathToDestination = path.resolve(currentDir, enteredString[3], `${operation === 'compress' ? `${fileName.base}.br` : fileName.name}`);

    try {
      operation === 'compress'
      ? await compressFile(pathToFile, pathToDestination, showPathToWorkingDir)
      : await decompressFile(pathToFile, pathToDestination, showPathToWorkingDir);
    } catch (err) {
      console.log('Invalid input');
    }
  } else {
    console.log('Invalid input');
    showPathToWorkingDir();
  }
});

process.on('SIGINT', () => {
  console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
  process.exit();
});
