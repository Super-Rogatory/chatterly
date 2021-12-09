/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./server/api/index.js":
/*!*****************************!*\
  !*** ./server/api/index.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\n\nconst router = express.Router();\nrouter.use('/users', __webpack_require__(/*! ./users */ \"./server/api/users.js\"));\nrouter.use('/messages', __webpack_require__(/*! ./messages */ \"./server/api/messages.js\"));\nrouter.use('/rooms', __webpack_require__(/*! ./rooms */ \"./server/api/rooms.js\"));\nmodule.exports = router;\n\n//# sourceURL=webpack://chatterly/./server/api/index.js?");

/***/ }),

/***/ "./server/api/messages.js":
/*!********************************!*\
  !*** ./server/api/messages.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\n\nconst router = express.Router();\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst Message = __webpack_require__(/*! ../db/models/Messages */ \"./server/db/models/Messages.js\");\n\nconst User = __webpack_require__(/*! ../db/models/Users */ \"./server/db/models/Users.js\");\n\nconst Room = __webpack_require__(/*! ../db/models/Rooms */ \"./server/db/models/Rooms.js\");\n\nrouter.get('/', async (req, res, next) => {\n  try {\n    const messages = await Message.findAll();\n    if (!messages) res.status(404).send('no messages found!');\n    res.send(messages);\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.get('/:room', async (req, res, next) => {\n  try {\n    const messages = await Room.getMessagesByRoom(req.params.room);\n    if (!messages) res.status(404).send('no messages found!');\n    res.send(messages);\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.post('/', async (req, res, next) => {\n  const message = await Message.create({\n    text: req.body.message\n  });\n  if (!message) res.status(404).send('unable to create message'); // both users and chatbots have room properties\n\n  const room = await Room.findOne({\n    where: {\n      name: req.body.user.room\n    }\n  });\n  if (!room) res.status(404).send('room error'); // a regular sendMessage event would work, if the user is a chatbot change functionality as chatbot's id's differ from user's\n  // a chatbot can have id 4, and a user can have id 5 such that all previous ids don't exist (if guest, it is deleted)\n\n  if (req.body.user && req.body.user.name !== 'chatbot') {\n    try {\n      // our original user object could not use magic methods, so we made another user based on that id and became a wizard then.\n      const user = await User.findByPk(req.body.user.id);\n\n      if (!user) {\n        res.send({\n          err: true\n        });\n        return;\n      } // associate user with message as normal, not necessary for chatbot\n      else await user.addMessage(message);\n    } catch (err) {\n      next(err);\n    }\n  }\n\n  await room.addMessage(message);\n  res.status(200).send(message);\n});\nmodule.exports = router;\n/*\n[\n  '_customGetters',    '_customSetters',\n  'validators',        '_hasCustomGetters',\n  '_hasCustomSetters', 'rawAttributes',\n  '_isAttribute',      'getMessages',\n  'countMessages',     'hasMessage',\n  'hasMessages',       'setMessages',\n  'addMessage',        'addMessages',\n  'removeMessage',     'removeMessages',\n  'createMessage'\n]\n[\n  '_customGetters',\n  '_customSetters',\n  'validators',\n  '_hasCustomGetters',\n  '_hasCustomSetters',\n  'rawAttributes',\n  '_isAttribute',\n  'getUser',\n  'setUser',\n  'createUser'\n]\n*/\n\n//# sourceURL=webpack://chatterly/./server/api/messages.js?");

/***/ }),

