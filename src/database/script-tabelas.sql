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

CREATE TABLE tokenAcesso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fkFuncionario INT NOT NULL,
    tipo VARCHAR(20),
    codigo CHAR(8),
    expiracao DATETIME,
    statusEnviado TINYINT NOT NULL DEFAULT 0,
    usado TINYINT NOT NULL DEFAULT 0,
    tentativas INT NOT NULL DEFAULT 0,
    falhasEnvio INT NOT NULL DEFAULT 0,
    criadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_token_funcionario FOREIGN KEY (fkFuncionario) REFERENCES funcionario(id)
);

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

INSERT INTO empresa (razaoSocial, email, cnpj, telefone)
VALUES ('BeatWise', 'contato@beatwise.com',
        '12.345.678/0001-90', '(11) 98765-4321');

INSERT INTO funcionario
    (nome, email, senha, fkEmpresa, fkCargo, fkSubalterno)
VALUES
    ('Administrador', 'admin@beatwise.com', 'Admin123#', 1, 1, NULL),
    ('Responsável', 'empresa@beatwise.com', 'Empresa123#', 1, 2, 1),
    ('Produtor', 'produtor@beatwise.com', 'Produtor123#', 1, 3, 2),
    ('Marketing', 'marketing@beatwise.com', 'Marketing123#', 1, 4, 2);


ALTER TABLE sugestaoFeat
  ADD COLUMN genero VARCHAR(45) NULL,
  ADD COLUMN energia INT NULL,
  ADD COLUMN dancabilidade INT NULL,
  ADD COLUMN bpmMin INT NULL,
  ADD COLUMN bpmMax INT NULL,
  ADD COLUMN tonalidade INT NULL,
  ADD COLUMN intervaloAnos INT NULL;

  ALTER TABLE musicaBD
  ADD COLUMN generoPadrao VARCHAR(45) NULL;

UPDATE musicaBD SET generoPadrao = CASE
    WHEN genero IS NULL THEN NULL
    WHEN genero LIKE '%christmas%' OR genero LIKE '%holiday%' OR genero LIKE '%children%' OR genero IN ('Soundtrack', 'Original Score', 'TV Soundtrack', 'Video Game', 'Musicals', 'Comedy', 'Spoken Word', 'Sound Effects', 'Worldwide', 'Arabesque', 'Halk', 'Turkish', 'Modern Era', 'Instrumental', 'New Age') THEN 'Outros'
    WHEN genero LIKE '%brazil%' OR genero IN ('MPB', 'Pagode', 'Samba', 'Forró', 'Axé', 'Bossa Nova') THEN 'Brasileiro'
    WHEN genero LIKE '%sertanej%' THEN 'Sertanejo'
    WHEN genero LIKE '%funk%' THEN 'Funk'
    WHEN genero LIKE '%indian%' OR genero LIKE '%bollywood%' OR genero LIKE '%punjabi%' OR genero IN ('Tamil', 'Telugu', 'Hindi', 'Malayalam', 'Indo Pop') THEN 'Indiano'
    WHEN genero LIKE '%afro%' OR genero LIKE '%amapiano%' OR genero LIKE '%african%' OR genero IN ('Alte') THEN 'Afrobeats'
    WHEN genero LIKE '%latin%' OR genero LIKE '%tropical%' OR genero LIKE '%mexican%' OR genero LIKE '%reggaeton%' OR genero IN ('Flamenco', 'Baladas y Boleros', 'Bolero', 'Raíces', 'Iberia', 'Tex-Mex', 'Rock y Alternativo') THEN 'Latino'
    WHEN genero LIKE '%reggae%' OR genero LIKE '%dancehall%' OR genero IN ('Ska') THEN 'Reggae'
    WHEN genero LIKE '%hip-hop%' OR genero LIKE '%rap%' OR genero IN ('Dirty South') THEN 'Rap'
    WHEN genero LIKE '%r&b%' OR genero LIKE '%soul%' THEN 'R&B/Soul'
    WHEN genero LIKE '%electro%' OR genero LIKE '%dance%' OR genero LIKE '%house%' OR genero LIKE '%techno%' OR genero LIKE '%dubstep%' OR genero LIKE '%drum%' OR genero IN ('Disco', 'Ambient') THEN 'Eletrônica'
    WHEN genero LIKE '%country%' OR genero IN ('Urban Cowboy') THEN 'Country'
    WHEN genero LIKE '%jazz%' OR genero IN ('Blues', 'Standards', 'Vocal', 'Fusion') THEN 'Jazz'
    WHEN genero LIKE '%classical%' OR genero LIKE '%orchestral%' OR genero LIKE '%opera%' THEN 'Clássica'
    WHEN genero LIKE '%christian%' OR genero LIKE '%gospel%' OR genero LIKE '%devotional%' OR genero LIKE '%islamic%' OR genero IN ('CCM', 'Inspirational') THEN 'Gospel/Religioso'
    WHEN genero LIKE '%folk%' OR genero IN ('Singer/Songwriter') THEN 'Folk'
    WHEN genero IN ('Pop/Rock') THEN 'Pop'
    WHEN genero LIKE '%rock%' OR genero LIKE '%metal%' OR genero LIKE '%punk%' OR genero LIKE '%grunge%' OR genero IN ('Alternative', 'Adult Alternative', 'Britpop', 'British Invasion') THEN 'Rock'
    WHEN genero LIKE '%pop%' OR genero IN ('Adult Contemporary', 'Easy Listening', 'Oldies') THEN 'Pop'
    ELSE 'Outros'
END
WHERE id > 0 AND statusItunes = 1;