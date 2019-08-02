import chalk from 'chalk';
import request from 'request';
import fs from 'fs';

async function download(url, zipLocation) {
    console.log(chalk.cyan(`Acquiring template project from ${url}...`));
    const res = request.get(url);
    const fileStream = fs.createWriteStream(zipLocation, { autoClose: true });
    res.pipe(fileStream);

    return new Promise(function(resolve, reject) {
        res.on('error', reject);
        fileStream.on('finish', () => {
            console.log(chalk.green('Download complete'));
            resolve()
        });
    });
}

export default download;