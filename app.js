import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import configRoutes from "./routes/index.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { pageView } from "./middleware.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

const app = express();

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);
app.use(
  session({
    name: "TikitAuthCookie",
    secret:
      "Tikit is a really secure application and this is a really secure secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/tickets/view/:id", pageView);
var hbs = exphbs.create({ defaultLayout: 'main', helpers: {
  select: function(value, options) {
    return options.fn(this).replace(
      new RegExp(' value=\"' + value + '\"'),
      '$& selected="selected"');
  },
  selectMultiple: function(value, owners, options) {
    if(owners){
      for(let i = 0; i < owners.length; i++){
        if(value == owners[i]){
          return 'selected="selected"';
        }
      }
    }
    return "";
  },
  ifEquals: (arg1, arg2, options) => {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  },
  ifNotEquals: (arg1, arg2, options) => {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
  }
}});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

configRoutes(app);


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
