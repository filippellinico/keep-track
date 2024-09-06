import NumberFormat from "react-number-format";
import {Button, Col, Form, InputGroup} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import {
    library
} from '@fortawesome/fontawesome-svg-core'
import React, {useState} from "react";
import {Typeahead, ClearButton} from "react-bootstrap-typeahead";
import {ItemWithName} from "./ReceiptForm";
import {ArticlesByReceiptRow} from "./ArticlesByReceiptRow";

library.add(faArrowAltCircleLeft, faSave)

interface ArticlesByReceiptRowEditProps {
    articleOfReceiptRowEdit: ArticlesByReceiptRow;
    handleSave: (articleOfReceiptRowEdit: ArticlesByReceiptRow, rowIndex: number) => void;
    handleCancel: (rowIndex: number) => void;
    articles: ItemWithName[]
    vehicles: ItemWithName[]
    weightTypes: ItemWithName[]
    rowIndex: number
}

export const ArticlesByReceiptRowEdit = (props: ArticlesByReceiptRowEditProps) => {
    const {
        articleOfReceiptRowEdit: {
            article_id, articleName, vehicle_id, vehicleName
        }
    } = props
    let currentArticleSelection: ItemWithName[] = []
    if (article_id && articleName){
        currentArticleSelection = [{
            id: article_id.toString(),
            name: articleName
        }]
    }
    let currentVehicleSelection: ItemWithName[] = []
    if (vehicle_id && vehicleName){
        currentVehicleSelection = [{
            id: vehicle_id.toString(),
            name: vehicleName
        }]
    }
    const [selectedArticles, setSelectedArticles] = useState<ItemWithName[]>(currentArticleSelection);
    const [selectedVehicles, setSelectedVehicles] = useState<ItemWithName[]>(currentVehicleSelection);
    const [currentArticleOfReceiptRowEdit, setCurrentArticleOfReceiptRowEdit] = useState<ArticlesByReceiptRow>(props.articleOfReceiptRowEdit);

    const setField = (fieldName:string, fieldValue:string, conversion:(fieldValue:string)=>number) => {
        setCurrentArticleOfReceiptRowEdit({
            ...currentArticleOfReceiptRowEdit,
            [fieldName]: conversion(fieldValue)
        })
    }
    const setPrice = (unitPrice:number) => {
        const price = unitPrice * currentArticleOfReceiptRowEdit.quantity
        setCurrentArticleOfReceiptRowEdit({
            ...currentArticleOfReceiptRowEdit,
            price,
            unitPrice
        })
    }
    const setQuantity = (quantity:number) => {
        const price = currentArticleOfReceiptRowEdit.unitPrice * quantity
        setCurrentArticleOfReceiptRowEdit({
            ...currentArticleOfReceiptRowEdit,
            price,
            quantity
        })
    }

    const handleSave = () => {
        if(selectedArticles.length < 1){
            setCurrentArticleOfReceiptRowEdit({
                ...currentArticleOfReceiptRowEdit,
                invalidArticle: true
            })
            return
        }
        let weigthTypeName = ""
        let weightType:number | undefined
        if(currentArticleOfReceiptRowEdit.weight &&
            currentArticleOfReceiptRowEdit.weight > 0){
            const filteredWeigthTypes = props.weightTypes.filter(weightType => weightType.id == currentArticleOfReceiptRowEdit.weight_type?.toString())
            if(filteredWeigthTypes.length > 0){
                weigthTypeName = filteredWeigthTypes[0].name
                weightType = currentArticleOfReceiptRowEdit.weight_type!
            }
        }
        props.handleSave({
            ...currentArticleOfReceiptRowEdit,
            article_id: selectedArticles[0].id,
            articleName: selectedArticles[0].name,
            vehicle_id: selectedVehicles.length > 0? selectedVehicles[0].id: undefined,
            vehicleName: selectedVehicles.length > 0? selectedVehicles[0].name: undefined,
            weight_type: weightType,
            weightTypeName: weigthTypeName,
            invalidArticle: false
        }, props.rowIndex)
    }
    const handleBack = () => {
        props.handleCancel(props.rowIndex)
    }
    const checkArticle = (itemWithNames: ItemWithName[]) => {
        if(!itemWithNames || itemWithNames.length < 1){
            setCurrentArticleOfReceiptRowEdit({
                ...currentArticleOfReceiptRowEdit,
                invalidArticle: true
            })
            return
        }
        setCurrentArticleOfReceiptRowEdit({
            ...currentArticleOfReceiptRowEdit,
            invalidArticle: false
        })
        setSelectedArticles(itemWithNames)
    }
    const checkVehicle = (itemWithNames: ItemWithName[]) => {
        if(!itemWithNames || itemWithNames.length < 1){
            setCurrentArticleOfReceiptRowEdit({
                ...currentArticleOfReceiptRowEdit,
                invalidVehicle: true
            })
            return
        }
        setCurrentArticleOfReceiptRowEdit({
            ...currentArticleOfReceiptRowEdit,
            invalidVehicle: false
        })
        setSelectedVehicles(itemWithNames)
    }

    return (
        <tr>
            <td style={{ width: '250px' }}>
                <p><Form.Row>
                    <Form.Group controlId={`formGridArticle-${props.rowIndex}`}>
                        <InputGroup hasValidation>
                            <Typeahead<ItemWithName>
                                allowNew
                                id={`article-typeahead-${props.rowIndex}`}
                                labelKey="name"
                                onChange={checkArticle}
                                options={props.articles}
                                placeholder="Choose an article..."
                                selected={selectedArticles}
                                minLength={2}
                                clearButton
                                className={'articleName'}
                                isInvalid={currentArticleOfReceiptRowEdit.invalidArticle}>
                                {({ onClear, selected }: {onClear: ()=> {}, selected: ItemWithName[]}) => (
                                    <div className="rbt-aux">
                                        {!!selected.length && <ClearButton onClick={()=> {
                                            setSelectedArticles([])
                                            onClear()
                                        }} />}
                                    </div>
                                )}
                            </Typeahead>
                            <Form.Control.Feedback type="invalid">
                                Please choose an article from the selection
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Form.Row></p>
                <p><Form.Row>
                    <Form.Group controlId={`formGridVehicle-${props.rowIndex}`}>
                        <InputGroup hasValidation>
                            <Typeahead<ItemWithName>
                                allowNew
                                id={`vehicle-typeahead-${props.rowIndex}`}
                                labelKey="name"
                                onChange={checkVehicle}
                                options={props.vehicles}
                                placeholder="Choose an vehicle..."
                                selected={selectedVehicles}
                                minLength={2}
                                clearButton
                                className={'vehicleName'}
                                isInvalid={currentArticleOfReceiptRowEdit.invalidVehicle}>
                                {({ onClear, selected }: {onClear: ()=> {}, selected: ItemWithName[]}) => (
                                    <div className="rbt-aux">
                                        {!!selected.length && <ClearButton onClick={()=> {
                                            setSelectedVehicles([])
                                            onClear()
                                        }} />}
                                    </div>
                                )}
                            </Typeahead>
                            <Form.Control.Feedback type="invalid">
                                Please choose an vehicle from the selection
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Form.Row></p>
            </td>
            <td style={{ width: '190px' }}>
                <p><Form.Row>
                    <Form.Group controlId={`formGridWeight-${props.rowIndex}`}>
                        <InputGroup hasValidation>
                            <Form.Control
                                type='number'
                                onChange={ e => setField('weight', e.target.value, parseFloat) }
                                placeholder=""
                                value={currentArticleOfReceiptRowEdit.weight}
                                className={'smallInput'}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId={`formGridWeightType-${props.rowIndex}`}>
                        <InputGroup hasValidation>
                            <Form.Control
                                as='select'
                                onChange={ e => setField('weight_type', e.target.value, parseInt) }
                                value={currentArticleOfReceiptRowEdit.weight_type}
                                className={'smallInput'}
                            >
                                {props.weightTypes.map(weightType => {
                                    return (
                                        <option value={weightType.id}>{weightType.name}</option>
                                    )
                                })}
                            </Form.Control>
                        </InputGroup>
                    </Form.Group>
                </Form.Row></p>
                <p>
                    <Form.Row>
                        <Form.Group controlId={`formGridWeight-${props.rowIndex}`}>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type='number'
                                    onChange={ e => setField('distance', e.target.value, parseFloat) }
                                    placeholder=""
                                    value={currentArticleOfReceiptRowEdit.distance}
                                    className={''}
                                    style={{width:"100px"}}
                                />
                                <InputGroup.Text id="kmUnity">Km</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                </p>
            </td>
            <td style={{ width: '100px', verticalAlign:"top" }}>
                <Form.Row>
                    <Form.Group controlId={`formGridQuantity-${props.rowIndex}`}>
                        <InputGroup hasValidation>
                            <Form.Control
                                type='number'
                                onChange={ e => setQuantity(parseInt(e.target.value)) }
                                placeholder="0"
                                value={currentArticleOfReceiptRowEdit.quantity}
                            />
                            <InputGroup.Text id="quantityMultiply">X</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
            </td>
            <td style={{ width: '132px', verticalAlign:"top" }}>
                <Form.Row>
                    <Form.Group controlId={`formGridUnitPrice-${props.rowIndex}`}>
                        <InputGroup hasValidation>
                            <Form.Control
                                as={NumberFormat}
                                value={currentArticleOfReceiptRowEdit.unitPrice}
                                displayType={'input'}
                                suffix={' €'}
                                onValueChange={(values:any) => {
                                    const {value} = values;
                                    setPrice(parseFloat(value))
                                }}
                                isNumericString
                                allowNegative={false}
                                decimalSeparator={","}
                                thousandSeparator={"."}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                defaultValue={0}
                                className={'price'}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
            </td>
            <td style={{ width: '132px', textAlign: 'right', paddingRight: '12px', verticalAlign:"top" }}>
                <NumberFormat
                    value={currentArticleOfReceiptRowEdit.price}
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
            <td style={{verticalAlign:"top"}}>
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