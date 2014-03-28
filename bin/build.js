'use strict';

var exec = require('child_process').exec;

var buildSteps = [
  // Compile server executable
  {
    message: 'Compiling server...',
    command: 'node ./node_modules/typescript/bin/tsc server/application.ts \
              --out bin/server.js \
              --target ES5 --sourcemap'
  },

  // Compile client executable
  {
    message: 'Compiling client...',
    command: 'node ./node_modules/typescript/bin/tsc client/genovesa.ts \
              --out public/js/genovesa.js \
              --target ES5 --sourcemap'
  },

  // Compile client templates
  {
    message: 'Compiling templates...',
    command: 'node node_modules/handlebars/bin/handlebars client/templates \
              --output public/js/genovesa.templates.js \ '
              //--namespace "Genovesa.Templates"'
  },

  // Minify client executable and templates
  /*{
    message: 'Minifying...',
    command: 'node node_modules/uglify-js/bin/uglifyjs public/js/genovesa.js public/js/genovesa.templates.js \
              --output public/js/genovesa.min.js \
              --in-source-map public/js/genovesa.js.map \
              --source-map public/js/genovesa.min.js.map \
              --source-map-url genovesa.min.js.map \
              --compress --mangle'
  }*/
];

var run = function (commands) {
  if (commands.length < 1) {
    console.log('Done.');
    return;
  }

  var cmd = commands[0];
  console.log(cmd.message);

  exec(cmd.command, function (err, stdout, stderr) {
    if (err) {
      console.log(err);
      console.log(stdout);
      console.log(stderr);
      return;
    }

    commands.shift();
    run(commands);
  });
};

run(buildSteps);
