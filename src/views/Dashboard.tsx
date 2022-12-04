/*!

=========================================================
* Paper Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {useEffect, useState} from "react";
// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col,
} from "reactstrap";
import axios, { AxiosResponse } from "axios";
import NumberFormat from "react-number-format";

interface Statistics{
    totalPrices: number
    avgPrices: number
    countReceipts: number
    avgCountArticles: number
}

function Dashboard() {
    const [statistics, setStatistics] = useState({} as Statistics)

    useEffect(() => {
        fetchList()
    }, [])

    const fetchList = async () => {
        const response: AxiosResponse<Statistics> = await axios.get('http://localhost:4001/api/v1/statistics')
        console.log(`fetchedStatistics ${JSON.stringify(response.data)}`)
        setStatistics(response.data)
    }

    return (
        <>
            <div className="content">
                <Row>
                    <Col lg="3" md="6" sm="6">
                        <Card className="card-stats">
                            <CardBody>
                                <Row>
                                    <Col md="4" xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <i className="nc-icon nc-globe text-warning" />
                                        </div>
                                    </Col>
                                    <Col md="8" xs="7">
                                        <div className="numbers">
                                            <p className="card-category">Receipts created</p>
                                            <CardTitle tag="p">{statistics.countReceipts}</CardTitle>
                                            <p />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <div className="stats">
                                    <i className="fas fa-sync-alt" /> Updated Now
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" sm="6">
                        <Card className="card-stats">
                            <CardBody>
                                <Row>
                                    <Col md="4" xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <i className="nc-icon nc-money-coins text-success" />
                                        </div>
                                    </Col>
                                    <Col md="8" xs="7">
                                        <div className="numbers">
                                            <p className="card-category">Total expenses</p>
                                            <CardTitle tag="p">
                                                <NumberFormat
                                                    value={statistics.totalPrices}
                                                    displayType={'text'}
                                                    isNumericString
                                                    allowNegative={false}
                                                    decimalSeparator={","}
                                                    thousandSeparator={"."}
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    suffix={' €'}
                                                />
                                            </CardTitle>
                                            <p />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <div className="stats">
                                    <i className="fas fa-sync-alt" /> Updated Now
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" sm="6">
                        <Card className="card-stats">
                            <CardBody>
                                <Row>
                                    <Col md="4" xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <i className="nc-icon nc-vector text-danger" />
                                        </div>
                                    </Col>
                                    <Col md="8" xs="7">
                                        <div className="numbers">
                                            <p className="card-category">Average price</p>
                                            <CardTitle tag="p">
                                                <NumberFormat
                                                    value={statistics.avgPrices}
                                                    displayType={'text'}
                                                    isNumericString
                                                    allowNegative={false}
                                                    decimalSeparator={","}
                                                    thousandSeparator={"."}
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    suffix={' €'}
                                                />
                                            </CardTitle>
                                            <p />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <div className="stats">
                                    <i className="fas fa-sync-alt" /> Updated Now
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" sm="6">
                        <Card className="card-stats">
                            <CardBody>
                                <Row>
                                    <Col md="4" xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <i className="nc-icon nc-favourite-28 text-primary" />
                                        </div>
                                    </Col>
                                    <Col md="8" xs="7">
                                        <div className="numbers">
                                            <p className="card-category">Average articles count</p>
                                            <CardTitle tag="p">{statistics.avgCountArticles}</CardTitle>
                                            <p />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <div className="stats">
                                    <i className="fas fa-sync-alt" /> Updated now
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Dashboard;
