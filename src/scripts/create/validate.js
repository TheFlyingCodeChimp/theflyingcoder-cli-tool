//Checks whether the name is valid or a project with the given name exists
//Has to return a string so the inquirer validation can make use of it
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
const packageJson = require('../../../package.json');

function isInvalidName(name) {
    if(!name) {
        return null;
    }

    if (!/^[a-z\-_.]+$/.test(name)) {
        return `Error: Please use only lowercase, hyphens and underscores`;
    }

    if (fs.existsSync(path.join(process.cwd(), name))) {
        return `Error: A directory with this name already exists`;
    }

    return null;
}

async function validateAndPrompt(options) {
    const templateChoices = packageJson.templates.map(template => template.key);
    //If the name is not valid console log
    const invalidNameMessage = isInvalidName(options.name);
    if(!!invalidNameMessage) {
        console.log(chalk.red(invalidNameMessage));
    }
    //Prompt for a new name if name doesn't exist or is invalid
    if(!options.name || !!invalidNameMessage) {
        const answers = await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: 'Please enter a project name',
            validate: input => {
                const message = isInvalidName(input);
                return message || true;
            }
        });
        options.name = answers.name;
    }

    //If the template is passed but not valid console log
    if(options.template && !templateChoices.includes(options.template)) {
        console.log(chalk.red("ERROR: Template does not exist"))
    }
    //prompt for a valid one
    if(!options.template || !templateChoices.includes(options.template)) {
        const answers = await inquirer.prompt({
            type: 'list',
            name: 'template',
            message: 'Please select a valid project template',
            choices: templateChoices,
        });

        options.template = answers.template;
    }

    return options;
}

export default validateAndPrompt;