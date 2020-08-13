import express from 'express';
import { Server } from 'http';
import { config } from 'dotenv';

import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import glob from 'fast-glob';
import mongoose from 'mongoose';

config();
const { PORT, DB_URL } = process.env;

const app = express();
const server = Server(app);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection
  .on('error', (error) => console.log(error))
  .once('open', () => {
    console.log('Database Connected!');

    server.listen(PORT || 8080, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Server online: connected to port ${PORT}`);

        app.use(express.static(path.resolve('dist')));

        const ENDPOINT_DIR = path.resolve('server', 'routes');
        glob
          .sync('**/*.js', { cwd: ENDPOINT_DIR })
          .forEach(async (fileName) => {
            let route;
            if (path.basename(fileName) === 'index.js')
              route = `${path.dirname(fileName)}`;
            else
              route = `${path.dirname(fileName)}/${path.basename(
                fileName,
                '.js'
              )}`;

            const {
              default: { router: handler },
            } = await import(`@routes/${fileName}`);

            app.use(`api/${route}`, handler);
          });

        app.get('*', (req, res) => {
          res.sendFile(path.resolve('dist', 'index.html'));
        });
      }
    });
  });
