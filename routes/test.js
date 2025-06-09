const express = require("express");
const router = express.Router();
const USER = require("../model/user");

router.get("/profile", async (req, res) => {
   
  console.log(req.user);
  try {
    if (!req.user) {
      return res.redirect("/login");
    }

    const requiredUsers = await USER.find({ createdBy: req.user._id });

    if (req.is("application/json")) {
      return res.status(200).json({
        message: "Home page",
        users: requiredUsers,
      });
    }

    return res.render("home", {
      users: requiredUsers,
    });
  } catch (error) {
    console.error("Error in /profile:", error);
    return res.status(500).send("Something went wrong.");
  }
});

module.exports = router;
