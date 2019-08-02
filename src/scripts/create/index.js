import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import rimraf from 'rimraf';
import {spawnSync} from 'child_process';
import os from 'os';
import chalk from 'chalk';

import parseArguments from './parseArguments';
import validate from './validate';
import download from './download';
import extract from './extract';
import camel from '../camelMessages';

const packageJson = require('../../../package.json');

const create = async (args) => {
    const options = await validate(parseArguments(args));
    const destination = path.join(process.cwd(), options.name);
    const template = packageJson.templates.find(template => template.key === options.template);
    const downloadLink = `${template.url}/archive/${template.branch}.zip`;
    try {
        fs.mkdirSync(destination);
        await tmp.dir({unsafeCleanup: true}, async (err, tempDir, cleanupTempDir) => {
            const zipLocation = path.join(tempDir, 'repo.zip');
            await download(downloadLink, zipLocation);
            await extract(zipLocation, destination, template);
            cleanupTempDir();
            if (options.runInstall) {
                console.log(chalk.cyan('Running npm install in the project directory...'));
                const npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';
                spawnSync(npmCmd, ['i'], {env: process.env, cwd: destination, stdio: 'inherit'})
            }
            if (!!template.initialiseScript) {
                console.log(chalk.cyan('Running initialisation script...'));
                const script = require(`${destination}/${template.initialiseScript}`);
                await script(options);
                console.log(chalk.green('Initialisation script completed'));
                console.log(chalk.cyan('Removing initialisation script from project...'));
                fs.unlinkSync(`${destination}/${template.initialiseScript}`);
                console.log(chalk.green('Script removed'));
            }
        });

        camel.success('Project creation complete... Happy coding!!')
    } catch (e) {
        rimraf.sync(destination);
        process.exit(1);
    }
};

export default create;