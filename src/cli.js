import arg from 'arg';
import inquirer from 'inquirer';
import help from './help';
import scriptHandler from './scriptHandler';
const packageJson = require('../package.json');

function parseArguments(rawArgs) {
    const argsSliced = rawArgs.slice(2);
    const args = arg(
        {
            '--help': Boolean,
            '-h': '--help',
            '--version': Boolean,
            '-v': '--version',
        },
        {
            argv: argsSliced,
        }
    );
    return {
        help: args['--help'] || false,
        version: args['--version'] || false,
        script: args._[0],
        args: argsSliced,
    };
}

export async function cli(args) {
    try{
        let options = parseArguments(args);

        if(options.help) {
            console.log(help);
        } else if (options.version) {
            console.log(packageJson.version);
        } else {
            let valid = true;
            if(options.script) {
                valid = packageJson.availableScripts.includes(options.script);
                if(!valid){
                    console.log("ERROR: Incorrect script!");
                }
            }

            if(!options.script || !valid) {
                const answers = await inquirer.prompt({
                    type: 'list',
                    name: 'script',
                    message: 'Please select which script you want to use',
                    choices: packageJson.availableScripts,
                });
                options.script = answers.script;
            }

            scriptHandler[options.script]();

        }
    } catch(e) {
        console.log(e);
        process.exit(1);
    }

}