// Import dependencies
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')

// Import routes
const router = require('./routes/generic-route')
const receiptRouter = require('./routes/receipt-route')
const statisticsRouter = require('./routes/statistics-route')

// Set default port for express app
const PORT = process.env.PORT || 4001

// Create express app
const app = express()

// Apply middleware
// Note: Keep this at the top, above routes
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Implement books route
app.use(express.static('build'))
app.use('/api/v1/books', router)
app.use('/api/v1/articles', router)
app.use('/api/v1/shops', router)
app.use('/api/v1/receipts', receiptRouter)
app.use('/api/v1/weight_types', router)
app.use('/api/v1/statistics', statisticsRouter)

// Start express app
app.listen(PORT, function() {
    console.log(`Server is running on: ${PORT}`)
})