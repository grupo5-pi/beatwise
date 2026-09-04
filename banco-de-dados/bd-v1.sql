CREATE DATABASE beatwise;
USE beatwise;

CREATE TABLE empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    razaoSocial VARCHAR(45),
    email VARCHAR(45),
    cnpj CHAR(14),
    telefone CHAR(11)
);

CREATE TABLE cargo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45)
);

CREATE TABLE funcionario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    email VARCHAR(45),
    senha VARCHAR(100),
    fkEmpresa INT,
    fkCargo INT,
    CONSTRAINT constFkEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa (iD),
    CONSTRAINT constFkCargo FOREIGN KEY (fkCargo) REFERENCES cargo (id)
);

CREATE TABLE artista(
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(45)
);

CREATE TABLE album (
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(45)
);

CREATE TABLE musica (
    id INT AUTO_INCREMENT,
    fkArtista INT,
    PRIMARY KEY (id, fkArtista),
    fkAlbum INT,
    nome VARCHAR(45),
    CONSTRAINT constFkArtista FOREIGN KEY (fkArtista) REFERENCES artista (id),
    CONSTRAINT constFkAlbum FOREIGN KEY (fkAlbum) REFERENCES album (id)
);

CREATE TABLE spotify (
	id INT AUTO_INCREMENT,
	fkMusica INT,
	fkArtista INT,
    PRIMARY KEY (id, fkMusica, fkArtista),
	url VARCHAR(255),
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
	CONSTRAINT constFkMusicaSpotify FOREIGN KEY (fkMusica, fkArtista) REFERENCES musica (id, fkArtista)
);

CREATE TABLE youtube (
	id INT AUTO_INCREMENT,
    fkMusica INT,
    fkArtista INT,
    PRIMARY KEY (id, fkMusica, fkArtista),
    url VARCHAR(30),
    titulo VARCHAR(30),
    canal VARCHAR(30),
    visitas DECIMAL(10,1),
    curtidas DECIMAL(9,1),
    comentarios DECIMAL(7,1),
    descricao VARCHAR(255),
    licenciado BOOLEAN,
    videoOficial BOOLEAN,
    fluxo VARCHAR(15),
	CONSTRAINT constFkMusicaYoutube FOREIGN KEY (fkMusica, fkArtista) REFERENCES musica (id, fkArtista)
);