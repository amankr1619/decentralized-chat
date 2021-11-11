const aleph = require("aleph-js");

export const postChannels = (req, res) => {
  const channel_name = req.body.name;
  const channel_type = req.body.type;
  aleph.ethereum
    .import_account({ mnemonics: req.user.mnemonics })
    .then(async (account) => {
      const api_server = "https://api2.aleph.im";
      const channel = "TESTING_SA";
      let data;
      if (channel_type === "private") {
        data = {
          "name": channel_name,
          "type": "private",
          "approved_addresses": account.address,
        };
      } else { 
        data = {
          "name": channel_name,
          "type": "public",
        }
      }
      let response = await aleph.posts.submit( account.address, "channels",data, {
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
