export const postMessages = (req, res) => {
  const message = req.body.message;
  aleph.ethereum
    .import_account({ mnemonics: req.user.mnemonics })
    .then((account) => {
      const room = req.params.room;
      console.log(room);
      const api_server = "https://api2.aleph.im";
      const network_id = 261;
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
          console.log(err);
        });
    });
};
