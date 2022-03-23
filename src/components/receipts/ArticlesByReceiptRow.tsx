import Moment from "react-moment";
import NumberFormat from "react-number-format";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

export interface ArticlesByReceiptRow{
    id?: number
    article_id?: string,
    receipt_id?: number,
    price?: number,
    quantity?: number,
    weight?: number,
    weight_type?: number
    articleName?: string
    weightTypeName?: string
    edit:boolean
}

interface ArticlesByReceiptRowProps {
    articlesByReceiptRow: ArticlesByReceiptRow;
    handleEdit: (rowIndex: number) => void;
    handleRemove: (rowIndex: number) => void;
    rowIndex: number
}

export const ArticlesByReceiptRow = (props: ArticlesByReceiptRowProps) => (
    <tr>
        <td>
            {props.articlesByReceiptRow.articleName}
        </td>
        <td>
            {props.articlesByReceiptRow.quantity}
        </td>
        <td>
            `{props.articlesByReceiptRow.weight} {props.articlesByReceiptRow.weightTypeName}`
        </td>
        <td>
            <NumberFormat
                value={props.articlesByReceiptRow.price}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'€'}
            />
        </td>
        <td>
            <Button onClick={() => props.handleRemove(props.rowIndex)} variant="danger">
                <FontAwesomeIcon icon="trash-alt" size="lg" />
            </Button>{' '}
            <Button onClick={() => props.handleEdit(props.rowIndex)} variant="primary">
                <FontAwesomeIcon icon="pencil-alt" size="lg" />
            </Button>
        </td>
    </tr>
);