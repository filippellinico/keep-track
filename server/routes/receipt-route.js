// Import express
const express = require('express')
const articlesByReceiptController = require('../controllers/articles-receipt-controller')
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
router.delete('/:id', articlesByReceiptController.deleteReceipt)

// Add route for GET request to retrieve all articles
// In server.js, articles route is specified as '/articles'
// this means that '/' translates to '/articles'
router.get('/:receipt_id/articles', articlesByReceiptController.getAll)

// Add route for POST request to create new article
// In server.js, articles route is specified as '/articles'
// this means that '/' translates to '/books'
router.post('/:receipt_id/articles', articlesByReceiptController.create)

// Add route for GET request to retrieve all articles
// In server.js, articles route is specified as '/articles'
// this means that '/:id' translates to '/articles/:id'
// where :id is a path param
router.get('/:receipt_id/articles/:article_receipt_id', articlesByReceiptController.get)

// Add route for PUT request to retrieve all articles
// In server.js, articles route is specified as '/articles'
// this means that '/:id' translates to '/articles/:id'
// where :id is a path param
router.put('/:receipt_id/articles/:article_receipt_id', articlesByReceiptController.update)

// Add route for PUT request to delete specific article
// In server.js, articles route is specified as '/articles'
// this means that '/:id' translates to '/articles/:id'
// where :id is a path param
router.delete('/:receipt_id/articles/:article_receipt_id', articlesByReceiptController.delete)

// Export router
module.exports = router