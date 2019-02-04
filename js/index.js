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

//Preenche o select com os artigos exitentes
popularArtigos = function(firebaseMagager) {
    db = firebaseMagager.pegarDB();
    db
    .collection("artigos")
    .get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        if(typeof doc.data().nome !== 'undefined') {
          console.log(doc.data().nome);
          option = document.createElement("option");
          option.value = doc.data().nome;
          option.innerHTML = doc.data().nome;
          select = document.getElementById("artigo");
          select.appendChild(option);
        }
      });
    });
  
};
popularArtigos(firebaseManager);

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

//Captura as Mudanças no Editor
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

//Captura As mudanças na Linguagem de Programação
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

//Captura a Mudança do tema
$("#tema")
  .change(function() {
    editor.setarTema(this.value, TEMA_LOCAL_STORAGE);
  })
  .val(tema);

  //Evento para registra conta
$("#registrar-btn").click(function() {
  name = document.getElementById("registrar-name").value;
  email = document.getElementById("registrar-email").value;
  password = document.getElementById("registrar-password").value;
  credencial.registrarConta(name, email, password, firebaseManager);
});

//Envento de Clique login
$("#login-btn").click(function() {
  email = document.getElementById("login-email").value;
  password = document.getElementById("login-password").value;
  credencial.logar(email, password);
});

//Evento de Clique LogOut
$("#logout-btn").click(function() {
  firebaseManager.deslogarUsuario(credencial);
});

//Vai Para  a Pagina de Registro
$("#registrar").click(function() {
  irParaRegistrarUsuario();
});

//Volta Para pagina  de login
$("#voltar-login").click(function() {
  voltarParaLogin();
});


//Botão para a realização de testes durante o desenvolvimento, será  removido depois
$("#btn-testar").click(function() {
  // firebaseManager.pegarUsuariosAtivos().then(dados => {
  //   console.log("Funciona");
  //   console.log(dados);
  // });
  popularArtigos(firebaseManager);
  console.log("Teste");
  
});
