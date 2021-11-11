const aleph = require("aleph-js");

export const postMessages = (req, res) => {
  const message = req.body.message;
  aleph.ethereum
    .import_account({ mnemonics: req.user.mnemonics })
    .then((account) => {
      const room = req.params.room;
      const api_server = "https://api2.aleph.im";
      const channel = "TEST";
      aleph.posts
        .submit(
          account.address,
          "messages",
          { body: message },
          {
            ref: room,
            api_server: api_server,
            account: account,
            channel: channel,
          }
        )
        .catch((err) => {
          res.send(err);
        });
    });
};