/***/ "./server/api/rooms.js":
/*!*****************************!*\
  !*** ./server/api/rooms.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\n\nconst router = express.Router();\n\nconst Room = __webpack_require__(/*! ../db/models/Rooms */ \"./server/db/models/Rooms.js\");\n\nconst User = __webpack_require__(/*! ../db/models/Users */ \"./server/db/models/Users.js\");\n\nrouter.get('/:id', async (req, res, next) => {\n  try {\n    const room = await Room.findOne({\n      where: {\n        id: req.params.id\n      }\n    });\n    if (!room) res.status(404).send('could not find room');else res.send(room);\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.get('/users/:room', async (req, res, next) => {\n  try {\n    const users = await Room.getUsersInRoom(req.params.room);\n\n    if (!users) {\n      res.status(200).send({\n        err: new Error('unable to find users in room'),\n        status: false\n      });\n      return;\n    }\n\n    res.status(200).send({\n      users,\n      status: true\n    });\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.post('/', async (req, res, next) => {\n  try {\n    const room = await Room.findOne({\n      where: {\n        name: req.body.name\n      }\n    });\n\n    if (room) {\n      // if room already exists return that room to front end\n      const chatBot = await room.getChatBot();\n      res.send({\n        room,\n        isExisting: true,\n        chatBot\n      });\n    } else {\n      // else create a new room. after room is created chatbot is associated to room\n      const newRoom = await Room.create({\n        name: req.body.name\n      });\n      const chatBot = await newRoom.getChatBot();\n      if (!newRoom) res.status(404).send('room was unable to be created');else res.send({\n        room: newRoom,\n        isExisting: false,\n        chatBot\n      });\n    }\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.put('/', async (req, res, next) => {\n  try {\n    if (!req.body.type || !req.body.user) throw new Error('not type specified or user does not exist in put route');\n    const room = await Room.findOne({\n      where: {\n        name: req.body.user.room\n      }\n    });\n    const user = await User.findOne({\n      where: {\n        name: req.body.user.name\n      }\n    });\n\n    switch (req.body.type) {\n      case 'associate':\n        if (room) {\n          // populates our participants table, not necessary for chatbot, should be done elsewhere\n          await room.addUser(user);\n          res.status(200).json('successfully associated room and user');\n          break;\n        }\n\n      case 'disassociate':\n        if (room) {\n          await room.removeUser(user);\n          res.status(200).json('successfully disassociated room and user');\n          break;\n        }\n\n      default:\n        break;\n    }\n  } catch (err) {\n    next(err);\n  }\n});\nmodule.exports = router;\n\n//# sourceURL=webpack://chatterly/./server/api/rooms.js?");

/***/ }),

/***/ "./server/api/users.js":
/*!*****************************!*\
  !*** ./server/api/users.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\n\nconst router = express.Router();\n\nconst User = __webpack_require__(/*! ../db/models/Users */ \"./server/db/models/Users.js\");\n\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n\nconst {\n  check,\n  validationResult\n} = __webpack_require__(/*! express-validator */ \"express-validator\");\n\nconst {\n  issueJWT,\n  authMiddleware\n} = __webpack_require__(/*! ../auth/utils */ \"./server/auth/utils.js\");\n\n(__webpack_require__(/*! dotenv */ \"dotenv\").config)();\n\nrouter.get('/', async (req, res, next) => {\n  try {\n    const users = await User.findAll();\n    if (!users) res.status(404).send('no users in the db');else res.send(users);\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.get('/:id', async (req, res, next) => {\n  try {\n    const user = await User.findByPk(req.params.id);\n    if (!user) res.status(404).send('failed to find user');else res.send(user);\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.get('/misc/getUserCount', async (req, res, next) => {\n  try {\n    const count = await User.getActiveUserCount();\n    if (!count) res.status(200).send({\n      count: 0\n    });else res.send({\n      count\n    });\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.post('/misc/decreaseUserCount', async (req, res, next) => {\n  try {\n    const user = await User.findOne({\n      where: {\n        name: req.body.name\n      }\n    });\n\n    if (!user) {\n      res.status(404).send('failed to find user');\n      return;\n    } else {\n      user.active = false;\n      user.save();\n      res.status(200).send({\n        success: true\n      });\n    }\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.get('/misc/:name', async (req, res, next) => {\n  try {\n    const user = await User.findOne({\n      where: {\n        name: req.params.name\n      }\n    });\n    if (!user) res.send(false);else res.send(true);\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.post('/', async (req, res, next) => {\n  try {\n    const user = await User.create({\n      name: req.body.name,\n      room: req.body.room\n    });\n    if (!user) res.status(404).send('failed to create user');else res.send(user);\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.post('/register', [check('password', 'Password must be longer than eight characters').isLength({\n  min: 8\n})], async (req, res, next) => {\n  try {\n    const userFromDb = await User.findOne({\n      where: {\n        name: req.body.username\n      }\n    });\n    const errors = validationResult(req);\n\n    if (!errors.isEmpty() || userFromDb || !req.body.username || !req.body.password) {\n      return res.status(404).send('something went wrong');\n    }\n\n    const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS);\n    const hash = await bcrypt.hash(req.body.password, salt);\n    const user = await User.create({\n      name: req.body.username,\n      isGuest: false,\n      active: false,\n      salt,\n      hash\n    });\n    res.send(user);\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.post('/login', async (req, res, next) => {\n  try {\n    if (!req.body.username) {\n      return res.json({\n        msg: 'Whoops! You forget to add a username!',\n        isUserValid: false,\n        errorType: 'nameError'\n      });\n    }\n\n    const userFromDb = await User.findOne({\n      where: {\n        name: req.body.username\n      }\n    }); // if there is not user existing in the db, or if the user that exists in the db is a guest, throw name error.\n\n    if (!userFromDb) {\n      return res.json({\n        msg: 'Account does not exist!',\n        isUserValid: false,\n        errorType: 'nameError'\n      });\n    }\n\n    if (userFromDb.isGuest) {\n      return res.json({\n        msg: 'This username is already taken by a guest.',\n        isUserValid: false,\n        errorType: 'nameError'\n      });\n    }\n\n    const isValidPassword = await bcrypt.compare(req.body.password, userFromDb.hash);\n\n    if (!isValidPassword) {\n      return res.json({\n        msg: 'Invalid username or password!',\n        isUserValid: false,\n        errorType: 'passwordError'\n      });\n    } // the user is not authenticate and can be active.\n\n\n    userFromDb.active = true;\n    await userFromDb.save();\n    const tokenObject = issueJWT(userFromDb);\n    res.send({\n      tokenObj: tokenObject,\n      isUserValid: true\n    });\n  } catch (err) {\n    next(err);\n  }\n});\nrouter.delete('/:id', async (req, res, next) => {\n  try {\n    const user = await User.findByPk(req.params.id);\n\n    if (!user) {\n      res.status(404).send('failed to find user');\n      throw new Error('failed to find user');\n    } else {\n      await user.destroy();\n      res.send(user);\n    }\n  } catch (err) {\n    next(err);\n  }\n});\nmodule.exports = router; // NOTE: express handles 404's no need to throw new Error object.\n\n//# sourceURL=webpack://chatterly/./server/api/users.js?");

