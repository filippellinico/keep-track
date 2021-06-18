import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import {Bookshelf} from "../components/Bookshelf";

function BookshelfView() {
    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card className="demo-icons">
                            <CardHeader>
                                <CardTitle tag="h5">Overview of books</CardTitle>
                                <p className="card-category">
                                    Example of form to enter book, list books, remove books
                                </p>
                            </CardHeader>
                            <CardBody className="all-icons">
                                <Bookshelf />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default BookshelfView;