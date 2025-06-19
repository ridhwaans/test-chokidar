import chokidar from 'chokidar';
import express from 'express';
import { env } from '@/env';
import { existsSync, statSync, createReadStream } from 'fs';

var fileSystem = [] as any;
var ready: any;

const validateEnvPaths = () => {
  const paths = {
    DIR1_PATH: env.DIR1_PATH,
    DIR2_PATH: env.DIR2_PATH,
    DIR3_PATH: env.DIR3_PATH,
  };

  if (new Set(Object.values(paths)).size !== Object.keys(paths).length) {
    throw new Error(
      'Each directory must be in a different subdirectory and cannot share the same directory path(s)',
    );
  }

  for (const [key, value] of Object.entries(paths)) {
    if (!existsSync(value)) {
      throw new Error(
        `${key} does not exist. Check your directory path.`,
      );
    }
  }

  console.log('Env paths check passed');
};

const fileWatcher = () => {
  validateEnvPaths();
  
  const watcher = chokidar.watch(
    [env.DIR1_PATH as string, env.DIR2_PATH as string, env.DIR3_PATH as string],
    {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      usePolling: true,
      interval: 1000
    },
  );

  watcher.on('ready', () => {
    console.log('Initial scan complete. Ready for changes');
    ready = true;
    ready && sync();
  });

  watcher
    .on('add', (path) => {
      console.log(`File ${path} has been added`);
      fileSystem.push(path);
      ready && sync();
    })
    .on('change', (path) => {
      console.log(`File ${path} has been changed`);
    })
    .on('unlink', (path) => {
      console.log(`File ${path} has been removed`);
      fileSystem = fileSystem.filter((e: any) => e !== path);
      ready && sync();
    });
    
    const sync = async () => {

      };
  return watcher;
 }

fileWatcher();
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World');
});



const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