/***/ }),

/***/ "./server/auth/utils.js":
/*!******************************!*\
  !*** ./server/auth/utils.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n\nconst fs = __webpack_require__(/*! fs */ \"fs\");\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst PRIV_KEY =  false ? 0 : fs.readFileSync(path.resolve(__dirname, '../keys/id_rsa_priv.pem'), 'utf8');\nconst PUB_KEY = fs.readFileSync(path.resolve(__dirname, '../keys/id_rsa_pub.pem'), 'utf8');\n\nfunction issueJWT(user) {\n  const id = user.id;\n  const expiresIn = 86400;\n  const payload = {\n    sub: id,\n    name: user.name,\n    iat: Date.now()\n  };\n  const signedToken = jwt.sign(payload, PRIV_KEY, {\n    expiresIn,\n    algorithm: 'RS256'\n  });\n  return {\n    token: 'Bearer ' + signedToken,\n    expires: expiresIn\n  };\n}\n\nfunction authMiddleware(req, res, next) {\n  const [bearer, jsonToken] = req.headers.authorization ? req.headers.authorization.split(' ') : ['no bearer', 'no token'];\n\n  if (bearer === 'Bearer' && jsonToken.match(/\\S+\\.\\S+\\.\\S+/) !== null) {\n    try {\n      const verification = jwt.verify(jsonToken, PUB_KEY, {\n        algorithms: ['RS256']\n      });\n      req.jwt = verification;\n      next();\n    } catch (err) {\n      res.status(401).json({\n        msg: 'you are not authorized to visit this route'\n      });\n    }\n  } else {\n    res.status(401).json({\n      msg: 'you are not authorized to visit this route'\n    });\n  }\n}\n\nmodule.exports = {\n  issueJWT,\n  authMiddleware\n};\n\n//# sourceURL=webpack://chatterly/./server/auth/utils.js?");

/***/ }),

/***/ "./server/db/db.js":
/*!*************************!*\
  !*** ./server/db/db.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Sequelize = __webpack_require__(/*! sequelize */ \"sequelize\");\n\nconst DB_STRING = process.env.DATABASE_URL || 'postgres://super-rogatory@localhost:5432/chatterly';\nconst config = {\n  logging: false\n};\n\nif (process.env.DATABASE_URL) {\n  config.dialectOptions = {\n    ssl: {\n      rejectUnauthorized: false\n    }\n  };\n}\n\nconst db = new Sequelize(DB_STRING, config);\nmodule.exports = db;\n\n//# sourceURL=webpack://chatterly/./server/db/db.js?");

