import express from 'express';
import cors from 'cors';
import path from 'path';
import {errors} from 'celebrate';
import routes from './routes'; //não é necessário adicionar o index no path.

const app = express();

app.use(cors()); //qualquer dominio pode acessar

app.use(express.json()); //deixar explicito que ira interpretar json

app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads'))); //rota estática

app.use(errors());

app.listen(3333, () => {
    console.log("Server started on port 3333!");
});