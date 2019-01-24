function Regex(id, name) {
  this.contarPalavras = function(expression) {
    if (content == null || content == "") {
      return;
    } else {
      return expression.match(/\S+/g).length;
    }
  };

  this.contarCaracteres = function(expression) {
    var myRe = new RegExp(
      "^[a-z A-Z  0-9 çÇ \"' :; /><)(\\| \\] \\[ ´`?!_\\-\\+  *=, {} °ºªôãõ~çÇ#$%¨&-@§¬¢£  âÂàÀáÁéÉèÈíÍ'\" ]{1,}",
      "g"
    );
    var myArray = myRe.exec(expression);
    return (result = myRe.lastIndex);
  };
}
