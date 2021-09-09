import {Router} from 'express';
import knex from '../database/connection'; //conexao

const itemsRouter = Router();

itemsRouter.get('/', async (request, response) => {
    
    const items = await knex('items').select('*');

    //serializar informação recebida do banco (tratando o url da imagem)

    const serializedItems = items.map(item => {
        return {
            id: item.id,
            title: item.title,
            image_url: `http://localhost:3333/uploads/${item.image}`
        }
    });
    
    return response.json(serializedItems);
});

export default itemsRouter;