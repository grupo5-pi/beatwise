DROP DATABASE IF EXISTS beatwise;
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

-- 1. Criamos a tabela funcionario ANTES (sem a FK de token por enquanto)
CREATE TABLE funcionario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45),
  email VARCHAR(45),
  senha VARCHAR(100),
  fkEmpresa INT NOT NULL,
  fkCargo INT NOT NULL,
  fkSubalterno INT NULL,
  tokenAcesso_id INT,
  foto TEXT,
  CONSTRAINT constFkEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa (id),
  CONSTRAINT constFkCargo FOREIGN KEY (fkCargo) REFERENCES cargo (id),
  CONSTRAINT fk_funcionario_funcionario1 FOREIGN KEY (fkSubalterno) REFERENCES funcionario (id)
);

-- 2. Agora criamos a tabela tokenAcesso (pois funcionario já existe)
CREATE TABLE tokenAcesso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fkFuncionario INT NOT NULL,
    tipo VARCHAR(20),
    codigo CHAR(8),
    expiracao DATETIME,
    statusEnviado TINYINT,
    usado TINYINT,
    tentativas INT,
    falhasEnvio INT,
    criadoEm DATETIME,
    CONSTRAINT fk_token_funcionario FOREIGN KEY (fkFuncionario) REFERENCES funcionario(id)
);

-- 3. Adicionamos a FK de tokenAcesso na tabela funcionario via ALTER TABLE
ALTER TABLE funcionario 
ADD CONSTRAINT fk_funcionario_tokenAcesso1 
FOREIGN KEY (tokenAcesso_id) REFERENCES tokenAcesso (id);

CREATE TABLE log_apache (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alerta VARCHAR(45),
  descricao VARCHAR(200),
  data DATETIME
);

CREATE TABLE log_site (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aviso VARCHAR(45),
  descricao VARCHAR(255),
  pagina VARCHAR(45),
  data DATETIME,
  fkFuncionario INT NOT NULL,
  CONSTRAINT fk_log_site_funcionario1 FOREIGN KEY (fkFuncionario) REFERENCES funcionario (id)
);

CREATE TABLE albumBD (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(200) NOT NULL
);

CREATE TABLE artistaBD (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL
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
  url VARCHAR(400),
  dancabilidade DOUBLE,
  energia DOUBLE,
  tonalidade INT,
  intensidadeSonora DOUBLE,
  acustica DOUBLE,
  instrumentalidade DOUBLE,
  vivicidade DOUBLE,
  valenciaPositividade DOUBLE,
  tempoBPM DOUBLE,
  duracaoMs LONG,
  fluxo LONG,
  CONSTRAINT fk_spotify_musicaBD1 FOREIGN KEY (fkMusicaBD) REFERENCES musicaBD (id)
);

CREATE TABLE youtubeBD (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fkMusicaBD INT NOT NULL,
  url VARCHAR(400),
  titulo VARCHAR(250),
  canal VARCHAR(100),
  visitas LONG,
  curtidas INT,
  comentarios INT,
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
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  featUm VARCHAR(45) NOT NULL,
  featDois VARCHAR(45) NOT NULL,
  featTres VARCHAR(45) NOT NULL,
  fkFuncionario INT NOT NULL,
  CONSTRAINT fk_sugestaoFeat_funcionario1 FOREIGN KEY (fkFuncionario) REFERENCES funcionario (id)
);

CREATE TABLE metricaDash (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  data_inicial DATE,
  data_final DATE,
  genero VARCHAR(45),
  dancabilidade DOUBLE,
  intensidadeSonora DOUBLE,
  vivacidade DOUBLE,
  energia DOUBLE,
  acustica DOUBLE,
  valencia DOUBLE,
  tonalidade DOUBLE,
  intrumentalidade DOUBLE,
  bpm DOUBLE,
  fkFuncionario INT NOT NULL,
  CONSTRAINT fk_metricaDash_funcionario1 FOREIGN KEY (fkFuncionario) REFERENCES funcionario (id)
);

CREATE TABLE notificacao (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fkFuncionario INT NOT NULL,
  CONSTRAINT fk_notificacao_funcionario1 FOREIGN KEY (fkFuncionario) REFERENCES funcionario (id)
);

CREATE TABLE notificacao_acesso (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario TINYINT,
  data TINYINT,
  horario TINYINT,
  paginas TINYINT,
  fkNotificacao INT NOT NULL,
  CONSTRAINT fk_notificacao_acesso_notificacao1 FOREIGN KEY (fkNotificacao) REFERENCES notificacao (id)
);

CREATE TABLE notificacao_atualizacoes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  novas_funcionalidades TINYINT,
  correcoes TINYINT,
  manutencoes TINYINT,
  versoes TINYINT,
  fkNotificacao INT NOT NULL,
  CONSTRAINT fk_notificacao_atualizacoes_notificacao1 FOREIGN KEY (fkNotificacao) REFERENCES notificacao (id)
);

CREATE TABLE notificacao_informativas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  novidades TINYINT,
  dicas TINYINT,
  comunicados TINYINT,
  eventos TINYINT,
  fkNotificacao INT NOT NULL,
  CONSTRAINT fk_notificacao_informativas_notificacao1 FOREIGN KEY (fkNotificacao) REFERENCES notificacao (id)
);

CREATE TABLE notificacao_frequencia (
  id INT PRIMARY KEY AUTO_INCREMENT,
  diaria TINYINT,
  semanal TINYINT,
  mensal TINYINT,
  fkNotificacao INT NOT NULL,
  CONSTRAINT fk_notificacao_frequencia_notificacao1 FOREIGN KEY (fkNotificacao) REFERENCES notificacao (id)
);

INSERT INTO cargo (nome) VALUES
('Admin'),
('Empresa'),
('Produtor'),
('Marketing');

SELECT * FROM musicaBD LIMIT 100;

-- Empresa
INSERT INTO empresa (razaoSocial, email, cnpj, telefone)
VALUES ('BeatWise', 'contato@beatwise.com',
        '12.345.678/0001-90', '(11) 98765-4321');

-- Funcionários: um para cada cargo
INSERT INTO funcionario
    (nome, email, senha, fkEmpresa, fkCargo, fkSubalterno)
VALUES
    ('Administrador', 'admin@beatwise.com', 'Admin123#', 1, 1, NULL),
    ('Responsável', 'empresa@beatwise.com', 'Empresa123#', 1, 2, 1),
    ('Produtor', 'produtor@beatwise.com', 'Produtor123#', 1, 3, 2),
    ('Marketing', 'marketing@beatwise.com', 'Marketing123#', 1, 4, 2);