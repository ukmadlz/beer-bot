const TABLE_NAME = 'twitch_users'

exports.up = (knex) => {
    return knex.schema
    .createTable(TABLE_NAME, (table) => {
        table.integer('id').unique();
        table.string('login', 255).notNullable();
        table.string('display_name', 255).notNullable();
        table.string('profile_image_url', 255).notNullable();
        table.string('token', 255).notNullable();
        table.string('refreshToken', 255).notNullable();
        table.timestamps(null, true);
    })
};

exports.down = (knex) => {
    return knex.schema
    .dropTable(TABLE_NAME)
};
