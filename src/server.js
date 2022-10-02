import express from 'express';
import connection from './database/db.js';
import cors from 'cors'
import router from './routes/routers.js';

const app = express()
app.use(express.json())
app.use(cors());
app.use(router);

app.get('/status', async (req, res) => {
  res.send('Ok')
})

app.listen(4000, () => {
  console.log('Server port 4000.')
})