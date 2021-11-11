import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import connectEnsureLogin from "connect-ensure-login";
import User from "./schema/user";
import register from "./models/register";
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

const mongoURI = 'mongodb+srv://m001-student:chatpass@sandbox.xljfd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const app = express();
const port = 8000;


app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", connectEnsureLogin.ensureLoggedIn(), home);

app.get("/channels/new", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile("views/channels/new.html", { root: __dirname });
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
  res.sendFile("views/auth/login.html", { root: __dirname });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/register", (req, res) => {
  res.sendFile("views/auth/register.html", { root: __dirname });
});

app.post("/register", async (req, res) => {
  await register(req, res);
});

app.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/login");
});

app.post("/messages/:room", connectEnsureLogin.ensureLoggedIn(), postMessages);

app.get("/users/:id", (req, res) => res.send({ user: { id: req.params.id } }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
