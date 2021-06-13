import {Button, Form} from "react-bootstrap";
import {FormEvent, useState} from "react";

interface Fields{
    [key: string]: string
}

const FirstForm = () => {
    const [ form, setForm ] = useState<Fields>({});
    const [ errors, setErrors ] = useState<Fields>({});

    const setField = (field: string, value: string) => {
        setForm({
            ...form,
            [field]: value
        })
    };

    const findFormErrors = () => {
        const { name, food, rating, comment } = form
        const newErrors = {} as Fields;
        // name errors
        if ( !name || name === '' ) newErrors.name = 'cannot be blank!'
        else if ( name.length > 30 ) newErrors.name = 'name is too long!'
        // food errors
        if ( !food || food === '' ) newErrors.food = 'select a food!'
        // rating errors
        const ratingNb: number = +rating;
        if ( !ratingNb || ratingNb > 5 || ratingNb < 1 ) newErrors.rating = 'must assign a rating between 1 and 5!'
        // comment errors
        if ( !comment || comment === '' ) newErrors.comment = 'cannot be blank!'
        else if ( comment.length > 100 ) newErrors.comment = 'comment is too long!'

        return newErrors
    };

    const handleSubmit = ( e : FormEvent ) => {
        e.preventDefault()
        // get our new errors
        const newErrors = findFormErrors();
        // Conditional logic:
        if ( Object.keys(newErrors).length > 0 ) {
            // We got errors!
            setErrors(newErrors);
        } else {
            // No errors! Put any logic here for the form submission!
            setErrors({});
            alert('Thank you for your feedback!');
            console.log('Thank you for your feedback!');
        }
    };

    return (
        <div className='App d-flex flex-column align-items-center'>
            <h1>How was your dinner?</h1>
            <Form style={{ width: '300px' }}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        onChange={ e => setField('name', e.target.value) }
                        isInvalid={ !!errors.name }
                    />
                    <Form.Control.Feedback type='invalid'>
                        { errors.name }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Food?</Form.Label>
                    <Form.Control
                        as='select'
                        onChange={ e => setField('food', e.target.value) }
                        isInvalid={ !!errors.food }
                    >
                        <option value=''>Select a food:</option>
                        <option value='chicken parm'>Chicken Parm</option>
                        <option value='BLT'>BLT</option>
                        <option value='steak'>Steak</option>
                        <option value='salad'>Salad</option>
                    </Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        { errors.food }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                        type='number'
                        onChange={ e => setField('rating', e.target.value) }
                        isInvalid={ !!errors.rating }
                    />
                    <Form.Control.Feedback type='invalid'>
                        { errors.rating }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Comments</Form.Label>
                    <Form.Control
                        as='textarea'
                        onChange={ e => setField('comment', e.target.value) }
                        isInvalid={ !!errors.rating }
                    />
                    <Form.Control.Feedback type='invalid'>
                        { errors.comment }
                    </Form.Control.Feedback>
                </Form.Group>
                <Button type='submit' onClick={handleSubmit}>Submit Review</Button>
            </Form>
        </div>
    )
};

export default FirstForm;