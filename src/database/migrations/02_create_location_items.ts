import {Knex} from 'knex'; //importando com a letra maiúscula, dizemos que esse é o tipo do knex

export async function up(knex: Knex) {
    return knex.schema.createTable('location_items', (table) => {
        table.increments('id').primary();  
        table.integer('location_id') //chave estrangeira
            .notNullable()
            .references('id')      //se relaciona com o campo id
            .inTable('locations'); //da tabela locations
            
        table.integer('item_id')    //chave estrangeira
            .notNullable()
            .references('id')      //se relaciona com o campo id
            .inTable('items');     //da tabela items
        
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('location_items');
}