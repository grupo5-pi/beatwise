USE beatwise;

CREATE TABLE tokenAcesso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fkFuncionario INT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    codigo CHAR(8) NOT NULL,
    expiracao DATETIME NOT NULL,
    statusEnviado BOOLEAN NOT NULL DEFAULT FALSE,
    usado BOOLEAN NOT NULL DEFAULT FALSE,
    tentativas INT NOT NULL DEFAULT 0,
    falhasEnvio INT NOT NULL DEFAULT 0,
    criadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT constFkFuncionarioToken FOREIGN KEY (fkFuncionario)
        REFERENCES funcionario (id) ON DELETE CASCADE
);

INSERT INTO empresa (razaoSocial, email, cnpj, telefone)
VALUES ('BeatWise', 'beatwise26@gmail.com', '00.000.000/0001-00', '(11) 90000-0000');

INSERT INTO funcionario (nome, email, senha, fkEmpresa, fkCargo)
VALUES (
           'Admin BeatWise',
           'admin@beatwise.com',
           'Admin@123',
           (SELECT id FROM empresa ORDER BY id LIMIT 1),
       (SELECT id FROM cargo WHERE nome = 'Admin')
    );
