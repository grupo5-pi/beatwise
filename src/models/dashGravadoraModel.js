var database = require("../database/config");

function obterDiferencaClipe() {
  var instrucaoSql = `
    SELECT 
	    (SELECT SUM(visitas) FROM youtubeBD WHERE videoOficial = 1) AS comClipe, 
        (SELECT SUM(visitas) FROM youtubeBD WHERE videoOficial = 0)	AS semClipe, 
        (((SELECT SUM(visitas) FROM youtubeBD WHERE videoOficial = 1) - (SELECT SUM(visitas) FROM youtubeBD WHERE videoOficial = 0)) / (SELECT SUM(visitas) FROM youtubeBD WHERE videoOficial = 0)) * 100 AS porcentagem
    FROM youtubeBD LIMIT 1`;

  return database.executar(instrucaoSql);
}

module.exports = {
  obterDiferencaClipe,
};
