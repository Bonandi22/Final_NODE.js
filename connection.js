const sequelize = require('sequelize');
const conexao = new 
sequelize('aula2','root','',{  //banco de dados, usuario , senha
    host:'localhost',          // trabalhando local, poderia ser url externo, caso seja externo
    dialect:'mysql',           //banco de dados que utlizando 
})
try{                           // tipo um if/else para autenticar ao banco de dados mysql
    conexao.authenticate();
    console.log("Conectado ao Mysql!")
}catch(err){                    // mensagem de erro, caso nao haja conexao ao banco de dados mysql
console.log("Deu erro, err")
}
module.exports = conexao;