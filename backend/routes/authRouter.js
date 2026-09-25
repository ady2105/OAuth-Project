const router = require("express").Router();
const {googleLogin, githubLogin} = require("../controllers/authController");

router.get("/test", (req, res) => {
  res.send("test pass");
});

router.get("/google", googleLogin);
router.get("/github", githubLogin);


module.exports = router;