/***/ }),

/***/ "./server/db/index.js":
/*!****************************!*\
  !*** ./server/db/index.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const db = __webpack_require__(/*! ./db */ \"./server/db/db.js\");\n\nconst Message = __webpack_require__(/*! ./models/Messages */ \"./server/db/models/Messages.js\");\n\nconst User = __webpack_require__(/*! ./models/Users */ \"./server/db/models/Users.js\");\n\nconst Room = __webpack_require__(/*! ./models/Rooms */ \"./server/db/models/Rooms.js\");\n\nconst Participants = __webpack_require__(/*! ./models/Participants */ \"./server/db/models/Participants.js\");\n\nconst Chatbot = __webpack_require__(/*! ./models/Chatbot */ \"./server/db/models/Chatbot.js\"); // register models\n// a user should have many messages.\n\n\nMessage.belongsTo(User);\nUser.hasMany(Message); // a room should have many messages.\n\nMessage.belongsTo(Room);\nRoom.hasMany(Message); // many users can be in many rooms. we will create a join table called Participants with reference to specific users, rooms, etc\n\nUser.belongsToMany(Room, {\n  through: Participants\n});\nRoom.belongsToMany(User, {\n  through: Participants\n}); // this allows us to creates a chatbot for every room that is created\n\nChatbot.belongsToMany(Room, {\n  through: 'ActiveChatbots'\n});\nRoom.belongsToMany(Chatbot, {\n  through: 'ActiveChatbots'\n});\nmodule.exports = {\n  db,\n  Message,\n  User,\n  Room,\n  Participants\n};\n\n//# sourceURL=webpack://chatterly/./server/db/index.js?");

/***/ }),

/***/ "./server/db/models/Chatbot.js":
/*!*************************************!*\
  !*** ./server/db/models/Chatbot.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Sequelize = __webpack_require__(/*! sequelize */ \"sequelize\");\n\nconst db = __webpack_require__(/*! ../db */ \"./server/db/db.js\");\n\nconst Chatbot = db.define('chatbot', {\n  name: {\n    type: Sequelize.STRING,\n    allowNull: false,\n    validate: {\n      notEmpty: true,\n      equals: 'chatbot'\n    }\n  },\n  room: {\n    type: Sequelize.STRING,\n    allowNull: false,\n    validate: {\n      notEmpty: true\n    }\n  }\n});\nmodule.exports = Chatbot;\n\n//# sourceURL=webpack://chatterly/./server/db/models/Chatbot.js?");

/***/ }),

/***/ "./server/db/models/Messages.js":
/*!**************************************!*\
  !*** ./server/db/models/Messages.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Sequelize = __webpack_require__(/*! sequelize */ \"sequelize\");\n\nconst db = __webpack_require__(/*! ../db */ \"./server/db/db.js\");\n\nconst Message = db.define('message', {\n  text: {\n    type: Sequelize.STRING\n  }\n});\nmodule.exports = Message;\n\n//# sourceURL=webpack://chatterly/./server/db/models/Messages.js?");

/***/ }),

/***/ "./server/db/models/Participants.js":
/*!******************************************!*\
  !*** ./server/db/models/Participants.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Sequelize = __webpack_require__(/*! sequelize */ \"sequelize\");\n\nconst db = __webpack_require__(/*! ../db */ \"./server/db/db.js\");\n\nconst Participants = db.define('Participants', {\n  id: {\n    type: Sequelize.INTEGER,\n    primaryKey: true,\n    allowNull: false,\n    autoIncrement: true\n  }\n}); // The idea: When we enter a valid username and room name we want to create a Participants instance tied to a room name.\n// Once the participants are created, we also want to create the chatbot!\n\nmodule.exports = Participants;\n\n//# sourceURL=webpack://chatterly/./server/db/models/Participants.js?");

/***/ }),

