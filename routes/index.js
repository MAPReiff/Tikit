import userRoutes from './users.js';
import ticketRoutes from './tickets.js';
import commentRoutes from './comments.js';
import mainRoutes from "./main.js";

const constructorMethod = (app) => {

  /* will need to figure out our routes later, just putting this here as a template */
  app.use('/', mainRoutes);
  app.use('/users', userRoutes);
  app.use('/tickets', ticketRoutes);
  app.use('/comments', commentRoutes)

  app.use('*', (req, res) => {
    // res.status(404).json({error: 'Route Not found'});
    res.status(404).render("404", {title: "404 Page not found"})
  });
};

export default constructorMethod;