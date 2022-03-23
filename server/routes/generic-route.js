// Import express
const express = require('express')

// Import books-controller
const genericController = require('../controllers/generic-controller.js')

// Create router
const router = express.Router()

// Add route for GET request to retrieve all articles
// In server.js, articles route is specified as '/articles'
// this means that '/' translates to '/articles'
router.get('/', genericController.getAll)

// Add route for POST request to create new article
// In server.js, articles route is specified as '/articles'
// this means that '/' translates to '/books'
router.post('/', genericController.create)

// Add route for GET request to retrieve all articles
// In server.js, articles route is specified as '/articles'
// this means that '/:id' translates to '/articles/:id'
// where :id is a path param
router.get('/:id', genericController.get)

// Add route for PUT request to retrieve all articles
// In server.js, articles route is specified as '/articles'
// this means that '/:id' translates to '/articles/:id'
// where :id is a path param
router.put('/:id', genericController.update)

// Add route for PUT request to delete specific article
// In server.js, articles route is specified as '/articles'
// this means that '/:id' translates to '/articles/:id'
// where :id is a path param
router.delete('/:id', genericController.delete)

// Export router
module.exports = router