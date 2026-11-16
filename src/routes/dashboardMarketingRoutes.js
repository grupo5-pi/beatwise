var express = require("express");
var router = express.Router();
var dashboardMarketingController = require("../controllers/dashboardMarketingController");

router.get("/marketing", dashboardMarketingController.marketing);

module.exports = router;