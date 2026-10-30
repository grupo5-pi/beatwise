var express = require("express");
var router = express.Router();

var musicaController = require("../controllers/musicaController");

router.get("/obterAlbum", musicaController.obterAlbum);
router.get("/obterArtista", musicaController.obterArtista);
router.get("/obterMusica", musicaController.obterMusica);
router.get("/obterMusicaArtista", musicaController.obterMusicaArtista);
router.get("/obterSpotify", musicaController.obterSpotify);
router.get("/obterYoutube", musicaController.obterYoutube);

module.exports = router;