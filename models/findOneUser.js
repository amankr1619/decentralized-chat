import User from "../schema/user";

const findOneUser = async (req, res) => {
  await User.findOne({ username: req.params.username }, (err, user) => {
    if (err) {
      res.status(500).send(err);
      return;
    } else {
      res.send({ user: user });
      return;
    }
  });
};

export default findOneUser;
