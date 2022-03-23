import {Button} from "react-bootstrap";
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
}

export const ArticlesByReceiptList = (props: ArticlesByReceiptListProps) => {
    if (props.loading) return <p>loading...</p>
    return (
        <>
            <p>{props.articlesByReceiptRows.length} Items</p>
            <Table responsive>
                <thead className="text-primary">
                <tr>
                    <th>Article</th>
                    <th>Quantity</th>
                    <th>Weight</th>
                    <th className="text-right">Price</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {props.articlesByReceiptRows.length > 0 ? (
                    props.articlesByReceiptRows.map((articlesByReceiptRow: ArticlesByReceiptRow, idx) =>
                            articlesByReceiptRow.edit? (
                                <ArticlesByReceiptRowEdit
                                    articleOfReceiptRowEdit={articlesByReceiptRow}
                                    handleSave={props.handleSave}
                                    handleCancel={props.handleCancel}
                                    articles={props.articles}
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
                ) : (
                    <tr>
                        <td style={{ textAlign: 'center' }} colSpan={4}>There are no articles yet. Add one!</td>
                    </tr>
                )
                }
                </tbody>
            </Table>
            <Button onClick={props.handleAdd} variant="primary">
                <FontAwesomeIcon icon="cart-plus" size="3x" /> Add article
            </Button>
        </>
    );
}