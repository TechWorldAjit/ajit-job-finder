import app from '../server/app.js';

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
};

export default app;
