import React, {FormEvent, useEffect, useState} from "react";
import axios from "axios";
import {ReceiptRow} from "./ReceiptsListRow";
import {Button, Col, Form, InputGroup} from "react-bootstrap";
import DatePicker from "react-datepicker";
import NumberFormat from 'react-number-format';
import { Typeahead } from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import {
    library
} from '@fortawesome/fontawesome-svg-core'
import {ArticlesByReceiptRow} from "./ArticlesByReceiptRow";
import {ArticlesByReceiptList} from "./ArticlesByReceiptList";
import {arrayToObject, ItemById} from "../../views/ReceiptView";

library.add(faArrowAltCircleLeft, faSave)

interface ReceiptForm{
    shops: ItemWithName[]
    handleBack: () => void;
    handleSave: (receiptRow: ReceiptRow) => void;
    receiptSelected: number | null
    addShop: (shop:ItemWithName) => void
}

export interface Receipt{
    id: number,
    date: Date,
    sum: number,
    shop_id: number
}

export interface ItemWithName {
    id: string,
    name: string
}

interface Fields{
    [key: string]: string
}

interface ArticleOfReceipt {
    id?: number
    article_id: number,
    receipt_id: number,
    price: number,
    quantity: number,
    weight: number,
    weight_type: number
}

export const ReceiptForm = (props: ReceiptForm) => {

    const [loading, setLoading] = useState(true)
    const [ errors, setErrors ] = useState<Fields>({});

    const [date, setDate] = useState<Date | null>(new Date());
    const [selectedShops, setSelectedShops] = useState<ItemWithName[]>([]);
    const [articles, setArticles] = useState<ItemWithName[]>([]);
    const [weightTypes, setWeightTypes] = useState<ItemWithName[]>([]);
    const [sum, setSum] = useState<number>(0);
    const [receiptSelected, setReceiptSelected] = useState<number | null>(null);

    const [articlesByReceipt, setArticlesByReceipt] = useState([] as ArticleOfReceipt[])
    const [articlesByReceiptRows, setArticlesByReceiptRows] = useState([] as (ArticlesByReceiptRow)[])

    useEffect(() => {
        if (props.receiptSelected !== receiptSelected){
            fetchItem()
        }
    }, [props.receiptSelected])

    const fetchItem = async () => {
        // Send GET request to '/receipts' endpoint
        const receiptsResponse = await axios.get(`http://localhost:4001/api/v1/receipts/${props.receiptSelected}`)
        // Update the receipts state
        const receipt: Receipt = {
            ...receiptsResponse.data[0],
            date: new Date(receiptsResponse.data[0].date)
        };
        setDate(receipt.date)
        setSelectedShops([])
        setSum(receipt.sum)

        setReceiptSelected(props.receiptSelected)
        const articlesResponse = await axios.get(`http://localhost:4001/api/v1/articles`)
        setArticles(articlesResponse.data)
        const articlesById: ItemById = arrayToObject(articlesResponse.data, "id")
        const weightTypesResponse = await axios.get(`http://localhost:4001/api/v1/weight_types`)
        setWeightTypes(weightTypesResponse.data)
        const weightTypesById: ItemById = arrayToObject(weightTypesResponse.data, "id")
        const articlesByReceiptResponse = await axios.get(`http://localhost:4001/api/v1/receipts/${props.receiptSelected}/articles`)
        setArticlesByReceipt(articlesByReceiptResponse.data)

        const articlesByReceiptRowList: ArticlesByReceiptRow[] = articlesByReceiptResponse.data.map((articleOfReceipt:ArticleOfReceipt) => {
            return {
                ...articleOfReceipt,
                articleName: articlesById[articleOfReceipt.article_id.toString()],
                weightTypeName: weightTypesById[articleOfReceipt.weight_type.toString()],
                edit:false
            }
        })
        setArticlesByReceiptRows(articlesByReceiptRowList)
        setLoading(false)
    }

    const handleReceiptCreate = (shop_id: number) => {
        const data = {
            shop_id: shop_id,
            date: date,
            sum: sum
        }
        axios
            .post('http://localhost:4001/api/v1/receipts', data)
            .then(res => {
                console.log(res.data)
                saveArticles(res.data.id)
                    .then(() => {
                        props.handleSave({
                            date: date?date:new Date(),
                            sum: sum,
                            shop: selectedShops[0].name,
                            id: res.data.id
                        })
                    })

            })
            .catch(error => console.error(error))
    }

    const handleReceiptUpdate = (shop_id: number) => {
        const data = {
            shop_id: shop_id,
            date: date,
            sum: sum
        }
        axios
            .put(`http://localhost:4001/api/v1/receipts/${props.receiptSelected}`, data)
            .then(res => {
                console.log(res.data)
                saveArticles(res.data.id)
                    .then(() => {
                        props.handleSave({
                            date: date?date:new Date(),
                            sum: sum,
                            shop: selectedShops[0].name,
                            id: res.data.id
                        })
                    })
            })
            .catch(error => console.error(error))
    }

    const saveArticles = async (receiptId: number) => {
        const articles: ItemById = {}
        for (let i = 0; i < articlesByReceiptRows.length; i++) {
            const articleOfReceipt: ArticlesByReceiptRow = articlesByReceiptRows[i]
            if (articleOfReceipt.article_id && articleOfReceipt.articleName){
                articles[articleOfReceipt.article_id] = {
                    id: articleOfReceipt.article_id,
                    name: articleOfReceipt.articleName
                }
            }
        }
        for (const article in articles) {
            if (article.includes("new-")){
                const newArticleResponse = await createArticle(articles[article].name)
                if (newArticleResponse?.data?.id)
                articles[article] = {
                    id: newArticleResponse.data.id,
                    name: newArticleResponse.data.name
                }
            }
        }
        const articlesOfReceipt: ArticleOfReceipt[] = articlesByReceiptRows
            .map(value => {
                const articleId: string = value.article_id?value.article_id:""
                return {
                    receipt_id: receiptId,
                    article_id: parseInt(articles[articleId].id),
                    price: value.price?value.price:0,
                    quantity: value.quantity?value.quantity:0,
                    id: value.id,
                    weight: value.weight?value.weight:0,
                    weight_type: value.weight_type?value.weight_type:0
                }
            })

        for (let i = 0; i < articlesOfReceipt.length; i++) {
            const articleOfReceipt = articlesOfReceipt[i]
            if (articleOfReceipt.id){
                await createArticlesOfReceipt(articleOfReceipt)
            }
            else{
                await updateArticlesOfReceipt(articleOfReceipt)
            }
        }

    }

    const createArticle = async (articleName: string) => {
        return await axios.post('http://localhost:4001/api/v1/articles', {
                name: articleName
            })
    }

    const createArticlesOfReceipt = async (articleOfReceipt: ArticleOfReceipt) => {
        return await axios.post(`http://localhost:4001/api/v1/receipts/${articleOfReceipt.receipt_id}/articles`, articleOfReceipt)
    }
    const updateArticlesOfReceipt = async (articleOfReceipt: ArticleOfReceipt) => {
        return await axios.put(`http://localhost:4001/api/v1/receipts/${articleOfReceipt.receipt_id}/articles/${articleOfReceipt.article_id}`, articleOfReceipt)
    }

    const handleSubmit = ( e : FormEvent ) => {
        e.preventDefault()
        console.log(selectedShops[0].id)
        if (selectedShops[0]  && selectedShops[0].id.toString().includes("new-")){
            axios
                .post('http://localhost:4001/api/v1/shops', {
                    name: selectedShops[0].name
                })
                .then(res => {
                    console.log(res.data)
                    handleReceiptSave(res.data.id);
                })
                .catch(error => console.error(error))
        }
        else{
            handleReceiptSave(parseInt(selectedShops[0].id));
        }
    };

    const handleReceiptSave = (shop_id: number) => {
        if (props.receiptSelected){
            handleReceiptUpdate(shop_id)
        }
        else{
            handleReceiptCreate(shop_id)
        }
    }

    const handleAdd = () => {
        console.log("handleAdd")
        setArticlesByReceiptRows([
            ...articlesByReceiptRows,
            {
                edit: true
            }
        ])
    }

    const saveArticleRow = (articleOfReceiptRow: ArticlesByReceiptRow, rowIndex: number) => {
        const currentArticleList = [...articlesByReceiptRows]
        currentArticleList[rowIndex] = {
            ...articleOfReceiptRow,
            edit: false
        }
        setArticlesByReceiptRows(currentArticleList)
    }

    const handleArticleEdit = (rowIndex: number) => {
        const selectedArticle = articlesByReceiptRows[rowIndex]
        const currentArticleList = [...articlesByReceiptRows]
        currentArticleList[rowIndex] = {
            ...selectedArticle,
            edit: true
        }
        setArticlesByReceiptRows(currentArticleList)
    }

    const handleArticleCancel = (rowIndex: number) => {
        const selectedArticle = articlesByReceiptRows[rowIndex]
        if (!selectedArticle.quantity)
            handleArticleRemove(rowIndex)
        else{
            const currentArticleList = [...articlesByReceiptRows]
            currentArticleList[rowIndex] = {
                ...selectedArticle,
                edit: false
            }
            setArticlesByReceiptRows(currentArticleList)
        }
    }

    const handleArticleRemove = (rowIndex: number) => {
        const currentArticles=articlesByReceiptRows.filter((value, index) => index !== rowIndex)
        setArticlesByReceiptRows([
            ...currentArticles
        ])
    }

    return(
        <div>
            <Form>
                <Form.Row>
                    <Form.Group as={Col} md="4" controlId="formGridDate">
                        <Form.Label>Date</Form.Label>
                        <InputGroup hasValidation>
                            <DatePicker
                                selected={date}
                                onChange={(date: Date | null) => setDate(date)}
                                showTimeSelect
                                dateFormat="dd.MM.yyyy HH:mm"
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="formGridShop">
                        <Form.Label>Shop</Form.Label>
                        <InputGroup hasValidation>
                            <Typeahead<ItemWithName>
                                allowNew
                                id="basic-typeahead-single"
                                labelKey="name"
                                onChange={setSelectedShops}
                                options={props.shops}
                                placeholder="Choose a shop..."
                                selected={selectedShops}
                                minLength={2}
                                clearButton
                            />
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
                <ArticlesByReceiptList
                    articlesByReceiptRows={articlesByReceiptRows}
                    loading={loading}
                    handleAdd={handleAdd}
                    handleEdit={handleArticleEdit}
                    handleRemove={handleArticleRemove}
                    handleSave={saveArticleRow}
                    handleCancel={handleArticleCancel}
                    articles={articles}
                    />
                <Form.Row>
                    <Form.Group as={Col} md="4" controlId="formGridSum">
                        <Form.Label>Sum</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                as={NumberFormat}
                                isInvalid={ !!errors.sum }
                                value={sum}
                                displayType={'input'}
                                thousandSeparator={true}
                                prefix={'€'}
                                onValueChange={(values:any) => {
                                    const {value} = values;
                                    setSum(value)
                                }}
                            />
                            <Form.Control.Feedback type='invalid' tooltip>
                                { errors.date }
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
                <Button variant="warning" onClick={props.handleBack}>
                    <FontAwesomeIcon icon="arrow-alt-circle-left" size="3x" />
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                    <FontAwesomeIcon icon="save" size="3x"/>
                </Button>
            </Form>
        </div>
    );
}