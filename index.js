import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import connectEnsureLogin from 'connect-ensure-login';
const aleph = require('aleph-js');


const expressSession = require('express-session')({
  secret: 'insert secret here',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
});
const app = express();
const port = 3456;

app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  private_key: String,
  public_key: String,
  mnemonics: String,
  address: String,
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('user', userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// User.create({
//   username: 'James',
//   password: 'password',
// });


// User.register({ username: 'Jackson', active: false}, 'password')

app.get('/', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const room = 'hall'
  const api_server = 'https://api2.aleph.im'

  let members = await aleph.posts.get_posts('channel_members', {
    'addresses': [req.user.address], 
    'api_server': api_server
  })
  let channel_refs = members.posts.map((member) => {
    if (member.ref) {
      return member.ref
    }
  })
  channel_refs.filter(ref => ref != undefined)

  let channel_posts = await aleph.posts.get_posts('channels', {
    'hashes': channel_refs,
    'api_server': api_server
  })

  console.log(channel_posts)
  res.render('index', {
    channels: channel_posts.posts,  
    user: req.user, 
    room: room 
  })


});

app.get('/channels/new', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.render('channels/new')
  
});

app.get('/channels', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const room = req.params.room
  const api_server = 'https://api2.aleph.im'
  const network_id = 261
  const channel = 'TEST'
  let channel_posts = await aleph.posts.get_posts('channels', { 'api_server': api_server })

  res.render('channels/index', {
    channels: channel_posts.posts
  })

});

app.get('/channels/:item_hash/join', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const room = req.params.room
  const api_server = 'https://api2.aleph.im'
  const network_id = 261
  const channel = 'TEST'

  aleph.ethereum.import_account({mnemonics: req.user.mnemonics}).then(async (account) => {
  
    await aleph.posts.submit(account.address, 'channel_members', {}, {
    ref: req.params.item_hash,
    api_server: api_server,
    account: account,
    channel: channel
  })
  res.redirect(`/rooms/${req.params.item_hash}`)
})

});

app.post('/channels', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const channel_name = req.body.name;
  aleph.ethereum.import_account({mnemonics: req.user.mnemonics}).then(async (account) => {

    const api_server = 'https://api2.aleph.im'
    const network_id = 261
    const channel = 'TESTING_SA'
    let response = await aleph.posts.submit(account.address, 'channels', {'body': channel_name}, {

      api_server: api_server,
      account: account,
      channel: channel
    })
      await aleph.posts.submit(account.address, 'channel_members', {}, {
        ref: response.item_hash,
        api_server: api_server,
        account: account,
        channel: channel
      })
      res.redirect('/')
  })
});

app.get('/rooms/:room', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const room = req.params.room
  const api_server = 'https://api2.aleph.im'
  const network_id = 261
  const channel = 'TEST'
  let members = await aleph.posts.get_posts('channel_members', {
    'addresses': [req.user.address], 
    'api_server': api_server
  })
  let channel_refs = members.posts.map((member) => {
    if (member.ref) {
      return member.ref
    }
  })
  channel_refs.filter(ref => ref != undefined)

  let channel_posts = await aleph.posts.get_posts('channels', {
    'hashes': channel_refs,
    'api_server': api_server
  })

  let result = await aleph.posts.get_posts('messages', {'refs': [room], 'api_server': api_server})
    console.log(channel_posts.posts)
    res.render('index', {
      channels: channel_posts.posts,
      posts: result.posts,
      user: req.user,
      room: room
    })
});

app.get('/login', (req, res) => {
  res.sendFile('views/login.html', { root: __dirname });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

app.get('/register', (req, res) => {
  res.sendFile('views/register.html', { root: __dirname });
});

app.post('/register', (req, res) => {
  User.register({ username: req.body.username, active: false }, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect('/register');
    } else {
      aleph.ethereum.new_account().then((account) => {
        user.private_key = account.private_key;
        user.public_key = account.public_key;
        user.mnemonics = account.mnemonics;
        user.address = account.address;
        user.save()

        passport.authenticate('local')(req, res, () => {
          res.redirect('/');
        })      
      });
    }
  });
});

app.get('/users/:username', connectEnsureLogin.ensureLoggedIn(), (req, res) => { 
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({user: user});
    }
  });
});

app.post('/messages/:room', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const message = req.body.message;
  aleph.ethereum.import_account({mnemonics: req.user.mnemonics}).then((account) => {
    const room = req.params.room;
    console.log(room);
    const api_server = 'https://api2.aleph.im'
    const network_id = 261
    const channel = 'TEST'
    aleph.posts.submit(account.address, 'messages', {'body': message}, {
      ref: room,
      api_server: api_server,
      account: account,
      channel: channel
      }).catch((err) => {
        console.log(err);
    });
  })
});


app.get('/users/:id', (req, res) => res.send({user: {id: req.params.id}}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));