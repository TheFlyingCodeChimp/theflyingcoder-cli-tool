import arg from 'arg/index';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--git': Boolean,
            '--no-install': Boolean,
            '-g': '--git',
            '-i': '--no-install',
        },
        {
            argv: rawArgs,
        }
    );
    return {
        git: args['--git'] || false,
        runInstall: args['--no-install'] || true,
        name: args._[1],
        template: args._[2],
    };
}

export default parseArgumentsIntoOptions;