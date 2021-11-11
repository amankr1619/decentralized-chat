const aleph = require("aleph-js");

export const channel = async (req, res) => {
  const api_server = "https://api2.aleph.im";
  let channel_posts = await aleph.posts.get_posts("channels", {
    api_server: api_server,
  });

  res.render("channels/index", {
    channels: channel_posts.posts,
  });
};
