function Editor() {
  this.aceEditor = ace.edit("editor");

  this.iniciarEditor = function() {
    this.aceEditor = ace.edit("editor");
    this.aceEditor.setTheme("ace/theme/monokai");
    this.aceEditor.session.setMode("ace/mode/javascript");
    this.aceEditor.$blockScrolling = Infinity;
  };

  this.atualizarEditor = function(valor) {
    this.aceEditor
      .getSession()
      .getDocument()
      .applyDeltas([valor]);
  };

  this.pegarTema = function() {
    return localStorage.getItem(TEMA_LOCAL_STORAGE) || "ace/theme/monokai";
  };

  this.setarTema = function(tema, ls_key) {
    this.aceEditor.setTheme(tema);
    try {
      localStorage.setItem(ls - key, tema);
    } catch (e) {}
  };

  this.pegarCursor = function() {
    return ace.edit(editor).selection.getCursor();
  }

  this.irParaLinha  = function(linha) {
    ace.edit.gotoLine(linha);
  }

  this.setarValor = function(content) {
    this.aceEditor.setValue(content);
  };

  this.pegarValor = function(content) {
    this.aceEditor.getValue();
  };

  this.atualizarEstatisticas = function(numeroCaracteres,numeroPalavras) {
    document.getElementById("ncaracteres").innerHTML = numeroCaracteres;
    document.getElementById("npalavras").innerHTML = numeroPalavras;
  };

  this.setarUsuario = function(usuario) {
    document.getElementById("usuario-logado-nome").innerHTML = usuario.nome;
    document.getElementById("email-usuario").innerHTML = usuario.email;
    document.getElementById("usuarios-logados").innerHTML = "<li>"+usuario.nome+"</li>";
  };
}
