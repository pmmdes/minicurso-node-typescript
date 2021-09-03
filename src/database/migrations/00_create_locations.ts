import {Knex} from 'knex'; //importando com a letra maiúscula, dizemos que esse é o tipo do knex

export async function up(knex: Knex) {
    return knex.schema.createTable('locations', (table) => {
        table.increments('id').primary();  //id sendo chave primária e auto incremento
        table.string('name').notNullable(); //não nulo
        table.string('image').notNullable(); 
        table.string('email').notNullable(); 
        table.string('whatsapp').notNullable(); 
        table.decimal('latitude').notNullable(); 
        table.decimal('longitude').notNullable(); 
        table.string('city').notNullable(); 
        table.string('uf').notNullable(); 
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('locations');
}