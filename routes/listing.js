const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listing.js");

//Index and Create Route "/"
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

router.get("/trending", async (req, res) => {
  let allListings = await Listing.find({ category: "trending" });
  res.render("listings/trending.ejs", { allListings });
});
router.get("/newones", async (req, res) => {
  let allListings = await Listing.find({ category: "newones" });
  res.render("listings/trending.ejs", { allListings });
});
router.get("/rooms", async (req, res) => {
  let allListings = await Listing.find({ category: "rooms" });
  res.render("listings/trending.ejs", { allListings });
});

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show, Update and delete route "/:id"
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
