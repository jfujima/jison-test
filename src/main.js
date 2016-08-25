/*
  main.js
  refer https://github.com/zaach/jison/blob/master/web/content/assets/js/try.js
 */

var Jison = require('jison');
var bnf = require('ebnf-parser');

var parser;
var parser2;

print = function (){}

var printOut = function(str) {
  document.querySelector('#out').innerHTML = str;
};

function processGrammar() {
  var type = "lalr";

  var grammar = document.querySelector('#grammar').value;
  try {
    var cfg = JSON.parse(grammar);
  } catch (e) {
    try {
      var cfg = bnf.parse(grammar);
    } catch (e) {
      let genOut = document.querySelector('#gen_out');
      genOut.innerHTML = 'Oops. Make sure your grammar is in the correct format.\n' + e;
      genOut.classList.add('bad');
      return;
    }
  }

  console.log(cfg);
  Jison.print = function() {};
  parser = Jison.Generator(cfg, { type: type });

  let out = document.querySelector('#out');
  out.classList.remove('good', 'bad');
  out.innerHTML = '';

  let genOut = document.querySelector('#gen_out');
  genOut.classList.remove('good', 'bad');

  if (!parser.conflicts) {
    genOut.innerHTML = 'Generated successfully!';
    genOut.classList.add('good');
  } else {
    genOut.innerHTML = 'Conflicts encountered:<br/>';
    genOut.classList.add('bad');
  }

  parser.resolutions.forEach(function(res) {
    var r = res[2];
    if (!r.bydefault) return;
    genOut.innerHTML = genOut.innerHTML += r.msg + '\n' + '(' + r.s + ', ' + r.r + ') -> ' + r.action;
  });

  parser2 = parser.createParser();
}


function runParser() {
 let out = document.querySelector('#out');

  if (!parser) processGrammar();
  printOut('Parsing...');
  var source = document.querySelector('#source').value;
  try {
    out.classList.remove('bad');
    out.classList.add('good');
    printOut(JSON.stringify(parser2.parse(source)));
  } catch (e) {
    out.classList.remove('good');
    out.classList.add('bad');
    printOut(e.message || e);
  }
}


function submitGrammer() {
  console.log('submit grammer');
  processGrammar();

}

function submitSource() {
  console.log('submit source');
  runParser();
}


var generateBtn = document.querySelector('#generate_btn');
generateBtn.addEventListener('click', submitGrammer);

var generateBtn = document.querySelector('#parse_btn');
generateBtn.addEventListener('click', submitSource);

