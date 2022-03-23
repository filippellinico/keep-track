// Import database
const knex = require('./../db')

// Retrieve all items
exports.getAll = async (req, res) => {
    // Get all items from database
    const table = req.baseUrl.replace("/api/v1/", "");
    knex
        .select('*') // select all records
        .from(table) // from corresponding table
        .then(userData => {
            // Send items extracted from database in response
            res.json(userData)
        })
        .catch(err => {
            // Send a error message in response
            res.status(500).json({ message: err })
        })
}

// CRUD
// Create new item
exports.create = async (req, res) => {
    // Add new item to database
    const data = {
        ...req.body
    };
    const table = req.baseUrl.replace("/api/v1/", "");
    knex(table)
        .insert(data)
        .returning('id')
        .then(([id]) => {
            // Send created item in response
            res.status(201)
                .json({
                    id: id,
                    ...data
                })
        })
        .catch(err => {
            // Send a error message in response
            res.status(500).json({ message: err })
        })
}

// Retrieve specific item
exports.get = async (req, res) => {
    // Get specific item from database
    const table = req.baseUrl.replace("/api/v1/", "");
    knex(table)
        .where('id', req.params.id)
        .then(userData => {
            if (!userData){
                // not found
                res.sendStatus(404);
            }
            // Send item extracted from database in response
            res.json(userData)
        })
        .catch(err => {
            // Send a error message in response
            res.status(500).json({ message: err })
        })
}

// Update specific article
exports.update = async (req, res) => {
    // Update specific article in database
    const table = req.baseUrl.replace("/api/v1/", "");
    knex(table)
        .update({
            ...req.body
        })
        .where('id', req.params.id)
        .then(() => {
            // Send a success message in response
            res.sendStatus(204)
        })
        .catch(err => {
            // Send a error message in response
            res.status(500).json({ message: err })
        })
}

// Delete specific item
exports.delete = async (req, res) => {
    // Find specific item in the database and remove it
    const table = req.baseUrl.replace("/api/v1/", "");
    knex(table)
        .where('id', req.params.id) // find correct record based on id
        .del() // delete the record
        .then(() => {
            // Send a success message in response
            res.sendStatus(204)
        })
        .catch(err => {
            // Send a error message in response
            res.status(500).json({ message: err })
        })
}