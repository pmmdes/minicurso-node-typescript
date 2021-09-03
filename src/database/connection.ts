import knex from 'knex';
import path from 'path'; //lib nativa do node para tratar caminhos

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite') //dirname = diretorio atual
    },
    useNullAsDefault: true //para nao receber warning no terminal
});

export default connection;