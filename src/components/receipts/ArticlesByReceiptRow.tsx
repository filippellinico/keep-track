import Moment from "react-moment";
import NumberFormat from "react-number-format";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

export interface ArticlesByReceiptRow{
    id?: number
    article_id?: string,
    receipt_id?: number,
    price: number,
    unitPrice: number,
    quantity: number,
    weight?: number,
    weight_type?: number
    articleName?: string
    weightTypeName?: string
    edit: boolean
    invalidArticle: boolean
}

interface ArticlesByReceiptRowProps {
    articlesByReceiptRow: ArticlesByReceiptRow;
    handleEdit: (rowIndex: number) => void;
    handleRemove: (rowIndex: number) => void;
    rowIndex: number
}

export const ArticlesByReceiptRow = (props: ArticlesByReceiptRowProps) => (
    <tr>
        <td style={{ width: '250px' }}>
            <span className={'cellText'}>{props.articlesByReceiptRow.articleName}</span>
        </td>
        <td style={{ width: '215px' }}>
            <span style={{ paddingRight: '23px' }} className={'cellText'}>
                {props.articlesByReceiptRow.weight && props.articlesByReceiptRow.weight > 0 ? (
                    <span>{props.articlesByReceiptRow.weight} {props.articlesByReceiptRow.weightTypeName}</span>
                ) : ""}
            </span>
        </td>
        <td style={{ width: '85px', textAlign: 'right' }}>
            <span className={'cellText'}>{props.articlesByReceiptRow.quantity} X </span>
        </td>
        <td style={{ width: '132px' }}>
            <NumberFormat
                value={props.articlesByReceiptRow.unitPrice}
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
        <td style={{ width: '132px', textAlign: 'right', paddingRight: '12px' }}>
            <NumberFormat
                value={props.articlesByReceiptRow.price}
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