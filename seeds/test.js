const axios = require("axios");
const fetchImgUrl = async () => {
  const res = await axios.get(
    "https://api.unsplash.com/photos/random?client_id=8AYw_TtvawTtblPDvwkMAKo5fwWkFZLssFaQJSJsikk&collections=483251"
  );
  console.log(res.data.urls.regular);
};
