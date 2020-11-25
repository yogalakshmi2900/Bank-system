const BaseUrl = '/api/v1/';
module.exports = function(app) {
  app.use(BaseUrl+"login", require("../controllers/authentication/login"));
  app.use(BaseUrl+"banker", require("../controllers/action/bankeraction"));
  app.use(BaseUrl+"customer", require("../controllers/action/customeraction"));
}
