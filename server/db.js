// Import path module
const path = require('path')

// Get the location of database.sqlite file
const dbPath = path.resolve(__dirname, 'keep-track.db')
let connection = {
    filename: dbPath,
};
if (process.env.NODE_ENV === 'test') {
    connection = ':memory:';
}

// Create connection to SQLite database
const knex = require('knex')({
    client: 'sqlite3',
    connection: connection,
    useNullAsDefault: true
})

// Create a table in the database called "books"
knex.schema
    // Make sure no "books" table exists
    // before trying to create new
    .hasTable('books')
    .then((exists) => {
        if (!exists) {
            // If no "books" table exists
            // create new, with "id", "author", "title",
            // "pubDate" and "rating" columns
            // and use "id" as a primary identification
            // and increment "id" with every new record (book)
            return knex.schema.createTable('books', (table)  => {
                table.increments('id').primary()
                table.integer('author')
                table.string('title')
                table.string('pubDate')
                table.integer('rating')
            })
                .then(() => {
                    // Log success message
                    console.log('Table \'Books\' created')
                })
                .catch((error) => {
                    console.error(`There was an error creating table: ${error}`)
                })
        }
    })
    .then(() => {
        // Log success message
        console.log('books done')
        knex.select('*').from('books')
            .then(data => console.log('books data:', data))
            .catch(err => console.log(err))
    })
    .catch((error) => {
        console.error(`There was an error setting up the database: ${error}`)
    })

knex.schema.hasTable('articles').then(function(exists) {
    if (!exists) {
        return knex.schema.createTable('articles', function (table) {
            table.increments();
            table.string('name');
        })
            .then(() => {
                // Log success message
                console.log('Table \'articles\' created')
            })
    }
});

knex.schema.hasTable('shops').then(function(exists) {
    if (!exists) {
        return knex.schema.createTable('shops', function (table) {
            table.increments();
            table.string('name');
        })
            .then(() => {
                // Log success message
                console.log('Table \'shops\' created')
            })
    }
});

knex.schema.hasTable('receipts').then(function(exists) {
    if (!exists) {
        return knex.schema.createTable('receipts', function (table) {
            table.increments();
            table.decimal('sum');
            table.date('date');
            table.time('time');
            table.integer('shop_id');
            table.foreign('shop_id').references('id').inTable('shops');
        })
            .then(() => {
                // Log success message
                console.log('Table \'receipts\' created')
            })
    }
});

knex.schema.hasTable('weight_types').then(function(exists) {
    if (!exists) {
        return knex.schema.createTable('weight_types', function (table) {
            table.increments();
            table.string('name');
        })
            .then(() => {
                // Log success message
                console.log('Table \'weight_types\' created');
                return knex("weight_types").insert([
                    {name: "g"},
                    {name: "Kg"},
                    {name: "ml"},
                    {name: "L"}
                ]);
            })
    }
})
    .then(() => {
        knex.select('*').from('weight_types')
            .then(data => console.log('weight_types data:', data))
            .catch(err => console.log(err))
    });

knex.schema.hasTable('articles_by_receipts').then(function(exists) {
    if (!exists) {
        return knex.schema.createTable('articles_by_receipts', function (table) {
            table.increments();
            table.integer('article_id');
            table.integer('receipt_id');
            table.decimal('price');
            table.integer('quantity');
            table.integer('weight');
            table.integer('weight_type');
            table.foreign('article_id').references('id').inTable('articles');
            table.foreign('receipt_id').references('id').inTable('receipts');
            table.foreign('weight_type').references('id').inTable('weight_types');
        })
            .then(() => {
                // Log success message
                console.log('Table \'articles_by_receipts\' created')
            })
            .catch((error) => {
                console.error(`There was an error creating articles_by_receipts table: ${error}`)
            })
    }
}).then(() => {
    // Log success message
    console.log('articles_by_receipts done')
})
    .catch((error) => {
        console.error(`There was an error setting up the database: ${error}`)
    });

// Export the database
module.exports = knex