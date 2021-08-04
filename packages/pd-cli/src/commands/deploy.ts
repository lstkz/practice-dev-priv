import { spawn } from 'child_process';
import program from 'commander';
import { getSpawnOptions, cpToPromise } from '../helper';
import { getMaybeStagePasswordEnv } from 'config';

export function init() {
  program
    .command('deploy')
    .option('--stage', 'deploy to stage')
    .action(async ({ stage }) => {
      await cpToPromise(
        spawn('yarn', ['run', 'build'], {
          env: {
            ...process.env,
          },
          ...getSpawnOptions('tester'),
        })
      );
      await cpToPromise(
        spawn('pulumi', ['up', '-s', stage ? 'dev' : 'prod', '-y'], {
          env: {
            ...process.env,
            ...getMaybeStagePasswordEnv(stage),
          },
          ...getSpawnOptions('deploy'),
        })
      );
    });
}
