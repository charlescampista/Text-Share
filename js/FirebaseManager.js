function FirebaseManager() {
  this.db = null;

  this.iniciarDB = function(idArtigo) {
    this.db = firebase.firestore();
  };

  this.pegarArtigo1 = function() {
    return this.db.collection("artigos").doc("artigo1");
  };

  this.atualizarArtigo1 = function(conteudo) {
    return this.db
      .collection("artigos")
      .doc("artigo1")
      .update(conteudo);
  };

  this.pegarArtigos = function() {
    artigosRef = this.db.collection("artigos");
    return artigosRef;
  };

  this.pegarAtualizacoesArtigo1 = function() {
    this.db
      .collection("artigos")
      .doc("artigo1")
      .get()
      .then(function(doc) {
        if (doc.exists) {
          pilha = doc.data().pilhaAtualizacoes;
          return pilha;
        } else {
          console.log("ARTIGO1 NÃO EXISTE");
        }
      })
      .catch(function(error) {
        console.log("ERRO AO BUSCAR ARTIGO1", error);
      });
    return pilha;
  };

  this.criarUsuario = function(name, codigo, userEmail) {
    usuario = {
      id: codigo,
      nome: name,
      email: userEmail,
      logado: true
    };
    console.log("ENTROU NO CRIAR USUARIO");
    this.db
      .collection("users")
      .doc(usuario.id)
      .set(usuario)
      .then(function() {
        console.log("USUARIO INICIADO");
      })
      .catch(function() {
        console.log("ERRO AO INCIAR USUARIO");
      });
  };

  this.logarUsuario = function(id) {
    this.db
      .collection("users")
      .doc(id)
      .update({
        logado: true
      })
      .then(function() {
        console.log("USUARIO LOGIN ATUALIZADO");
      })
      .catch(function() {
        console.log("ERRO AO ATUALIZAR O USUARIO NO LOGIN");
      });
  };

  this.deslogarUsuario = function(credencial) {
    user = credencial.pegarUsuario();
    console.log("Vai deslogar com o id: " + user.uid);
    this.db
      .collection("users")
      .doc(user.uid)
      .update({
        logado: false
      })
      .then(function() {
        console.log("USUARIO LOGOUT ATUALIZADO");
        credencial.deslogar();
      })
      .catch(function() {
        console.log("ERRO AO ATUALIZAR O USUARIO NO LOGOUT");
      });
  };

  this.escutarEventosUsuario = function() {
    function tempAlert(msg, duration) {
      var el = document.createElement("div");
      el.setAttribute(
        "style",
        "position:absolute;top:10%;right:10%;background-color:white; padding: 40px 25px; border-radius: 10px; border: solid 3px black;"
      );
      el.innerHTML = msg;
      setTimeout(function() {
        el.parentNode.removeChild(el);
      }, duration);
      document.body.appendChild(el);
    }

    this.db.collection("users").onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        usuario = change.doc.data();
        if (change.type === "added") {
          console.log("O Editor " + usuario.nome + " agora faz parte do grupo");
          if (usuario.logado) {
            editor.setarUsuario(usuario);
          }
        }
        if (change.type === "modified") {
          if (usuario.logado) {
            // this.pegarUsuariosAtivos().then((dados) => {
            //   console.log("Funciona");
            //   console.log(dados);
            // });
            
            editor.setarUsuario(usuario);
            tempAlert("Usuario " + usuario.nome + " Logado", 5000);
          } else {
            tempAlert("Usuario " + usuario.nome + " Deslogado", 5000);
          }
        }
        if (change.type === "removed") {
          console.log("Editor: " + usuario.nome + " saiu do time");
        }
      });
    });
  };

  this.escutarEventosConteudo = function(id, editor) {
    regex = new Regex();
    this.db.collection("artigos").onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        if (change.type === "modified") {
          lastId = change.doc.data().lastUserId;
          content = change.doc.data().content;
          linguagem = change.doc.data().linguagem;
          if (lastId === id) {
            console.log("Minha atualização no id: " + id);
            console.log("sair da função");
            return;
          }

          isAtualizacaoPendente = true;
          if (content == null || content == "") {
            nCaracteres = regex.contarCaracteres(content);
            nPalavras = regex.contarPalavras(content);
          } else {
            nCaracteres = "Processando...";
            nPalavras = "Processando...";
          }
          editor.setarValor(content);
          editor.atualizarEstatisticas(nCaracteres, nPalavras);
          if ($mudarLinguagem.val() !== linguagem)
            $mudarLinguagem.val(linguagem).change();
          isAtualizacaoPendente = false;
          console.log("VALOR SETADO: " + content);
        }
      });
    });
  };

  // this.pegarUsuariosAtivos = async function() {
  //   dados = [];
  //   reference = this.db.collection("users");
  //   query = reference.where("logado", "==", true);
  //   query.get().then(snapshot => {
  //     snapshot.docs.forEach(doc => {
  //       dados.push(doc.data());
  //     });
  //   });
  //   return dados;
  // };
}