/***/ "./server/db/models/Rooms.js":
/*!***********************************!*\
  !*** ./server/db/models/Rooms.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Sequelize = __webpack_require__(/*! sequelize */ \"sequelize\");\n\nconst Message = __webpack_require__(/*! ./Messages */ \"./server/db/models/Messages.js\");\n\nconst User = __webpack_require__(/*! ./Users */ \"./server/db/models/Users.js\");\n\nconst Op = Sequelize.Op;\n\nconst db = __webpack_require__(/*! ../db */ \"./server/db/db.js\");\n\nconst Room = db.define('room', {\n  name: {\n    type: Sequelize.STRING,\n    allowNull: false,\n    validate: {\n      notEmpty: true\n    },\n    isUnique: true\n  }\n});\n/*\n[\n  '_customGetters',    '_customSetters',\n  'validators',        '_hasCustomGetters',\n  '_hasCustomSetters', 'rawAttributes',\n  '_isAttribute',      'getChatBot',\n  'getMessages',       'countMessages',\n  'hasMessage',        'hasMessages',\n  'setMessages',       'addMessage',\n  'addMessages',       'removeMessage',\n  'removeMessages',    'createMessage',\n  'getUsers',          'countUsers',\n  'hasUser',           'hasUsers',\n  'setUsers',          'addUser',\n  'addUsers',          'removeUser',\n  'removeUsers',       'createUser',\n  'getChatbots',       'countChatbots',\n  'hasChatbot',        'hasChatbots',\n  'setChatbots',       'addChatbot',\n  'addChatbots',       'removeChatbot',\n  'removeChatbots',    'createChatbot'\n]\n*/\n\nRoom.getUsersInRoom = async function (roomName) {\n  const room = await this.findOne({\n    where: {\n      name: roomName\n    }\n  });\n  const users = await room.customGetUsers();\n  return users;\n};\n\nRoom.getMessagesByRoom = async function (roomName) {\n  const room = await this.findOne({\n    where: {\n      name: roomName\n    }\n  });\n  const messages = await Message.findAll({\n    include: this,\n    where: {\n      roomId: {\n        [Op.eq]: room.id\n      }\n    },\n    order: [['createdAt', 'ASC']]\n  });\n  return messages;\n}; // instance methods\n\n\nRoom.prototype.getChatBot = async function () {\n  const chatbots = await this.getChatbots();\n  return chatbots[0];\n};\n\nRoom.prototype.customGetUsers = async function () {\n  const users = await User.findAll({\n    where: {\n      room: {\n        [Op.eq]: this.name\n      }\n    },\n    attributes: ['name', 'active', 'isGuest']\n  });\n  return users;\n}; // hooks\n\n\nRoom.afterCreate(async room => {\n  // room.createChatbot is a magic method we can utilize.\n  try {\n    // expectation: each room has a chatbot.\n    await room.createChatbot({\n      name: 'chatbot',\n      room: room.name\n    });\n  } catch (err) {\n    console.log('error creating chatbot \\n => ', err);\n  }\n});\nmodule.exports = Room;\n\n//# sourceURL=webpack://chatterly/./server/db/models/Rooms.js?");

/***/ }),

/***/ "./server/db/models/Users.js":
/*!***********************************!*\
  !*** ./server/db/models/Users.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Sequelize = __webpack_require__(/*! sequelize */ \"sequelize\");\n\nconst Message = __webpack_require__(/*! ./Messages */ \"./server/db/models/Messages.js\");\n\nconst Op = Sequelize.Op;\n\nconst db = __webpack_require__(/*! ../db */ \"./server/db/db.js\");\n\nconst User = db.define('user', {\n  name: {\n    type: Sequelize.STRING,\n    allowNull: false,\n    validate: {\n      notEmpty: true\n    },\n    unique: true\n  },\n  room: {\n    type: Sequelize.STRING,\n    validate: {\n      guestCheck(room) {\n        if (this.isGuest) {\n          if (!room) {\n            throw new Error('Guests must fill out a room name');\n          }\n        }\n      }\n\n    }\n  },\n  isGuest: {\n    type: Sequelize.BOOLEAN,\n    defaultValue: true\n  },\n  active: {\n    type: Sequelize.BOOLEAN,\n    defaultValue: true\n  },\n  salt: {\n    type: Sequelize.STRING\n  },\n  hash: {\n    type: Sequelize.STRING\n  }\n});\n\nUser.getActiveUserCount = async function () {\n  const players = await this.findAll({\n    where: {\n      active: true\n    }\n  });\n  return players.length;\n}; // if the user is a guest user, their messages will be destroyed in 30 min, also their record in the database will get destroyed.\n\n\nUser.afterCreate(user => {\n  if (user.isGuest) {\n    setTimeout(async () => {\n      await Message.destroy({\n        where: {\n          userId: {\n            [Op.eq]: user.id\n          }\n        }\n      });\n      await user.destroy();\n    }, 1800000);\n  }\n});\nmodule.exports = User;\n\n//# sourceURL=webpack://chatterly/./server/db/models/Users.js?");

