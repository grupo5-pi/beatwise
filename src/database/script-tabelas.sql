CREATE DATABASE beatwise;
USE beatwise;

CREATE TABLE cargo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45)
);

CREATE TABLE empresa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  razaoSocial VARCHAR(45),
  email VARCHAR(45),
  cnpj CHAR(18),
  telefone CHAR(15)
);

CREATE TABLE funcionario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45),
  email VARCHAR(45),
  senha VARCHAR(100),
  fkEmpresa INT NOT NULL,
  fkCargo INT NOT NULL,
  fkSubalterno INT NOT NULL,
  CONSTRAINT constFkEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa (id),
  CONSTRAINT constFkCargo FOREIGN KEY (fkCargo) REFERENCES cargo (id),
  CONSTRAINT fk_funcionario_funcionario1 FOREIGN KEY (fkSubalterno) REFERENCES funcionario (id)
);

CREATE TABLE log_apache (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alerta VARCHAR(45),
  data DATETIME,
  descricao VARCHAR(255),
  fkFuncionario INT NOT NULL,
	CONSTRAINT constFkFuncionario FOREIGN KEY (fkFuncionario) REFERENCES funcionario (id)
);

CREATE TABLE log_site (
	id INT PRIMARY KEY AUTO_INCREMENT,
    alerta VARCHAR(45),
    data DATETIME,
    descricao VARCHAR(255),
    pagina VARCHAR(45),
    fkFuncionario INT NOT NULL,
      CONSTRAINT constFkFuncionario2 FOREIGN KEY (fkFuncionario) REFERENCES funcionario (id)

);

CREATE TABLE albumBD (
  id INT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL
);

CREATE TABLE artistaBD (
  id INT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL
);

CREATE TABLE musicaBD (
  id INT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  fkAlbumBD INT NOT NULL,
  CONSTRAINT fk_musicaBD_albumBD1 FOREIGN KEY (fkAlbumBD) REFERENCES albumBD (id)
);

CREATE TABLE musicaArtistaBD (
  fkArtistaBD INT NOT NULL,
  fkMusicaBD INT NOT NULL,
  PRIMARY KEY (fkArtistaBD, fkMusicaBD),
  CONSTRAINT fk_artistaBD_has_musicaBD_artistaBD1 FOREIGN KEY (fkArtistaBD) REFERENCES artistaBD (id),
  CONSTRAINT fk_artistaBD_has_musicaBD_musicaBD1 FOREIGN KEY (fkMusicaBD) REFERENCES musicaBD (id)
);

CREATE TABLE spotifyBD (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fkMusicaBD INT NOT NULL,
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
  fluxo VARCHAR(15),
  CONSTRAINT fk_spotify_musicaBD1 FOREIGN KEY (fkMusicaBD) REFERENCES musicaBD (id)
);

CREATE TABLE youtubeBD (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fkMusicaBD INT NOT NULL,
  url VARCHAR(255),
  titulo VARCHAR(30),
  canal VARCHAR(30),
  visitas DECIMAL(10,1),
  curtidas DECIMAL(9,1),
  comentarios DECIMAL(7,1),
  descricao VARCHAR(1000),
  licenciado TINYINT(1),
  videoOficial TINYINT(1),
  CONSTRAINT fk_youtube_musicaBD1 FOREIGN KEY (fkMusicaBD) REFERENCES musicaBD (id)
);

CREATE TABLE acesso (
  fkFuncionario INT NOT NULL,
  fkMusicaBD INT NOT NULL,
  PRIMARY KEY (fkFuncionario, fkMusicaBD),
  CONSTRAINT fk_funcionario_has_musicaBD_funcionario1 FOREIGN KEY (fkFuncionario) REFERENCES funcionario (id),
  CONSTRAINT fk_funcionario_has_musicaBD_musicaBD1 FOREIGN KEY (fkMusicaBD) REFERENCES musicaBD (id)
);

CREATE TABLE sugestaoFeat (
  id INT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  featUm VARCHAR(45) NOT NULL,
  featDois VARCHAR(45) NOT NULL,
  featTres VARCHAR(45) NOT NULL,
  fkFuncionario INT NOT NULL,
  CONSTRAINT fk_sugestaoFeat_funcionario1 FOREIGN KEY (fkFuncionario) REFERENCES funcionario (id)
);

CREATE TABLE metricaDash (
  id INT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  filtroUm VARCHAR(45) NOT NULL,
  filtroDois VARCHAR(45) NOT NULL,
  filtroTres VARCHAR(45) NOT NULL,
  filtroQuatro VARCHAR(45) NOT NULL,
  filtroCinco VARCHAR(45) NOT NULL,
  fkFuncionario INT NOT NULL,
  CONSTRAINT fk_metricaDash_funcionario1 FOREIGN KEY (fkFuncionario) REFERENCES funcionario (id)
);

CREATE TABLE notificacao (
  id INT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  notificacaoUm VARCHAR(45) NOT NULL,
  notificacaoDois VARCHAR(45) NOT NULL,
  notificacaoTres VARCHAR(45) NOT NULL,
  notificacaoQuatro VARCHAR(45) NOT NULL,
  fkFuncionario INT NOT NULL,
  CONSTRAINT fk_notificacao_funcionario1 FOREIGN KEY (fkFuncionario) REFERENCES funcionario (id)
);