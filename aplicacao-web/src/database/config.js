var mysql = require("mysql2");

// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    multipleStatements: true 
};

function executar(instrucao, valores) {

    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);
        conexao.connect();
        conexao.query(instrucao, valores || [], function (erro, resultados) {
            conexao.end();
            if (erro) {
                reject(erro);
            }
            console.log(resultados);
            resolve(resultados);
        });
        conexao.on('error', function (erro) {
            return ("ERRO NO MySQL SERVER: ", erro.sqlMessage);
        });
    });
}

function executarTransacao(consultas) {
    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);

        conexao.connect(function (erroConexao) {
            if (erroConexao) {
                conexao.destroy();
                reject(erroConexao);
                return;
            }

            conexao.beginTransaction(function (erroTransacao) {
                if (erroTransacao) {
                    conexao.end();
                    reject(erroTransacao);
                    return;
                }

                var resultados = [];

                function rollback(erro) {
                    conexao.rollback(function () {
                        conexao.end();
                        reject(erro);
                    });
                }

                function confirmar() {
                    conexao.commit(function (erroCommit) {
                        if (erroCommit) {
                            rollback(erroCommit);
                            return;
                        }
                        conexao.end();
                        resolve(resultados);
                    });
                }

                function executarProxima(indice) {
                    if (indice === consultas.length) {
                        confirmar();
                        return;
                    }

                    var consulta = consultas[indice];
                    conexao.query(consulta.instrucao, consulta.valores || [], function (erro, resultado) {
                        if (erro) {
                            rollback(erro);
                            return;
                        }
                        resultados.push(resultado);
                        if (consulta.pararSe && consulta.pararSe(resultado)) {
                            confirmar();
                            return;
                        }
                        executarProxima(indice + 1);
                    });
                }

                executarProxima(0);
            });
        });
    });
}

module.exports = {
    executar,
    executarTransacao
};