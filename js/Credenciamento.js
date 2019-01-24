function Credenciamento() {
  this.logar = function(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  this.deslogar = function() {
    firebase.auth().signOut().then(function() {
      console.log("Usuario Saiu");
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }

  this.registrarConta = function(name, email, password, fbManager) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function(user) {
        console.log("A AUTENTICAÇÃO FUNCIONOU");
        var user = firebase.auth().currentUser;
        if (user) {
          email = user.email;
          emailVerified = user.emailVerified;
          uid = user.uid;
          console.log(email);
          console.log(emailVerified);
          console.log(uid);
          fbManager.criarUsuario(name, user.uid, user.email);
        } else {
          console.log("Não há usuario logado");
        }
      })
      .catch(function(error) {
        console.log("A AUTENTICAÇÃO CAPTURA DE ERRO");
      });
  };

  this.pegarUsuario = function() {
    var user = firebase.auth().currentUser;
    if (user) {
      console.log("Pegou o usuario");
      return user;
    } else {
      console.log("Erro ao pegar o usuario");
      return null;
    }
  };

}
