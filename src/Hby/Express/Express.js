// app :: AppBuilder
exports.app = {
  middle: [],
  route: [],
  static: null,
};

// mkApp :: AppBuilder -> Task App
exports.mkApp = (builder) => {
  var express = require("express");
  return new Promise((res, rej) => {
    var app = express();
    for (var m of builder.middle) app.use(m);
    for (var r of builder.route) app.use(r.path, r.route);
    if (builder.static != null) {
      app.use(builder.path, express.static(builder.dirPath));
    }
    res(app);
  });
};

// ----------------------
// mkMiddle :: (Req -> Res -> Task Unit) -> Middle
exports.mkMiddle = (f) => {
  return f;
};

// useMiddle :: Middle -> AppBuilder -> AppBuilder
exports.useMiddle = (m) => (b) => {
  var R = require("ramda");
  return R.mergeDeepRight(b, { middle: R.union(b.middle, [m]) });
};

// ----------------------
// route :: RouteBuilder
exports.route = [];

// setGet :: UrlPath -> (Req -> Res -> Task Unit) -> RouteBuilder ->  RouteBuilder
exports.setGet = (p) => (f) => (b) => {
  var R = require("ramda");
  return R.union(b, [{ type: "get", path: p, fun: f }]);
};

// setPost :: UrlPath -> (Req -> Res -> Task Unit) -> RouteBuilder -> RouteBuilder
exports.setPost = (p) => (f) => (b) => {
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

// useRoute :: UrlPath -> Route -> AppBuilder -> AppBuilder
exports.useRoute = (p) => (r) => (b) => {
  var R = require("ramda");
  return R.mergeDeepRight(b, {
    route: R.union(b.route, [{ path: p, route: r }]),
  });
};

// ----------------------
// useStatic :: UrlPath -> DirPath -> AppBuilder -> AppBuilder
exports.useStatic = (p) => (d) => (b) => {
  var R = require("ramda");
  return R.mergeDeepRight(b, {
    static: {
      path: p,
      dirPath: d,
    },
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
