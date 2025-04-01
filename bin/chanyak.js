const { program } = require('commander');
const { compile } = require('../dist/compiler');
const fs = require('fs');

program
  .command('compile <file>')
  .action((file) => {
    const code = fs.readFileSync(file, 'utf-8');
    console.log(compile(code));
  });

program.parse();