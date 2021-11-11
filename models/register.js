import User from "../schema/user";
const aleph = require("aleph-js")
import passport from "passport";

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
