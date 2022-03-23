import React from "react";
import {Table} from "reactstrap";
import {ReceiptRow, ReceiptsListRow} from "./ReceiptsListRow";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCartPlus, faPencilAlt, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import {
    library
} from '@fortawesome/fontawesome-svg-core'
import {Button} from "react-bootstrap";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import BootstrapTable from "react-bootstrap-table-next";

library.add( faCartPlus, faPencilAlt, faTrashAlt)

interface ReceiptList {
    receipts: ReceiptRow[];
    loading: boolean;
    handleCreate: () => void;
    handleEdit: (id: number) => void;
    handleRemove: (id: number) => void;
}

export const ReceiptsList = (props: ReceiptList) => {
    const columns = [{
        dataField: 'date',
        sort: true,
        text: 'Date',
        formatter: (cellContent:any, row: ReceiptRow) => (
            <Moment format="DD.MM.YYYY HH:mm" date={row.date} />
        )
    }, {
        dataField: 'shop',
        text: 'Shop',
        sort: true
    }, {
        dataField: 'sum',
        text: 'Total price',
        sort: true,
        formatter: (cellContent:any, row: ReceiptRow) => (
            <NumberFormat
                value={row.sum}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'€'}
            />
        )
    }, {
        dataField: 'buttons',
        isDummyField: true,
        text: '',
        formatter: (cellContent:any, row: ReceiptRow) => (
            <>
                <Button onClick={() => props.handleRemove(row.id)} variant="danger">
                    <FontAwesomeIcon icon="trash-alt" size="lg" />
                </Button>{' '}
                <Button onClick={() => props.handleEdit(row.id)} variant="primary">
                    <FontAwesomeIcon icon="pencil-alt" size="lg" />
                </Button>
            </>
        )
    }];

    const noResults = ()=>"There are no receipts to show. Create one!"

    if (props.loading) return <p>loading...</p>
    return (
        <>
            <p>{props.receipts.length} Items</p>
            <BootstrapTable
                keyField="id"
                bootstrap4
                data={ props.receipts }
                columns={ columns }
                striped
                hover
                bordered={ false }
                caption={
                    <Button onClick={() => props.handleCreate()} variant="primary">
                        <FontAwesomeIcon icon="cart-plus" size="3x" /> New receipt
                    </Button>
                }
                noDataIndication={noResults}
            />
        </>
    );
}