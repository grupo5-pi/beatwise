DROP DATABASE beatwise;

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
  fkSubalterno INT,
  CONSTRAINT constFkEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa (id),
  CONSTRAINT constFkCargo FOREIGN KEY (fkCargo) REFERENCES cargo (id),
  CONSTRAINT fk_funcionario_funcionario1 FOREIGN KEY (fkSubalterno) REFERENCES funcionario (id)
);

CREATE TABLE log_apache (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alerta VARCHAR(45),
  data DATETIME,
  descricao VARCHAR(255)
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
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(200) NOT NULL
);

CREATE TABLE artistaBD (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(60) NOT NULL
);

CREATE TABLE musicaBD (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(200) NOT NULL,
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
  dancabilidade DECIMAL(10,6),
  energia DECIMAL(10,6),
  tonalidade INT,
  intensidadeSonora DECIMAL(20,15),
  acustica DECIMAL(10,6),
  instrumentalidade DECIMAL(10,6),
  vivicidade DECIMAL(10,6),
  valenciaPositividade DECIMAL(10,6),
  tempoBPM DECIMAL(10,6),
  duracaoMs LONG,
  fluxo LONG,
  CONSTRAINT fk_spotify_musicaBD1 FOREIGN KEY (fkMusicaBD) REFERENCES musicaBD (id)
);

CREATE TABLE youtubeBD (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fkMusicaBD INT NOT NULL,
  url VARCHAR(255),
  titulo VARCHAR(200),
  canal VARCHAR(70),
  visitas LONG,
  curtidas INT,
  comentarios INT,
  descricao VARCHAR(3000),
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

INSERT INTO cargo (nome) VALUES
('Admin'),
('Empresa'),
('Produtor'),
('Marketing');

SELECT * FROM log_apache;
SELECT * FROM musicaBD limit 10000;