// mkApp :: Task App
exports.mkApp = () => {
  var express = require("express");
  return new Promise((res, rej) => {
    var app = express();
    res(app);
  });
};

// mkMiddle :: (Req -> Res -> Task Unit) -> Middle
exports.mkMiddle = (f) => {
  return f;
};

// useMiddle :: App -> Middle -> Task Unit
exports.useMiddle = (app) => (m) => () => {
  return new Promise((res, rej) => {
    app.use(m);
    res();
  });
};

// mkRoute :: Task Route
exports.mkRoute = () => {
  var express = require("express");
  return new Promise((res, rej) => {
    var router = express.Router();
    res(router);
  });
};

// setGet :: Route -> Url -> (Req -> Res -> Task Unit) -> Task Unit
exports.setGet = (route) => (path) => (f) => () => {
  return new Promise((res, rej) => {
    route.get(path, (req, res) => f(req)(res)());
    res();
  });
};

// setPost :: Route -> Url -> (Req -> Res -> Task Unit) -> Task Unit
exports.setPost = (route) => (path) => (f) => () => {
  return new Promise((res, rej) => {
    route.post(path, (req, res) => f(req)(res)());
    res();
  });
};

// useRoute :: App -> Url -> Route -> Task Unit
exports.useRoute = (app) => (path) => (route) => () => {
  return new Promise((res, rej) => {
    app.use(path, route);
    res();
  });
};

// useStatic :: App -> Url -> Path -> Task Unit
exports.useStatic = (app) => (url) => (path) => () => {
  var express = require("express");
  return new Promise((res, rej) => {
    app.use(url, express.static(path));
    res();
  });
};

// getBody :: Req -> Json
exports.getBody = (req) => {
  return req.body;
};

// getQuery :: Req -> Json
exports.getQuery = (req) => {
  return req.query;
};

// send :: Res -> Json -> Task Unit
exports.send = (expressRes) => (data) => () => {
  return new Promise((res, rej) => {
    expressRes.send(data);
    res();
  });
};

// listen :: App -> Port -> CallBack -> Task Unit
exports.listen = (app) => (port) => (cb) => () => {
  return new Promise((res, rej) => {
    app.listen(port, cb);
    res();
  });
};

// _middle_json :: Unit -> Middle
exports._middle_json = () => {
  var express = require("express");
  return express.json();
};

// _middle_urlencoded :: Unit -> Middle
exports._middle_urlencoded = () => {
  var express = require("express");
  return express.urlencoded({ extended: true });
};

// _middle_cookieParser :: Unit -> Middle
exports._middle_cookieParser = () => {
  var cookieParser = require("cookie-parser");
  return cookieParser();
};
