#!/usr/bin/env node

const findit = require('findit')
const path = require('path')
const fs = require('fs')
const mkdirp = require('node-mkdirp')
const program = require('commander')
const s2ms = s => s / 1000

program
    .option('-c, --copy', 'copy the files')

program
    .command('gather <source> <target>')
    .description('gather all files in source folder to target folder')
    .action((source, target) => {
        const begin = Date.now()
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
        finder.on('end', () => {
            const now = Date.now()
            console.log(`✨  Done in ${s2ms(now - begin)}s`)
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
