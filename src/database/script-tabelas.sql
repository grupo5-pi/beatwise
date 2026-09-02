CREATE DATABASE beatwise;
USE beatwise;

CREATE TABLE empresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    nomeEmpresa VARCHAR(45),
    emailEmpresa VARCHAR(45),
    cnpj CHAR(14),
    telefone CHAR(11),
    senha VARCHAR(100)
);

CREATE TABLE acesso (
    idAcesso INT PRIMARY KEY AUTO_INCREMENT,
    tipoAcesso VARCHAR(45)
);

CREATE TABLE funcionario (
    idFuncionario INT PRIMARY KEY AUTO_INCREMENT,
    nomeFuncionario VARCHAR(45),
    areaFuncionario VARCHAR(9),
    CONSTRAINT chAreaFuncionario CHECK (areaFuncionario = 'marketing' OR areaFuncionario = 'produtora'),
    emailFuncionario VARCHAR(45),
    telefone CHAR(11),
    senha VARCHAR(100),
    fkEmpresa INT,
    fkAcesso INT,
    CONSTRAINT constFkEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa (idEmpresa),
    CONSTRAINT constFkAcesso FOREIGN KEY (fkAcesso) REFERENCES acesso (idAcesso)
);

CREATE TABLE musicas (
    idMusica INT PRIMARY KEY AUTO_INCREMENT,
    artista VARCHAR(45),
    nomeMusica VARCHAR(45),
    nomeAlbum VARCHAR(45),
    tipoAlbum VARCHAR(6),
    CONSTRAINT chTipoAlbum CHECK (tipoAlbum = 'single' OR tipoAlbum = 'album'),
    urlSpotify VARCHAR(255),
    dancabilidade DECIMAL(4,3),
    energia DECIMAL(4,3),
    tonalidade DECIMAL(3,1),
    intensidadeSonora DECIMAL(5,4),
    acustica DECIMAL(7,6),
    instrumentalidade DECIMAL(6,5),
    vivicidade DECIMAL(5,4),
    valenciaPositividade DECIMAL(4,3),
    tempoBPM DECIMAL(6,3),
    duracaoMs DECIMAL(6,1),
    urlYoutube VARCHAR(30),
    titulo VARCHAR(30),
    canal VARCHAR(30),
    visitas DECIMAL(10,1),
    curtidas DECIMAL(9,1),
    comentarios DECIMAL(7,1),
    descricao VARCHAR(255),
    licenciado VARCHAR(10),
    CONSTRAINT chLicenciado CHECK (licenciado = 'VERDADEIRO' OR licenciado = 'FALSO'),
    videoOficial VARCHAR(10),
    CONSTRAINT chVideoOficial CHECK (videoOficial = 'VERDADEIRO' OR videoOficial = 'FALSO'),
    fluxo VARCHAR(15)
);