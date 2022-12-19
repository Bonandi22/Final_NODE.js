const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');
const conn = require('./connection');
const Usuario = require('./models/Usuario');
const { where } = require('sequelize');
const app = express();

const user = "luizjunior";
const password ="admin123";

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));

app.use(session({
    secret:'cursonodejs',
    resave:true,
    saveUninitialized:true,
}))

app.get('/',function(req,res){
    res.render('home');
})
app.get('/quemsomos',function(req,res){
    res.render('sobre');
})
app.get('/login',function(req,res){
    res.render('login');
})
app.post('/login',function(req,res){
    const login = req.body
    const usuario = login.usuario;
    const senha = login.senha;
    if(usuario == user && senha == password){
        req.session.user = user;

        res.redirect('/admin');
    }else{
        res.redirect('/login');
    }
})
app.get('/admin',function(req,res){
    if(req.session.user){
        const userlogado = user;
        res.render('admin',{usuario:userlogado})
    }else{
        res.redirect('/login')
    }
    
})

app.get('/sair',function(req,res){
    req.session.destroy();
    res.redirect('/login');
})

app.get('/usuarios', function(req,res){
    res.render('usuarios');
});

app.post('/usuarios', async function(req,res){
    const usuarios = req.body;

    const nome = usuarios.nome;
    const usuario = usuarios.usuario;
    const senha = usuarios.senha;
    const tipo = usuarios.tipo;
    const status =usuarios.status;

    await Usuario.create({nome, usuario,senha,tipo,status})
    res.redirect('/listar')
})

app.get('/usuario/:id',async function(req,res){
    const id =  req.params.id;
    const dados  = await Usuario.findOne({raw:true, where:{id:id}}) ;
    res.render('usuario',{dados})
})

app.get('/listar',async function(req,res){
    const dados = await Usuario.findAll({raw:true});
    res.render('listaruser',{usuarios:dados})
})

app.post('/atualizar', async function(req, res){
    const dados = req.body;
    const id = dados.id;
    const nome = dados.nome;
    const usuario = dados.usuario;
    const senha = dados.senha;
    const tipo = dados.tipo;
    const status = dados.status;

    await Usuario.update(dados, {where:{id:id}});
    res.redirect('/listar');
})

app.get ('/excluir/:id', async function(req, res){
    const id = req.params.id;

    await Usuario.destroy({where:{id:id}})
    res.redirect('/listar');
})

conn
.sync()
.then(()=>{
    app.listen(3000)
}).catch((err)=>console.log(err));