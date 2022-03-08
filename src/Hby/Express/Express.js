// app :: AppBuilder
exports.app = {
  middle: [],
  route: [],
};

// mkApp :: AppBuilder -> Task App
exports.mkApp = (builder) => {
  var express = require("express");
  return new Promise((res, rej) => {
    var app = express();
    for (var m of builder.middle) app.use(m);
    for (var r of builder.route) app.use(r.path, r.route);
    res(app);
  });
};

// ----------------------
// mkMiddle :: (Req -> Res -> Task Unit) -> Middle
exports.mkMiddle = (f) => {
  return f;
};

// useMiddle :: AppBuilder -> Middle -> AppBuilder
exports.useMiddle = (b) => (m) => {
  var R = require("ramda");
  return R.mergeDeepRight(b, { middle: R.union(b.middle, [m]) });
};

// ----------------------
// route :: RouteBuilder
exports.route = [];

// setGet :: RouteBuilder -> Path -> (Req -> Res -> Task Unit) -> RouteBuilder
exports.setGet = (b) => (p) => (f) => {
  var R = require("ramda");
  return R.union(b, [{ type: "get", path: p, fun: f }]);
};

// setPost :: RouteBuilder -> Path -> (Req -> Res -> Task Unit) -> RouteBuilder
exports.setPost = (b) => (p) => (f) => {
  var R = require("ramda");
  return R.union(b, [{ type: "post", path: p, fun: f }]);
};

// mkRoute :: RouteBuilder -> Task Route
exports.mkRoute = (b) => () => {
  return new Promise((res, rej) => {
    var router = express.Router();
    for (var r of b) {
      if (r.type == "get") {
        router.get(r.path, (req, res) => r.fun(req)(res)());
      } else if (r.type == "post") {
        router.post(r.path, (req, res) => r.fun(req)(res)());
      }
    }
    res(router);
  });
};

// useRoute :: AppBuilder -> Path -> Route -> AppBuilder
exports.useRoute = (b) => (p) => (r) => {
  var R = require("ramda");
  return R.mergeDeepRight(b, {
    route: R.union(b.route, [{ path: p, route: r }]),
  });
};

// ----------------------
// getBody :: Req -> Json
exports.getBody = (req) => {
  return req.body;
};

// getQuery :: Req -> Json
exports.getQuery = (req) => {
  return req.query;
};

// ----------------------
// send :: Res -> Json -> Task Unit
exports.send = (expressRes) => (data) => () => {
  return new Promise((res, rej) => {
    expressRes.send(data);
    res();
  });
};

// ----------------------
// listen :: App -> Port -> CallBack -> Task Unit
exports.listen = (app) => (port) => (cb) => () => {
  return new Promise((res, rej) => {
    app.listen(port, cb);
    res();
  });
};

// ----------------------
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
