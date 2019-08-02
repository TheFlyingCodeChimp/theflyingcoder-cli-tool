import {ncp} from 'ncp';
import tmp from 'tmp';
import path from 'path';
import extract from 'extract-zip';
import chalk from 'chalk';

async function extractToDestination(zipLocation, destination, template) {
    console.log(chalk.cyan('Extracting zip to temporary folder...'));
    return new Promise(function(resolve, reject) {
        tmp.dir({ unsafeCleanup: true }, async (err, tempDir, cleanupTempDir) => {
            extract(zipLocation, {dir: tempDir}, function (err) {
                if(err) {
                    reject('Zip extraction failed');
                }
                console.log(chalk.green('Extraction complete'));
                const templatePath = path.join(tempDir, `${template.repo}-${template.branch}/${template.key}`);
                console.log(chalk.cyan(`Copying template to ${destination}...`));
                ncp(templatePath, destination, function (err) {
                    if (err) {
                        reject('Folder copying failed');
                    }
                    console.log(chalk.green('Copy complete!'));
                    cleanupTempDir();
                    resolve()
                });
            });
        });
    });
}

export default extractToDestination;