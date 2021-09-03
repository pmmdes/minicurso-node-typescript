import {Knex} from 'knex'; //importando com a letra maiúscula, dizemos que esse é o tipo do knex

export async function up(knex: Knex) {
    return knex.schema.createTable('items', (table) => {
        table.increments('id').primary();  //id sendo chave primária e auto incremento
        table.string('title') .notNullable();
        table.string('image') .notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('items');
}