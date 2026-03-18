const express = require('express');
const bcrypt = require('bcryptjs');
const { sequelize, Book, User, Checkout } = require('./database/setup');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Test database connection
async function testConnection() {
    try {
        await db.authenticate();
        console.log('Connection to database established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

// BOOK ROUTES

// GET /api/books - Get all books
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// GET /api/books/:id - Get book by ID
app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        res.json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});

// POST /api/books - Create new book
app.post('/api/books', async (req, res) => {
    try {
        const { title, author, isbn, genre, publishedYear, available } = req.body;
        
        const newBook = await Book.create({
            title,
            author,
            isbn,
            genre,
            publishedYear,
            available
        });
        
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Failed to create book' });
    }
});

// PUT /api/books/:id - Update existing book
app.put('/api/books/:id', async (req, res) => {
    try {
        const { title, author, isbn, genre, publishedYear, available } = req.body;
        
        const [updatedRowsCount] = await Book.update(
        { title, author, isbn, genre, publishedYear, available },
        { where: { id: req.params.id } }
        );
        
        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        const updatedBook = await Book.findByPk(req.params.id);
        res.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Failed to update book' });
    }
});

// DELETE /api/books/:id - Delete book
app.delete('/api/books/:id', async (req, res) => {
    try {
        const deletedRowsCount = await Book.destroy({
        where: { id: req.params.id }
        });
        
        if (deletedRowsCount === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//Want to test Database
/*const { db, Book, User, Checkout } = require('./database/setup'); 

async function getData(checkoutId) { 
    const checkoutData = await Checkout.findByPk(checkoutId) 
    const bookData = await Book.findByPk(checkoutData.bookId) 
    const userData = await User.findByPk(checkoutData.userId) 

    console.log(`${userData.name} has checked out ${bookData.title} and it is due on ${checkoutData.dueDate}`) 
} 

getData(1) // "John Smith has checked out The Great Gatsby and it is due on Wed Feb 14 2024 19:00:00 GMT-0500 (Eastern Standard Time)"*/