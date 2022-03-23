// Import database
const knex = require('./../db')

// Retrieve all books
exports.booksAll = async (req, res) => {
    // Get all books from database
    knex
        .select('*') // select all records
        .from('books') // from 'books' table
        .then(userData => {
            // Send books extracted from database in response
            res.json(userData)
        })
        .catch(err => {
            // Send a error message in response
            res.json({ message: `There was an error retrieving books: ${err}` })
        })
}

// Create new book
exports.booksCreate = async (req, res) => {
    const data = {
        ...req.body
    };
    const table = req.baseUrl.replace("/api/v1/", "");
    // Add new book to database
    knex(table)
        .insert(data)
        .returning('id')
        .then(([id]) => {
            // Send a success message in response
            res.status(201)
                .json({
                    id: id,
                    ...data
                })
        })
        .catch(err => {
            // Send a error message in response
            res.json({ message: `There was an error creating ${req.body.title} book: ${err}` })
        })
}

// Remove specific book
exports.booksDelete = async (req, res) => {
    // Find specific book in the database and remove it
    knex('books')
        .where('id', req.params.id) // find correct record based on id
        .del() // delete the record
        .then(() => {
            // Send a success message in response
            res.json({ message: `Book ${req.params.id} deleted.` })
        })
        .catch(err => {
            // Send a error message in response
            res.json({ message: `There was an error deleting ${req.params.id} book: ${err}` })
        })
}

// Remove all books on the list
exports.booksReset = async (req, res) => {
    // Remove all books from database
    knex
        .select('*') // select all records
        .from('books') // from 'books' table
        .truncate() // remove the selection
        .then(() => {
            // Send a success message in response
            res.json({ message: 'Book list cleared.' })
        })
        .catch(err => {
            // Send a error message in response
            res.json({ message: `There was an error resetting book list: ${err}.` })
        })
}