/***/ }),

/***/ "./server/index.js":
/*!*************************!*\
  !*** ./server/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! socket.io */ \"socket.io\");\n/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _server_db_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../server/db/index */ \"./server/db/index.js\");\n/* harmony import */ var _server_db_index__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_server_db_index__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! morgan */ \"morgan\");\n/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(morgan__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./router */ \"./server/router.js\");\n/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_router__WEBPACK_IMPORTED_MODULE_7__);\n\n\n\n\n\n\n\n\nconst app = express__WEBPACK_IMPORTED_MODULE_2___default()();\nconst server = http__WEBPACK_IMPORTED_MODULE_0___default().createServer(app);\nconst db = (_server_db_index__WEBPACK_IMPORTED_MODULE_5___default().db);\nconst PORT = process.env.PORT || 5000; // syncing the db\n\ndb.sync({\n  force: true\n}).then(() => console.log('Database is synced')).catch(err => console.log('Error syncing the db', err)); // cross origin middleware\n\napp.use(cors__WEBPACK_IMPORTED_MODULE_4___default()()); // body parsing middleware\n\napp.use(express__WEBPACK_IMPORTED_MODULE_2___default().json());\napp.use(express__WEBPACK_IMPORTED_MODULE_2___default().urlencoded({\n  extended: true\n})); // allow the public folders content to be available (important for bundle being available to component-injected HTML markup)\n\napp.use(express__WEBPACK_IMPORTED_MODULE_2___default()[\"static\"](path__WEBPACK_IMPORTED_MODULE_3___default().resolve(__dirname, '../public'))); // logging middleware\n\napp.use(morgan__WEBPACK_IMPORTED_MODULE_6___default()(`${ false ? 0 : 'dev'}`)); // allows access control\n\napp.use((req, res, next) => {\n  res.set('Content-Type', 'application/json');\n  res.set('Access-Control-Allow-Origin', '*');\n  res.set('Access-Control-Allow-Credentials', true);\n  res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');\n  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');\n  next();\n}); // socket.io server instance\n\nconst io = socket_io__WEBPACK_IMPORTED_MODULE_1___default()(server, {\n  cors: {\n    origin: '*'\n  }\n});\nio.on('connection', socket => {\n  console.log('we have a new connection');\n  socket.on('join', ({\n    id,\n    name,\n    room\n  }) => {\n    // a valid id, name, and room indicates successful creation of a user in the front-end.\n    console.log(id, name, room); // emitting an event from the back-end to the front-end\n\n    socket.emit('initializeChatbot', {\n      text: `${name}, welcome to the room ${room}`\n    });\n    socket.join(room); // emitting to all clients in the room except the user.\n\n    socket.to(room).emit('initializeChatbot', {\n      text: `${name}, has joined!`\n    });\n  }); // waiting for an emitted event from the front-end\n\n  socket.on('addedMessage', user => {\n    // We can emit a message to the room relative to user object from front-end call\n    io.in(user.room).emit('message', user);\n  }); // update inactive users takes care of the active/inactive status (when the exit button is clicked)\n\n  socket.on('refreshOnlineUsers', user => {\n    io.in(user.room).emit('refreshUserList', user);\n  });\n  socket.on('sendDisconnectMessage', user => {\n    io.in(user.room).emit('disconnectMessage', {\n      text: `${user.name} has left.`\n    });\n  });\n  socket.on('disconnect', () => {\n    console.log('user has left');\n  });\n}); // mounted on api per usual\n\napp.use('/api', __webpack_require__(/*! ../server/api/index */ \"./server/api/index.js\")); // handles all possible valid routes. server-side rendering\n\napp.use('*', (_router__WEBPACK_IMPORTED_MODULE_7___default())); // handling 404\n\napp.use((req, res, next) => {\n  res.status(404).send('SORRY. Could not find the information you are looking for!');\n}); // error handler\n\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).send('An error has occured!');\n});\nserver.listen(PORT, () => console.log(`server: listening on PORT ${PORT}`));\n\n//# sourceURL=webpack://chatterly/./server/index.js?");

