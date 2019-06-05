const express = require("express")
const router = express.Router();

router.get("/anotherTest", (req, res) =>{
    res.send({ response: "This is another testing route" }).status(200)
})

module.exports = router;