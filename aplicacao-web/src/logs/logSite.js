var CARGOS = { 1: "Admin", 2: "Empresa", 3: "Produtor", 4: "Marketing" };

class Usuario {
    constructor(id, nome, email, fkCargo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cargo = CARGOS[fkCargo];
    }
}

class Log {
    constructor(nivel, mensagem) {
        this.dataLog = new Date();
        this.nivel = nivel;
        this.mensagem = mensagem;
    }

    exibirLog() {
        return `[${this.dataLog.toLocaleString("pt-BR")}] [${this.nivel}] - ${this.mensagem}`;
    }
}

class LogSite extends Log {
    constructor(nivel, mensagem, usuario, pagina) {
        super(nivel, mensagem);
        this.usuario = usuario; // agregação: o log TEM um usuário (null = visitante)
        this.pagina = pagina;
    }

    exibirLog() {
        var quem = "visitante";
        if (this.usuario) {
            quem = this.usuario.nome || this.usuario.email;
            if (this.usuario.cargo) quem += ` (${this.usuario.cargo})`;
        }
        return `${super.exibirLog()} - [Página: ${this.pagina}] - {Usuário: ${quem}}`;
    }

    registrarLog() {
        console.log(this.exibirLog());

        var u = this.usuario;
        var urlJava = process.env.LOG_URL || "http://localhost:8081/log";

        // Envia o log em tempo real para o Java, que salva no banco
        return fetch(urlJava, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                nivel: this.nivel,
                mensagem: this.mensagem,
                pagina: this.pagina,
                idUsuario: String(u && u.id != null ? u.id : ""),
                nome: String(u && u.nome ? u.nome : ""),
                email: String(u && u.email ? u.email : ""),
                cargo: String(u && u.cargo ? u.cargo : "")
            })
        }).catch(function (erro) {
            console.log("Não consegui enviar o log pro Java:", erro.message);
        });
    }
}

module.exports = { Usuario, LogSite };
