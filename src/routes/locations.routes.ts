import {Router} from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import {celebrate, Joi} from 'celebrate';
import knex from '../database/connection'; //conexao
import isAuthenticated from '../middlewares/isAuthenticated';

const locationsRouter = Router();

const upload = multer(multerConfig);

locationsRouter.use(isAuthenticated);

locationsRouter.get('/', async (request, response) => {

    const {city, uf, items} = request.query;

    if(city && uf && items){
        const parsedItems: Number[] = String(items).split(',').map(item => Number(item.trim())); //remove espaços e converte para numero   

        const locations = await knex('locations')
            .join('location_items', 'locations.id','=','location_items.location_id')
            .whereIn('location_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('locations.*');

        return response.json(locations);
    }
    else if(city && uf && !items) {
        const locations = await knex('locations')
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('locations.*');

        return response.json(locations);
    }
    else {
        return response.json(
            await knex('locations').select('*')
        );
    }    
});

locationsRouter.get('/:id', async (request, response) => {

    const {id} = request.params;

    const location = await knex('locations').where('id', id).first(); // first() traz apenas um registro, nao um array de registros

    if(!location) {
        return response.status(400).json({
            message: "Location not found."
        });
    }

    //realizando o join das tabelas items e location

    const items = await knex('items')
        .join('location_items', 'items.id', '=', 'location_items.item_id')
        .where('location_items.location_id', id)
        .select('items.title')

    return response.json({location, items});
});

locationsRouter.post('/', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email().label('e-mail'),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2).min(2).messages({
            'string.base': `"uf" should be a type of 'text'`,
            'string.empty': `"uf" cannot be an empty field`,
            'string.min': `"uf" should have a minimum length of {2}`,
            'string.max': `"uf" should have a maximum length of {2}`,
            'any.required': `"uf" is a required field`
        }),
        items: Joi.array().items(Joi.number()).required(),
    })
}, {
    abortEarly: false,
}), async (request, response) => {
    
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items //ids de items que a location coleta
    } = request.body;

    const location = {
        image: "fake-image.jpg",
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf    
    };

     
    const transaction = await knex.transaction(); // iniciando a transação

    try {
        const newIds = await transaction('locations').insert(location);

        const location_id = newIds[0];

        const locationItems = items.map((item_id: number) => { //   Consultando a tabela pivô

            const selectedItem = transaction('items').where('id', item_id).first(); //buscando o id enviado no banco de dados

            if(!selectedItem){
                return response.status(400).json({
                    message: "item not found"
                });
            }

            return {
                item_id,
                location_id //short syntax
            }
        });

        await transaction('location_items').insert(locationItems);

        await transaction.commit(); //confirma todas as operações feitas se tudo for ok

        return response.json({
            id: location_id,
            ...location // spread operator, pega todo o conteúdo do array
        });
    }
    catch(error) {            
        transaction.rollback();
        return response.status(400).json({
            message: "An error ocurred. Please verify your informations."
        })
    }   
});

locationsRouter.put('/:id', upload.single("image"), async (request, response) => {
    const {id} = request.params;

    const image = request.file?.filename;

    const location = await knex('locations').where('id', id).first();

    if(!location) {
        return response
        .json({
            message: "Location not found"
        })
        .status(400);
    }

    const locationUpdated = {
        ...location, //todos os mesmos dados que ja existem
        image //imagem que queremos inserir
    }

    await knex('locations').update(locationUpdated).where('id', id);

    return response.json(locationUpdated);
});

export default locationsRouter;