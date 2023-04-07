import userRoutes from './users.js';
import ticketRoutes from './tickets.js';

import mainRoutes from "./main.js";

const constructorMethod = (app) => {

  /* will need to figure out our routes later, just putting this here as a template */
  app.use('/', mainRoutes);
  app.use('/users', userRoutes);
  app.use('/tickets', ticketRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;