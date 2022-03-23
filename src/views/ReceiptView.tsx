import React, {useEffect, useState} from "react";

// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import {ReceiptsList} from "../components/receipts/ReceiptsList";
import axios from "axios";
import {Receipt, ReceiptForm, ItemWithName} from "../components/receipts/ReceiptForm";
import {ReceiptRow} from "../components/receipts/ReceiptsListRow";

export interface ItemById{
    [key: string]: ItemWithName
}

export const arrayToObject = (array: [], keyField: string) =>
    array.reduce((obj, item) => {
        obj[item[keyField]] = item
        return obj
    }, {})

function ReceiptView() {

    const [receipts, setReceipts] = useState([] as ReceiptRow[])
    const [shops, setShops] = useState([] as ItemWithName[])
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [receiptSelected, setReceiptSelected] = useState<number | null>(null)

    // Fetch all items on initial render
    useEffect(() => {
        fetchList()
    }, [])

    const fetchList = async () => {
        // Send GET request to 'books/all' endpoint
        axios
            .get('http://localhost:4001/api/v1/receipts')
            .then(receiptsResponse => {
                axios
                    .get('http://localhost:4001/api/v1/shops')
                    .then(shopsResponse => {
                        setShops(shopsResponse.data)
                        const shopsById: ItemById = arrayToObject(shopsResponse.data, "id")
                        const receiptItems: ReceiptRow[] = receiptsResponse.data.map((i: Receipt) => {
                            return {
                                id: i.id,
                                date: new Date(i.date),
                                sum: i.sum,
                                shop: shopsById[i.shop_id]? shopsById[i.shop_id].name: "Unknown"
                            }
                        })

                        // Update the list state
                        setReceipts(receiptItems)

                        // Update loading state
                        setLoading(false)
                    })
            })
            .catch(error => console.error(`Error list: ${error}`))
    }

    const addShop = (shop: ItemWithName) => {
        setShops([
            ...shops,
            shop
        ])
    }

    const handleCreate = () => {
        setEditMode(true);
        setReceiptSelected(null);
    }

    const handleBack = () => {
        setEditMode(false);
    }

    const handleSave = (receiptRow: ReceiptRow) => {
        setEditMode(false);
        setReceiptSelected(null);
        setReceipts([
            receiptRow,
            ...receipts
        ])
    }

    const handleEdit = (id: number) => {
        setEditMode(true);
        setReceiptSelected(id);
    }

    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        {editMode ? (
                            <Card className="demo-icons">
                                <CardHeader>
                                    <CardTitle tag="h5">{receiptSelected ? ("Edition of receipt") : ("Add a new receipt")}</CardTitle>
                                    <p className="card-category">
                                        Form for receipt
                                    </p>
                                </CardHeader>
                                <CardBody className="all-icons">
                                    <ReceiptForm
                                        shops={shops}
                                        handleBack={handleBack}
                                        handleSave={handleSave}
                                        receiptSelected={receiptSelected}
                                        addShop={addShop}
                                    />
                                </CardBody>
                            </Card>
                        ) : (
                            <Card className="demo-icons">
                                <CardHeader>
                                    <CardTitle tag="h5">Overview of receipts</CardTitle>
                                    <p className="card-category">
                                        Table of receipts for listing, edition, creation, deletion
                                    </p>
                                </CardHeader>
                                <CardBody className="all-icons">
                                    <ReceiptsList
                                        receipts={receipts}
                                        loading={loading}
                                        handleCreate={handleCreate}
                                        handleEdit={handleEdit}
                                        handleRemove={()=>{}}
                                    />
                                </CardBody>
                            </Card>
                        )}
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default ReceiptView;