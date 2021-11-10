import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import connectEnsureLogin from "connect-ensure-login";
import User from "./schema/user";
import register from "./models/register";
import findOneUser from "./models/findOneUser";
import { home } from "./controllers/index";
import { channel } from "./controllers/channels";
import { joinChannel } from "./controllers/joinChannel";
import { postChannels } from "./controllers/postChannels";
import { getRoom } from "./controllers/getRoom";
import { postMessages } from "./controllers/postMessages";

const expressSession = require("express-session")({
  secret: "insert secret here",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
});

const app = express();
const port = 3457;


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// User.create({
//   username: 'James',
//   password: 'password',
// });

// User.register({ username: 'Jackson', active: false}, 'password')

app.get("/", connectEnsureLogin.ensureLoggedIn(), home);

app.get("/channels/new", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.render("channels/new");
});

app.get("/channels", connectEnsureLogin.ensureLoggedIn(), channel);

app.get(
  "/channels/:item_hash/join",
  connectEnsureLogin.ensureLoggedIn(),
  joinChannel
);

app.post("/channels", connectEnsureLogin.ensureLoggedIn(), postChannels);

app.get("/rooms/:room", connectEnsureLogin.ensureLoggedIn(), getRoom);

app.get("/login", (req, res) => {
  res.sendFile("views/login.html", { root: __dirname });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/register", (req, res) => {
  res.sendFile("views/register.html", { root: __dirname });
});

app.post("/register", async (req, res) => {
  await register(req, res);
});

app.get(
  "/users/:username",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    await findOneUser(req, res);
  }
);

app.post("/messages/:room", connectEnsureLogin.ensureLoggedIn(), postMessages);

app.get("/users/:id", (req, res) => res.send({ user: { id: req.params.id } }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
