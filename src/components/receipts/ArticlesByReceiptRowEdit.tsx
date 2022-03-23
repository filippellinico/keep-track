import NumberFormat from "react-number-format";
import {Button, Col, Form, InputGroup} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import {
    library
} from '@fortawesome/fontawesome-svg-core'
import React, {useState} from "react";
import {Typeahead} from "react-bootstrap-typeahead";
import {ItemWithName} from "./ReceiptForm";
import {ArticlesByReceiptRow} from "./ArticlesByReceiptRow";

library.add(faArrowAltCircleLeft, faSave)

interface ArticlesByReceiptRowEditProps {
    articleOfReceiptRowEdit: ArticlesByReceiptRow;
    handleSave: (articleOfReceiptRowEdit: ArticlesByReceiptRow, rowIndex: number) => void;
    handleCancel: (rowIndex: number) => void;
    articles: ItemWithName[]
    rowIndex: number
}

export const ArticlesByReceiptRowEdit = (props: ArticlesByReceiptRowEditProps) => {
    const {
        articleOfReceiptRowEdit: {
            article_id, articleName
        }
    } = props
    let currentArticleSelection: ItemWithName[] = []
    if (article_id && articleName){
        currentArticleSelection = [{
            id: article_id.toString(),
            name: articleName
        }]
    }
    const [selectedArticles, setSelectedArticles] = useState<ItemWithName[]>(currentArticleSelection);
    const [currentArticleOfReceiptRowEdit, setCurrentArticleOfReceiptRowEdit] = useState<ArticlesByReceiptRow>(props.articleOfReceiptRowEdit);

    const setField = (fieldName:string, fieldValue:string, conversion:(fieldValue:string)=>number) => {
        setCurrentArticleOfReceiptRowEdit({
            ...currentArticleOfReceiptRowEdit,
            [fieldName]: conversion(fieldValue)
        })
    }

    const handleSave = () => {
        props.handleSave({
            ...currentArticleOfReceiptRowEdit,
            article_id: selectedArticles[0].id,
            articleName: selectedArticles[0].name
        }, props.rowIndex)
    }
    const handleBack = () => {
        props.handleCancel(props.rowIndex)
    }

    return (
        <tr>
            <td>
                <Form.Row>
                    <Form.Group controlId={`formGridArticle-${props.rowIndex}`}>
                        <InputGroup hasValidation>
                            <Typeahead<ItemWithName>
                                allowNew
                                id={`article-typeahead-${props.rowIndex}`}
                                labelKey="name"
                                onChange={setSelectedArticles}
                                options={props.articles}
                                placeholder="Choose an article..."
                                selected={selectedArticles}
                                minLength={2}
                                clearButton
                            />
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
            </td>
            <td>
                <Form.Row>
                    <Form.Group controlId={`formGridQuantity-${props.rowIndex}`}>
                        <InputGroup hasValidation>
                            <Form.Control
                                type='number'
                                onChange={ e => setField('quantity', e.target.value, parseInt) }
                                placeholder="Enter quantity"
                                value={currentArticleOfReceiptRowEdit.quantity}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
            </td>
            <td>
                <Form.Row>
                    <Form.Group controlId={`formGridWeight-${props.rowIndex}`}>
                        <InputGroup hasValidation>
                            <Form.Control
                                type='number'
                                onChange={ e => setField('weight', e.target.value, parseFloat) }
                                placeholder="Enter weight"
                                value={currentArticleOfReceiptRowEdit.weight}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId={`formGridWeightType-${props.rowIndex}`}>
                        <InputGroup hasValidation>
                            <Form.Control
                                type='number'
                                onChange={ e => setField('quantity', e.target.value, parseInt) }
                                placeholder="Enter weight_type"
                                value={currentArticleOfReceiptRowEdit.weight_type}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
            </td>
            <td>
                <Form.Row>
                    <Form.Group controlId={`formGridPrice-${props.rowIndex}`}>
                        <InputGroup hasValidation>
                            <Form.Control
                                as={NumberFormat}
                                value={currentArticleOfReceiptRowEdit.price}
                                displayType={'input'}
                                thousandSeparator={true}
                                prefix={'€'}
                                onValueChange={(values:any) => {
                                    const {value} = values;
                                    setField('price', value, parseFloat)
                                }}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
            </td>
            <td>
                <Button variant="warning" onClick={handleBack}>
                    <FontAwesomeIcon icon="arrow-alt-circle-left" size="lg" />
                </Button>{' '}
                <Button variant="success" onClick={handleSave}>
                    <FontAwesomeIcon icon="save" size="lg"/>
                </Button>
            </td>
        </tr>
    )
}