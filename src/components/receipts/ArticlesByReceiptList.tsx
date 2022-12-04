import {Button, Form, InputGroup} from "react-bootstrap";
import NumberFormat from "react-number-format";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartPlus} from '@fortawesome/free-solid-svg-icons'
import {
    library
} from '@fortawesome/fontawesome-svg-core'
import {Table} from "reactstrap";
import React, {useEffect, useState} from "react";
import {ArticlesByReceiptRow} from "./ArticlesByReceiptRow";
import axios from "axios";
import {ItemWithName, Receipt} from "./ReceiptForm";
import {ReceiptRow} from "./ReceiptsListRow";
import {ArticlesByReceiptRowEdit} from "./ArticlesByReceiptRowEdit";

library.add( faCartPlus)

interface ArticlesByReceiptListProps{
    articlesByReceiptRows: ArticlesByReceiptRow[];
    loading: boolean;
    handleAdd: () => void;
    handleEdit: (rowIndex: number) => void;
    handleRemove: (rowIndex: number) => void;
    handleSave: (articleOfReceiptRowEdit: ArticlesByReceiptRow, rowIndex: number) => void;
    handleCancel: (rowIndex: number) => void;
    articles: ItemWithName[]
    weightTypes: ItemWithName[]
    receiptSum: number
    handleReceiptSumSave: (sum: number) => void;
}

export const ArticlesByReceiptList = (props: ArticlesByReceiptListProps) => {
    const computeTotalArticlesPrice = ():number => {
        let totalPrice = 0
        for (let i = 0; i < props.articlesByReceiptRows.length; i++) {
            const articleOfReceiptRow = props.articlesByReceiptRows[i]
            if(articleOfReceiptRow.price){
                totalPrice += articleOfReceiptRow.price
            }
        }
        return totalPrice
    }

    const computeTotalArticles = ():number => {
        let quantity = 0
        for (let i = 0; i < props.articlesByReceiptRows.length; i++) {
            const articleOfReceiptRow = props.articlesByReceiptRows[i]
            if(articleOfReceiptRow.quantity){
                quantity += articleOfReceiptRow.quantity
            }
        }
        return quantity
    }

    if (props.loading) return <p>loading...</p>
    return (
        <>
            <Button onClick={props.handleAdd} variant="primary">
                <FontAwesomeIcon icon="cart-plus" size="2x" />
            </Button>
            <Table id="articlesTable">
                <tbody>
                {props.articlesByReceiptRows.length > 0 ? (
                    props.articlesByReceiptRows.map((articlesByReceiptRow: ArticlesByReceiptRow, idx) =>
                            articlesByReceiptRow.edit? (
                                <ArticlesByReceiptRowEdit
                                    articleOfReceiptRowEdit={articlesByReceiptRow}
                                    handleSave={props.handleSave}
                                    handleCancel={props.handleCancel}
                                    articles={props.articles}
                                    weightTypes={props.weightTypes}
                                    rowIndex={idx}
                                    key={idx}
                                />
                            ) :
                                (
                                    <ArticlesByReceiptRow
                                        articlesByReceiptRow={articlesByReceiptRow}
                                        handleEdit={props.handleEdit}
                                        handleRemove={props.handleRemove}
                                        rowIndex={idx}
                                        key={idx}
                                    />
                                )
                    )
                ) : (<></>)
                }
                <tr>
                    <td style={{ width: '250px' }}></td>
                    <td style={{ width: '190px', fontSize: '1rem', textAlign: 'right' }}>
                        Total of {computeTotalArticles()} articles
                    </td>
                    <td style={{ width: '85px' }}></td>
                    <td style={{ width: '132px' }}></td>
                    <td style={{ width: '132px', textAlign: 'right', paddingRight: '12px' }}>
                        <NumberFormat
                            value={computeTotalArticlesPrice()}
                            displayType={'text'}
                            isNumericString
                            allowNegative={false}
                            decimalSeparator={","}
                            thousandSeparator={"."}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            suffix={' €'}
                            className={'cellText'}
                        />
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td style={{ width: '250px' }}></td>
                    <td style={{ width: '190px' }}></td>
                    <td style={{ width: '85px' }}></td>
                    <td style={{ width: '132px' }}></td>
                    <td style={{ width: '132px' }}>
                        <Form.Row>
                            <Form.Group controlId="formGridSum">
                                <InputGroup hasValidation>
                                    <Form.Control
                                        as={NumberFormat}
                                        value={props.receiptSum}
                                        displayType={'input'}
                                        suffix={' €'}
                                        onValueChange={(values:any) => {
                                            const {value} = values;
                                            props.handleReceiptSumSave(value)
                                        }}
                                        isNumericString
                                        allowNegative={false}
                                        decimalSeparator={","}
                                        thousandSeparator={"."}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        className={'price'}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                    </td>
                    <td></td>
                </tr>
                </tbody>
            </Table>
        </>
    );
}