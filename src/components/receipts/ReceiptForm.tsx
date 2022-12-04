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
    unitPrice: number,
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
    const [invalidShop, setInvalidShop] = useState<boolean>(false);
    const [receiptSelected, setReceiptSelected] = useState<number | null>(null);

    const [articlesByReceipt, setArticlesByReceipt] = useState([] as ArticleOfReceipt[])
    const [articlesByReceiptRows, setArticlesByReceiptRows] = useState([] as (ArticlesByReceiptRow)[])

    useEffect(() => {
        fetchResources()
        if (props.receiptSelected !== receiptSelected){
            fetchItem()
        }
        else {
            setLoading(false)
        }
    }, [props.receiptSelected])

    const fetchResources = async ()  => {
        const articlesResponse = await axios.get(`http://localhost:4001/api/v1/articles`)
        setArticles(articlesResponse.data)
        const weightTypesResponse = await axios.get(`http://localhost:4001/api/v1/weight_types`)
        setWeightTypes(weightTypesResponse.data)
    }

    const fetchItem = async () => {
        setReceiptSelected(props.receiptSelected)
        
        const articlesResponse = await axios.get(`http://localhost:4001/api/v1/articles`)
        setArticles(articlesResponse.data)
        const weightTypesResponse = await axios.get(`http://localhost:4001/api/v1/weight_types`)
        setWeightTypes(weightTypesResponse.data)
        const articlesById: ItemById = arrayToObject(articlesResponse.data, "id")
        const weightTypesById: ItemById = arrayToObject(weightTypesResponse.data, "id")
        
        console.log("fetch receipt")
        // Send GET request to '/receipts' endpoint
        const receiptsResponse = await axios.get(`http://localhost:4001/api/v1/receipts/${props.receiptSelected}`)
        // Update the receipts state
        const receipt: Receipt = {
            ...receiptsResponse.data[0],
            date: new Date(receiptsResponse.data[0].date)
        };
        setDate(receipt.date)
        const shopsById: ItemById = arrayToObject(props.shops as[], "id")
        console.log(`selected shop [${shopsById[receipt.shop_id].name}]`)
        setSelectedShops([{
            id: receipt.shop_id.toString(),
            name: shopsById[receipt.shop_id]? shopsById[receipt.shop_id].name : "Unknown"
        }])
        setSum(receipt.sum)

        const articlesByReceiptResponse = await axios.get(`http://localhost:4001/api/v1/receipts/${props.receiptSelected}/articles`)
        setArticlesByReceipt(articlesByReceiptResponse.data)

        const articlesByReceiptRowList: ArticlesByReceiptRow[] = articlesByReceiptResponse.data.map((articleOfReceipt:ArticleOfReceipt) => {
            const weightTypeItem = weightTypesById[articleOfReceipt.weight_type]
            return {
                ...articleOfReceipt,
                articleName: articlesById[articleOfReceipt.article_id].name,
                weightTypeName: weightTypeItem ? weightTypeItem.name : '',
                edit: false,
                invalidArticle: false,
                unitPrice: articleOfReceipt.unitPrice ? articleOfReceipt.unitPrice : 0
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
                console.log(props.receiptSelected)
                saveArticles(props.receiptSelected!)
                    .then(() => {
                        props.handleSave({
                            date: date?date:new Date(),
                            sum: sum,
                            shop: selectedShops[0].name,
                            id: props.receiptSelected!
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
                    price: value.price,
                    unitPrice: value.unitPrice,
                    quantity: value.quantity,
                    id: value.id,
                    weight: value.weight?value.weight:0,
                    weight_type: value.weight_type?value.weight_type:1
                }
            })

        let articlesByReceiptToDelete = [
            ...articlesByReceipt
        ]
        for (let i = 0; i < articlesOfReceipt.length; i++) {
            const articleOfReceipt = articlesOfReceipt[i]
            if (articleOfReceipt.id){
                await updateArticleOfReceipt(articleOfReceipt)
            }
            else{
                await createArticleOfReceipt(articleOfReceipt)
            }
        }
        for (let i = 0; i < articlesByReceiptToDelete.length; i++) {
            const articleOfReceipt = articlesByReceiptToDelete[i]
            const existingArticleByReceipt = articlesOfReceipt.filter(currentArticleByReceipt => currentArticleByReceipt.id == articleOfReceipt.id)
                if(existingArticleByReceipt.length < 1){
                    deleteArticleOfReceipt(articleOfReceipt.receipt_id, articleOfReceipt.id!)
                }
        }
    }

    const createArticle = async (articleName: string) => {
        return await axios.post('http://localhost:4001/api/v1/articles', {
                name: articleName
            })
    }

    const createArticleOfReceipt = async (articleOfReceipt: ArticleOfReceipt) => {
        return await axios.post(`http://localhost:4001/api/v1/receipts/${articleOfReceipt.receipt_id}/articles`, articleOfReceipt)
    }
    const updateArticleOfReceipt = async (articleOfReceipt: ArticleOfReceipt) => {
        return await axios.put(`http://localhost:4001/api/v1/receipts/${articleOfReceipt.receipt_id}/articles/${articleOfReceipt.id}`, articleOfReceipt)
    }
    const deleteArticleOfReceipt = async (receiptId: number, articleOfReceiptId: number) => {
        return await axios.delete(`http://localhost:4001/api/v1/receipts/${receiptId}/articles/${articleOfReceiptId}`)
    }

    const handleSubmit = ( e : FormEvent ) => {
        e.preventDefault()
        if(!selectedShops || selectedShops.length < 1){
            setInvalidShop(true)
            return
        }
        setInvalidShop(false)
        console.log(selectedShops[0].id)
        if (selectedShops[0]  && selectedShops[0].id.toString().includes("new-")){
            axios
                .post('http://localhost:4001/api/v1/shops', {
                    name: selectedShops[0].name
                })
                .then(res => {
                    console.log(res.data)
                    handleReceiptSave(res.data.id);
                    props.addShop(selectedShops[0])
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
                edit: true,
                price: 0,
                unitPrice: 0,
                quantity: 1,
                invalidArticle: false
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
        if(articles.filter(article => article.name == articleOfReceiptRow.articleName!).length < 1){
            const currentArticle: ItemWithName = {
                id: articleOfReceiptRow.article_id!,
                name: articleOfReceiptRow.articleName!
            }
            setArticles([
                ...articles,
                currentArticle
            ])
        }
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

    const checkShop = (itemWithNames: ItemWithName[]) => {
        if(!itemWithNames || itemWithNames.length < 1){
            setInvalidShop(true)
            return
        }
        setInvalidShop(false)
        setSelectedShops(itemWithNames)
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
                                isInvalid={invalidShop}
                            />
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                            Please choose a shop from the selection
                        </Form.Control.Feedback>
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
                    weightTypes={weightTypes}
                    receiptSum={sum}
                    handleReceiptSumSave={setSum}
                    />
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