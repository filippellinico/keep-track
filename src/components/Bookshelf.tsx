// Import deps
import React, {FormEvent, useEffect, useState} from 'react'
import axios from 'axios'
// Import styles
import './../styles/bookshelf.css'
// Import components
import {BookshelfList} from "./BookshelfList";
import {Button, Col, Form, InputGroup} from "react-bootstrap";

interface Fields{
    [key: string]: string
}

// Create Bookshelf component
export const Bookshelf = () => {
    // Prepare states
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)

    const [ form, setForm ] = useState<Fields>({});
    const [ errors, setErrors ] = useState<Fields>({});

    const setField = (field: string, value: string) => {
        setForm({
            ...form,
            [field]: value
        });
    };

    // Fetch all books on initial render
    useEffect(() => {
        fetchBooks()
    }, [])

    // Fetch all books
    const fetchBooks = async () => {
        // Send GET request to 'books/all' endpoint
        axios
            .get('http://localhost:4001/books/all')
            .then(response => {
                // Update the books state
                setBooks(response.data)

                // Update loading state
                setLoading(false)
            })
            .catch(error => console.error(`There was an error retrieving the book list: ${error}`))
    }

    // Create new book
    const handleBookCreate = (form:Fields) => {
        // Send POST request to 'books/create' endpoint
        const currentTitle = form.title;
        axios
            .post('http://localhost:4001/books/create', {
                ...form
            })
            .then(res => {
                console.log(res.data)

                // Fetch all books to refresh
                // the books on the bookshelf list
                fetchBooks()
            })
            .catch(error => console.error(`There was an error creating the ${currentTitle} book: ${error}`))
    }

    const findFormErrors = () => {
        const { title, author, rating, pubDate } = form;
        let newErrors = errors;
        newErrors = isRequired("title", title, newErrors);
        newErrors = isRequired("author", author, newErrors);
        newErrors = isRequired("pubDate", pubDate, newErrors);

        if ( author && author.length > 30 ) newErrors.author = 'author is too long!'
        // rating errors
        const ratingNb: number = +rating;
        if ( !ratingNb || ratingNb > 5 || ratingNb < 1 ) newErrors.rating = 'must assign a rating between 1 and 5!'

        return newErrors
    };

    const isRequired = (field: string, value: string, currentErrors:Fields) => {
        if ( value === undefined || !value || value === '' ){
            return{
                ...currentErrors,
                [field]: 'cannot be blank!'
            };
        }
        else{
            delete currentErrors[field];
            return {...currentErrors};
        }
    };

    const isFieldRequired = (field: string, value: string) => {
        const newErrors = isRequired(field, value, errors);
        setErrors(newErrors);
        setField(field, value);
    };

    const handleSubmit = ( e : FormEvent ) => {
        e.preventDefault()
        // get our new errors
        const newErrors = findFormErrors();
        // Conditional logic:
        if ( Object.keys(newErrors).length > 0) {
            // We got errors!
            setErrors(newErrors);
        } else {
            // No errors! Put any logic here for the form submission!
            setErrors({});
            handleBookCreate(form);
            console.info(`Book ${form.title} by ${form.author} added.`);
            setForm({});
        }
    };

    // Remove book
    const handleBookRemove = (id: number, title: string) => {
        // Send PUT request to 'books/delete' endpoint
        axios
            .put('http://localhost:4001/books/delete', { id: id })
            .then(() => {
                console.log(`Book ${title} removed.`)

                // Fetch all books to refresh
                // the books on the bookshelf list
                fetchBooks()
            })
            .catch(error => console.error(`There was an error removing the ${title} book: ${error}`))
    }

    // Reset book list (remove all books)
    const handleListReset = () => {
        // Send PUT request to 'books/reset' endpoint
        axios.put('http://localhost:4001/books/reset')
            .then(() => {
                // Fetch all books to refresh
                // the books on the bookshelf list
                fetchBooks()
            })
            .catch(error => console.error(`There was an error resetting the book list: ${error}`))
    }

    return (
        <div className="book-list-wrapper">
            {/* Form for creating new book */}
            <div className="book-list-form">
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} md="4" controlId="formGridTitle">
                            <Form.Label>Title</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type='text'
                                    onChange={ e => isFieldRequired('title', e.target.value) }
                                    isInvalid={ !!errors.title }
                                    placeholder="Enter title"
                                    value={form.title}
                                />
                                <Form.Control.Feedback type='invalid' tooltip>
                                    { errors.title }
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="formGridAuthor">
                            <Form.Label>Author</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type='text'
                                    onChange={ e => isFieldRequired('author', e.target.value) }
                                    isInvalid={ !!errors.author }
                                    placeholder="Enter author"
                                    value={form.author}
                                />
                                <Form.Control.Feedback type='invalid' tooltip>
                                    { errors.author }
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} md="4" controlId="formGridPubDate">
                            <Form.Label>Publication date</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type='text'
                                    onChange={ e => isFieldRequired('pubDate', e.target.value) }
                                    isInvalid={ !!errors.pubDate }
                                    placeholder="Enter publication date"
                                    value={form.pubDate}
                                />
                                <Form.Control.Feedback type='invalid' tooltip>
                                    { errors.pubDate }
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="formGridPubDate">
                            <Form.Label>Rating</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type='number'
                                    onChange={ e => setField('rating', e.target.value) }
                                    isInvalid={ !!errors.rating }
                                    placeholder="Enter rating"
                                    value={form.rating}
                                />
                                <Form.Control.Feedback type='invalid' tooltip>
                                    { errors.rating }
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Button onClick={handleSubmit}>Add the book</Button>
                </Form>
            </div>

            {/* Render bookshelf list component */}
            <BookshelfList books={books} loading={loading} handleBookRemove={handleBookRemove} />

            {/* Show reset button if list contains at least one book */}
            {books.length > 0 && (
                <button className="btn btn-reset" onClick={handleListReset}>Reset books list.</button>
            )}
        </div>
    )
}