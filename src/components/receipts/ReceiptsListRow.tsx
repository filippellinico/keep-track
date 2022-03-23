import React from "react";
import NumberFormat from "react-number-format";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {
    library
} from '@fortawesome/fontawesome-svg-core'
import {Button} from "react-bootstrap";
import Moment from 'react-moment';

library.add( faPencilAlt, faTrashAlt)

export interface ReceiptRow {
    id: number;
    date: Date;
    sum: number;
    shop: string;
}

interface ReceiptListRow {
    receiptRow: ReceiptRow;
    key: number;
    handleEdit: (id: number) => void;
    handleRemove: (id: number) => void;
}

export const ReceiptsListRow = (props: ReceiptListRow) => (
    <tr>
        <td>
            <Moment format="DD.MM.YYYY HH:mm" date={props.receiptRow.date} />
        </td>

        <td>
            {props.receiptRow.shop}
        </td>

        <td>
            <NumberFormat
                value={props.receiptRow.sum}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'€'}
            />
        </td>

        <td>
            <Button onClick={() => props.handleRemove(props.receiptRow.id)} variant="danger">
                <FontAwesomeIcon icon="trash-alt" size="lg" />
            </Button>{' '}
            <Button onClick={() => props.handleEdit(props.receiptRow.id)} variant="primary">
                <FontAwesomeIcon icon="pencil-alt" size="lg" />
            </Button>
        </td>
    </tr>
);