import userRoutes from "./users.js";
import ticketRoutes from "./tickets.js";
import commentRoutes from "./comments.js";
import mainRoutes from "./main.js";

const constructorMethod = (app) => {
  app.use("/", mainRoutes);
  app.use("/users", (req, res, next) => {
    if (!req.session.user) {
      req.method = "GET";
      return res.redirect("/login");
    }
    next();
  });
  app.use("/users", userRoutes);
  app.use("/tickets", (req, res, next) => {
    if (!req.session.user) {
      req.method = "GET";
      return res.redirect("/login");
    }
    next();
  });
  app.use("/tickets", ticketRoutes);
  app.use("/comments", commentRoutes);

  app.use("*", (req, res) => {
    // res.status(404).json({error: 'Route Not found'});
    res.status(404).render("404", {
      title: "404 Page not found",
      user_id: req.session.user._id,
      msg: "Error 404: Page Not Found",
    });
  });
};

export default constructorMethod;
