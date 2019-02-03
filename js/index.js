var firebaseManager = new FirebaseManager();
var editor = new Editor();
editor.iniciarEditor();
var tema = editor.pegarTema();
firebaseManager.iniciarDB();
var credencial = new Credenciamento();

var TEMA_LOCAL_STORAGE = "editor-theme";

// //Globals
var aceEditor;
var uid = Math.random().toString();
var artigosRef = firebaseManager.pegarArtigos();
var artigo1 = firebaseManager.pegarArtigo1();
//var pilha = firebaseManager.pegarAtualizacoesArtigo1();
var isAtualizacaoPendente = false;
firebaseManager.escutarEventosConteudo(uid, editor);
firebaseManager.escutarEventosUsuario();

//######################## - MANIPULAÇÃO DE EVENTOS - ################
irParaRegistrarUsuario = function() {
  $("#signin").fadeOut();
  $("#signup").fadeIn();
};

voltarParaLogin = function() {
  $("#signin").fadeIn();
  $("#signup").fadeOut();
};

//mudança de credenciais
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("usuario logado");
    firebaseManager.logarUsuario(user.uid);
    firebaseManager.pegarUsuarioPeloId(user.uid);
    // document.getElementById("usuario-logado-nome").innerHTML = data.nome;
    // document.getElementById("email-usuario").innerHTML = data.email;

    $("#credenciamento").fadeOut();
    $("#pagina").fadeIn();
  } else {
    console.log("o usuario saiu");
    $("#credenciamento").fadeIn();
    $("#pagina").fadeOut();
  }
});

editor.aceEditor.on("change", function(e) {
  if (isAtualizacaoPendente) {
    return;
  }

  artigo1.update({
    content: editor.aceEditor.getValue()
  });
  artigo1.update({ lastUserId: uid });

  editor.atualizarEstatisticas();
});

var $mudarLinguagem = $("#linguagem").change(function() {
  artigo1.update({
    linguagem: this.value
  });
  ace
    .edit("editor")
    .getSession()
    .setMode("ace/mode/" + this.value);
  console.log("Linguagem: " + this.value);
});

$("#tema")
  .change(function() {
    editor.setarTema(this.value, TEMA_LOCAL_STORAGE);
  })
  .val(tema);

$("#registrar-btn").click(function() {
  name = document.getElementById("registrar-name").value;
  email = document.getElementById("registrar-email").value;
  password = document.getElementById("registrar-password").value;
  credencial.registrarConta(name, email, password, firebaseManager);
});

$("#login-btn").click(function() {
  email = document.getElementById("login-email").value;
  password = document.getElementById("login-password").value;
  credencial.logar(email, password);
});

$("#logout-btn").click(function() {
  firebaseManager.deslogarUsuario(credencial);
});

$("#registrar").click(function() {
  irParaRegistrarUsuario();
});

$("#voltar-login").click(function() {
  voltarParaLogin();
});

$("#btn-testar").click(function() {
  firebaseManager.pegarUsuariosAtivos().then(dados => {
    console.log("Funciona");
    console.log(dados);
  });
});
