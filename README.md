# Keep Track

A full-stack web application for tracking various items like books, articles, vehicles, and receipts.

## Overview

Keep Track is a React-based application with an Express backend that allows users to manage and track different types of items. The application provides a user-friendly interface for adding, viewing, and removing items from various categories.

## Features

- Track books with details like title, author, publication date, and rating
- Manage articles, vehicles, and shop information
- Store and organize receipts
- View statistics about your tracked items

## Technology Stack

- **Frontend**: React, TypeScript, Bootstrap
- **Backend**: Node.js, Express
- **Database**: SQLite (via Knex.js)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/filippellinico/keep-track.git
   cd keep-track
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   This will start both the frontend and backend servers concurrently.

## Project Structure

- `/src` - Frontend React application
  - `/components` - React components
  - `/styles` - CSS stylesheets
  - `/views` - Page views
  - `/layouts` - Layout components
- `/server` - Backend Express application
  - `/controllers` - API controllers
  - `/routes` - API routes
  - `/tests` - Server tests

## API Endpoints

The application provides the following API endpoints:

- `/api/v1/books` - CRUD operations for books
- `/api/v1/articles` - CRUD operations for articles
- `/api/v1/vehicles` - CRUD operations for vehicles
- `/api/v1/shops` - CRUD operations for shops
- `/api/v1/receipts` - CRUD operations for receipts
- `/api/v1/weight_types` - CRUD operations for weight types
- `/api/v1/statistics` - Get statistics about tracked items

## Development

### Running Tests

To run frontend tests:
```bash
npm test
```

To run server tests:
```bash
npm run test-server
```

### Building for Production

To build the application for production:
```bash
npm run build
```

## License

This project is licensed under the terms found in the [LICENSE](LICENSE) file.