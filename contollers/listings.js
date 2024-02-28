const Listing = require("../models/listing.js");

module.exports.index = async (req , res) => {
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
};

module.exports.newListing = (req , res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
                          .populate({
                            path: "reviews",
                            populate: {
                              path: "author",
                            },
                          })
                          .populate("owner");
                          
    if(!listing) {
      req.flash("error" , "Listing you requested does not exist");
      res.redirect('/listings');
    }
    console.log(listing);
    res.render("listings/show.ejs" , {listing});
};

module.exports.createListing = async (req , res) => {
    // let {title , description , image , price , country , location} = req.bletody;
    let listing = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, ".." , filename);
    const newListing = new Listing(req.body.listing);
    newListing.image = {url , filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" , "New Listing Created!");
    res.redirect('/listings');
};

module.exports.editListing = async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error" , "Listing you requested does not exist");
      res.redirect('/listings');
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_300,w_600" );
    // console.log(originalImageUrl);
    res.render('listings/edit.ejs' , {listing , originalImageUrl});
};

module.exports.updateListing = async (req , res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
    if(typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url , filename};
      await listing.save();
    }
    req.flash("success" , "Listing Update!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req , res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    res.redirect('/listings');
};