var connect = require("connect");
var http = require("http");
var net = require("net");

var app = connect();

var requestIp = require("request-ip");

// respond to all requests
app.use(function (req, res) {
  var ip = "";
  // use our custom attributeName that we registered in the middleware
  if (req.headers["x-client-ip"]) {
    ip = req.headers["x-client-ip"];
  } // Load-balancers (AWS ELB) or proxies.

  // var xForwardedFor = getClientIpFromXForwardedFor(
  //   req.headers["x-forwarded-for"]
  // );

  if (req.headers["x-forwarded-for"]) {
    ip = req.headers["x-forwarded-for"];
  } // Cloudflare.
  // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
  // CF-Connecting-IP - applied to every request to the origin.

  if (req.headers["cf-connecting-ip"]) {
    ip = req.headers["cf-connecting-ip"];
  } // Fastly and Firebase hosting header (When forwared to cloud function)

  if (req.headers["fastly-client-ip"]) {
    ip = req.headers["fastly-client-ip"];
  } // Akamai and Cloudflare: True-Client-IP.

  if (req.headers["true-client-ip"]) {
    ip = req.headers["true-client-ip"];
  } // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.

  if (req.headers["x-real-ip"]) {
    ip = req.headers["x-real-ip"];
  } // (Rackspace LB and Riverbed's Stingray)
  // http://www.rackspace.com/knowledge_center/article/controlling-access-to-linux-cloud-sites-based-on-the-client-ip-address
  // https://splash.riverbed.com/docs/DOC-1926

  if (req.headers["x-cluster-client-ip"]) {
    ip = req.headers["x-cluster-client-ip"];
  }

  if (req.headers["x-forwarded"]) {
    ip = req.headers["x-forwarded"];
  }

  if (req.headers["forwarded-for"]) {
    ip = req.headers["forwarded-for"];
  }

  if (req.headers.forwarded) {
    ip = req.headers.forwarded;
  }

  // https://nodejs.org/api/net.html#net_net_isip_input
  var ipType = net.isIP(ip); // returns 0 for invalid, 4 for IPv4, and 6 for IPv6
  res.end(
    "Hello, your ip address is " + ip + " and is of type IPv" + ipType + "\n"
  );
});

//create node.js http server and listen on port
http.createServer(app).listen(3000);

// test it locally from the command line
// > curl -X GET localhost:3000 # Hello, your ip address is ::1 and is of type IPv6
