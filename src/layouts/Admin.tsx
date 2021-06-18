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
import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, RouteComponentProps, Switch, useLocation } from "react-router-dom";

import DemoNavbar from "../components/Navbars/DemoNavbar";
import Sidebar from "../components/Sidebar/Sidebar";

import routes from "../routes";

let ps:PerfectScrollbar;

function Dashboard(props: RouteComponentProps) {
    const [backgroundColor, setBackgroundColor] = React.useState("black");
    const [activeColor, setActiveColor] = React.useState("info");
    const mainPanel = React.useRef<HTMLDivElement>(null);
    const location = useLocation();
    React.useEffect(() => {
        if (navigator.platform.indexOf("Win") > -1) {
            // @ts-ignore
            ps = new PerfectScrollbar(mainPanel.current);
            document.body.classList.toggle("perfect-scrollbar-on");
        }
        return function cleanup() {
            if (navigator.platform.indexOf("Win") > -1) {
                ps.destroy();
                document.body.classList.toggle("perfect-scrollbar-on");
            }
        };
    });
    React.useEffect(() => {
        // @ts-ignore
        mainPanel.current.scrollTop = 0;
        // @ts-ignore
        document.scrollingElement.scrollTop = 0;
    }, [location]);
    return (
        <div className="wrapper">
            <Sidebar
                {...props}
                routes={routes}
                bgColor={backgroundColor}
                activeColor={activeColor}
            />
            <div className="main-panel" ref={mainPanel}>
                <DemoNavbar {...props} />
                <Switch>
                    {routes.map((prop, key) => {
                        return (
                            <Route
                                path={prop.layout + prop.path}
                                component={prop.component}
                                key={key}
                            />
                        );
                    })}
                </Switch>
            </div>
        </div>
    );
}

export default Dashboard;
