const aleph = require("aleph-js");

export const getRoom = async (req, res) => {
  const room = req.params.room;
  const api_server = "https://api2.aleph.im";
  
  let members = await aleph.posts.get_posts("channel_members", {
    addresses: [req.user.address],
    api_server: api_server,
  });
  let channel_refs = members.posts.map((member) => {
    if (member.ref) {
      return member.ref;
    }
  });
  channel_refs.filter((ref) => ref != undefined);

  let channel_posts = await aleph.posts.get_posts("channels", {
    hashes: channel_refs,
    api_server: api_server,
  });

  let result = await aleph.posts.get_posts("messages", {
    refs: [room],
    api_server: api_server,
  });
  
  res.render("index", {
    channels: channel_posts.posts,
    posts: result.posts,
    user: req.user,
    room: room,
  });
};
