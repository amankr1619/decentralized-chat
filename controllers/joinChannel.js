const aleph = require("aleph-js");

export const joinChannel = (req, res) => {
  const api_server = "https://api2.aleph.im";

  aleph.ethereum
    .import_account({ mnemonics: req.user.mnemonics })
    .then(async (account) => {
      await aleph.posts.submit(
        account.address,
        "channel_members",
        {},
        {
          ref: req.params.item_hash,
          api_server: api_server,
          account: account,
          channel: channel,
        }
      );
      res.redirect(`/rooms/${req.params.item_hash}`);
    });
};
