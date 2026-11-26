// var ambiente_processo = 'producao';
var ambiente_processo = "desenvolvimento";

var path = require("path");
var caminho_env = path.join(__dirname, ambiente_processo === "producao" ? ".env" : ".env.dev");

require("dotenv").config({ path: caminho_env });

var express = require("express");
var { LogSite } = require("./src/logs/logSite");
var cors = require("cors");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var notificacaoRouter = require("./src/routes/notificacao");
var funcionarioRouter = require("./src/routes/funcionarioRoutes");
var cadastroFuncionarioRouter = require("./src/routes/cadastroFuncionarioRoutes");
var primeiroAcessoRouter = require("./src/routes/primeiroAcessoRoutes");
var metricaRouter = require("./src/routes/metricaRoutes");
var dashboardProdutorRouter = require("./src/routes/dashboardProdutorRoutes");  // MUDOU
var featRouter = require("./src/routes/featRoutes");
var artistaRouter = require("./src/routes/artistaRoutes");
var musicaRouter = require("./src/routes/musicaRoutes");
var dashGravadoraRouter = require("./src/routes/dashGravadoraRoutes");
var dashboardMarketingRouter = require("./src/routes/dashboardMarketingRoutes");
var logRouter = require("./src/routes/logRoutes");



app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));
// Log de acesso às páginas de cadastro e login
app.use(function (req, res, next) {
    if (req.path == "/cadastro.html" || req.path == "/login.html") {
        new LogSite("INFO", "Acessou a página", null, req.path.replace("/", "").replace(".html", "")).registrarLog();
    }
    next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/notificacao", notificacaoRouter);
app.use("/funcionarios", funcionarioRouter); 
app.use("/cadastroFuncionario", cadastroFuncionarioRouter);
app.use("/primeiroAcesso", primeiroAcessoRouter);
app.use("/metricas", metricaRouter);
app.use("/dashboardProdutor", dashboardProdutorRouter);  // MUDOU
app.use("/feats", featRouter);
app.use("/artistas", artistaRouter);
app.use("/musicas", musicaRouter);
app.use("/dashGravadora", dashGravadoraRouter);
app.use("/dashboard", dashboardMarketingRouter);
app.use("/logs", logRouter);


app.listen(PORTA_APP, function () {
    console.log(`
    ██████╗ ███████╗ █████╗ ████████╗██╗    ██╗██╗███████╗███████╗
    ██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║    ██║██║██╔════╝██╔════╝
    ██████╔╝█████╗  ███████║   ██║   ██║ █╗ ██║██║███████╗█████╗
    ██╔══██╗██╔══╝  ██╔══██║   ██║   ██║███╗██║██║╚════██║██╔══╝
    ██████╔╝███████╗██║  ██║   ██║   ╚███╔███╔╝██║███████║███████╗
    ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});