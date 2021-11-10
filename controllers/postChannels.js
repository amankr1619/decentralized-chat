const aleph = require("aleph-js");

export const postChannels = (req, res) => {
  const channel_name = req.body.name;
  aleph.ethereum
    .import_account({ mnemonics: req.user.mnemonics })
    .then(async (account) => {
      const api_server = "https://api2.aleph.im";
      const network_id = 261;
      const channel = "TESTING_SA";
      let response = await aleph.posts.submit(
        account.address,
        "channels",
        { body: channel_name },
        {
          api_server: api_server,
          account: account,
          channel: channel,
        }
      );
      await aleph.posts.submit(
        account.address,
        "channel_members",
        {},
        {
          ref: response.item_hash,
          api_server: api_server,
          account: account,
          channel: channel,
        }
      );
      res.redirect("/");
    });
};
