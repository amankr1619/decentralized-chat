import User from "../schema/user";

const register = async (req, res) => {
  await User.register(
    { username: req.body.username, active: false },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        aleph.ethereum.new_account().then((account) => {
          user.private_key = account.private_key;
          user.public_key = account.public_key;
          user.mnemonics = account.mnemonics;
          user.address = account.address;
          user.save();

          passport.authenticate("local")(req, res, () => {
            res.redirect("/");
          });
        });
      }
    }
  );
};

export default register;
