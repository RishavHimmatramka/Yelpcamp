const mongoose = require("mongoose");
const axios = require("axios");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

let maptilersdk; // Declare variable outside
// Load the MapTiler SDK asynchronously and assign it to the global variable
(async () => {
  maptilersdk = await import("@maptiler/sdk");
  maptilersdk.config.apiKey = "NehzKQg7LzwAzMmUt72o";
})();
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
// const fetchImgUrl = async () => {
//   const res = await axios.get(
//     "https://api.unsplash.com/photos/random?client_id=8AYw_TtvawTtblPDvwkMAKo5fwWkFZLssFaQJSJsikk&collections=483251"
//   );
//   return res.data.urls.regular;
// };

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 100) + 10;
    const location = `${cities[random1000].city}, ${cities[random1000].state}`;
    const geoData = await maptilersdk.geocoding.forward(location, { limit: 1 });
    const camp = new Campground({
      author: "66d94c6a30c9833676339bba",
      location,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dnshltyiz/image/upload/v1725978467/YelpCamp/dlz6k3lt2m0iaaop5iqx.jpg",
          filename: "YelpCamp/dlz6k3lt2m0iaaop5iqx",
        },
        {
          url: "https://res.cloudinary.com/dnshltyiz/image/upload/v1725979609/YelpCamp/kb1gr83iv9s72vpicvqf.jpg",
          filename: "YelpCamp/kb1gr83iv9s72vpicvqf",
        },
      ],
      geometry: geoData.features[0].geometry,
      // image: await fetchImgUrl(),
      price,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam atque accusantium optio quidem excepturi quibusdam harum deleniti quia consequuntur illo nemo, magnam praesentium ipsam? Odit totam earum dolorem quasi libero! Voluptatibus corrupti sit eius quibusdam laudantium nobis aliquam odit magnam quis! Nostrum, enim vel eum placeat sed molestiae sapiente iure voluptates. Molestias veniam aperiam hic repellat consequuntur doloremque error similique.",
    });
    await camp.save();
    // console.log(`saved ${i + 1} campgrounds`);
  }
};

setTimeout(async () => {
  await seedDB();
  mongoose.connection.close();
}, 2000);
