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
import Dashboard from "./views/Dashboard";
import Icons from "./views/Icons";
import TableList from "./views/Tables";
import * as React from "react";
import {RouteComponentProps} from "react-router";
import BookshelfView from "./views/BookshelfView";
import ReceiptView from "./views/ReceiptView";

export interface RouteProps{
    path: string,
    name: string,
    icon: string,
    layout: string,
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>,
}

const routes: RouteProps[] = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "nc-icon nc-bank",
        component: Dashboard,
        layout: "/admin",
    },
    {
        path: "/receipts",
        name: "Receipts",
        icon: "nc-icon nc-spaceship",
        component: ReceiptView,
        layout: "/admin",
    },
];
export default routes;
