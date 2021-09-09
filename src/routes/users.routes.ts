import {Router} from 'express';
import knex from '../database/connection';
import {hash} from 'bcryptjs';
import {celebrate, Joi} from 'celebrate';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
    const users = await knex('users').select('*');
    return response.json(users);
});

usersRouter.post('/', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email().label('e-mail'),
        password: Joi.string().required().min(4) 
    })
},
{
    abortEarly: false,
}), async(request, response) => {
    const {name, email, password} = request.body;

    const passwordHashed = await hash(password, 8);

    const user = {
        name, 
        email, 
        password: passwordHashed
    };

    const transaction = await knex.transaction();

    try {
        const newIds = await transaction('users').insert(user);

        await transaction.commit();

        return response.json({
            id: newIds[0],
            ...user
        });
    }
    catch(error) {

        transaction.rollback();

        return response.status(400).json({
            message: "An error ocurred. Verify your informations."
        });
    }    
});

export default usersRouter;