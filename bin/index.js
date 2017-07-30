#!/usr/bin/env node

const findit = require('findit')
const path = require('path')
const fs = require('fs')
const mkdirp = require('node-mkdirp')
const program = require('commander')

program
    .option('-c, --copy', 'copy the files')

program
    .command('gather <source> <target>')
    .description('gather all files in source folder to target folder')
    .action((source, target) => {
        const finder = findit(source)
        mkdirp(target)

        finder.on('file', (oldpath, stat) => {
            const newpath = path.join(target, path.basename(oldpath))

            if (program.copy) {
                fs.createReadStream(oldpath)
                    .pipe(fs.createWriteStream(newpath))
            }
            else {
                fs.rename(oldpath, newpath)
            }
        })
    })
    .on('--help', function() {
        console.log('')
        console.log('  Examples:')
        console.log('')
        console.log(`    $ ${program.name()} gather source-folder target-folder`)
    })

program.parse(process.argv)

if (!program.args.length) {
    program.help()
}