/***/ }),

/***/ "./server/router.js":
/*!**************************!*\
  !*** ./server/router.js ***!
  \**************************/
/***/ (() => {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nSyntaxError: /home/super-rogatory/Desktop/FSA21-06/SeniorPhase/chatterly/server/router.js: Support for the experimental syntax 'jsx' isn't currently enabled (18:3):\\n\\n\\u001b[0m \\u001b[90m 16 |\\u001b[39m \\t\\u001b[90m// can't pass a react component to res.send(). The browser will not recognize it.\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 17 |\\u001b[39m \\t\\u001b[36mconst\\u001b[39m markup \\u001b[33m=\\u001b[39m \\u001b[33mReactDOMServer\\u001b[39m\\u001b[33m.\\u001b[39mrenderToString(\\u001b[0m\\n\\u001b[0m\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 18 |\\u001b[39m \\t\\t\\u001b[33m<\\u001b[39m\\u001b[33mStaticRouter\\u001b[39m location\\u001b[33m=\\u001b[39m{req\\u001b[33m.\\u001b[39murl} content\\u001b[33m=\\u001b[39m{{}}\\u001b[33m>\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m    |\\u001b[39m \\t\\t\\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 19 |\\u001b[39m \\t\\t\\t\\u001b[33m<\\u001b[39m\\u001b[33mApp\\u001b[39m \\u001b[33m/\\u001b[39m\\u001b[33m>\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 20 |\\u001b[39m \\t\\t\\u001b[33m<\\u001b[39m\\u001b[33m/\\u001b[39m\\u001b[33mStaticRouter\\u001b[39m\\u001b[33m>\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 21 |\\u001b[39m \\t)\\u001b[33m;\\u001b[39m\\u001b[0m\\n\\nAdd @babel/preset-react (https://git.io/JfeDR) to the 'presets' section of your Babel config to enable transformation.\\nIf you want to leave it as-is, add @babel/plugin-syntax-jsx (https://git.io/vb4yA) to the 'plugins' section to enable parsing.\\n    at Parser._raise (/home/super-rogatory/Desktop/FSA21-06/SeniorPhase/chatterly/node_modules/@babel/parser/lib/index.js:541:17)\\n    at Parser.raiseWithData (/home/super-rogatory/Desktop/FSA21-06/SeniorPhase/chatterly/node_modules/@babel/parser/lib/index.js:534:17)\\n    at Parser.expectOnePlugin (/home/super-rogatory/Desktop/FSA21-06/SeniorPhase/chatterly/node_modules/@babel/parser/lib/index.js:3595:18)\\n    at Parser.parseExprAtom (/home/super-rogatory/Desktop/FSA21-06/SeniorPhase/chatterly/node_modules/@babel/parser/lib/index.js:11981:18)\\n    at Parser.parseExprSubscripts (/home/super-rogatory/Desktop/FSA21-06/SeniorPhase/chatterly/node_modules/@babel/parser/lib/index.js:11584:23)\\n    at Parser.parseUpdate (/home/super-rogatory/Desktop/FSA21-06/SeniorPhase/chatterly/node_modules/@babel/parser/lib/index.js:11564:21)\\n    at Parser.parseMaybeUnary (/home/super-rogatory/Desktop/FSA21-06/SeniorPhase/chatterly/node_modules/@babel/parser/lib/index.js:11539:23)\\n    at Parser.parseMaybeUnaryOrPrivate (/home/super-rogatory/Desktop/FSA21-06/SeniorPhase/chatterly/node_modules/@babel/parser/lib/index.js:11353:61)\\n    at Parser.parseExprOps (/home/super-rogatory/Desktop/FSA21-06/SeniorPhase/chatterly/node_modules/@babel/parser/lib/index.js:11360:23)\\n    at Parser.parseMaybeConditional (/home/super-rogatory/Desktop/FSA21-06/SeniorPhase/chatterly/node_modules/@babel/parser/lib/index.js:11330:23)\");\n\n//# sourceURL=webpack://chatterly/./server/router.js?");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "express-validator":
/*!************************************!*\
  !*** external "express-validator" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("express-validator");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("morgan");

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("sequelize");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("socket.io");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./server/index.js");
/******/ 	
/******/ })()
;