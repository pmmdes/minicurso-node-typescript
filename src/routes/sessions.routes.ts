import {Router} from 'express';
import {compare} from 'bcryptjs';
import {sign} from 'jsonwebtoken';
import knex from '../database/connection';
import authConfig from '../config/auth';

const sessionsRouter = Router();

sessionsRouter.post('/', async(request, response) => {
    const {name, email, password} = request.body;

    const user = await knex('users').where('email', email).first(); //busca usuário no db

    if(!user) { //se o usuário não for encontrado no banco de dados
       return response.status(400).json({
           message: "Credentials not found.",
       }); 
    }

    const handledUser = {
        id: user.id,
        name: user.name,
        email: user.email
    }

    const comparePassword = await compare(password, user.password); //retorna boolean

    if(!comparePassword){
        return response.status(400).json({
            message: "Incorrect credentials.",
        }); 
    }

    // Criando token jwt
    const token = sign({/*payload*/}, authConfig.jwt.secret, {
        subject: String(user.id),
        expiresIn:  authConfig.jwt.expiresIn
    });

    return response.json({handledUser, token});


});

export default sessionsRouter;