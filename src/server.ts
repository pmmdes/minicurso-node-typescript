import express from 'express';
import routes from './routes'; //não é necessário adicionar o index no path.

const app = express();

app.use(routes);

app.listen(3333, () => {
    console.log("Server started on port 3333!");
});