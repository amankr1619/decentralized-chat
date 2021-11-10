const aleph = require("aleph-js");

export const channel = async (req, res) => {
  const room = req.params.room;
  const api_server = "https://api2.aleph.im";
  const network_id = 261;
  const channel = "TEST";
  let channel_posts = await aleph.posts.get_posts("channels", {
    api_server: api_server,
  });

  res.render("channels/index", {
    channels: channel_posts.posts,
  });
};
