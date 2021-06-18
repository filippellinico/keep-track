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
import {NavLink, RouteComponentProps} from "react-router-dom";
import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import logo from "../../logo.svg";
import {RouteProps} from "../../routes";

interface SidebarProps extends RouteComponentProps{
    routes: RouteProps[],
    bgColor: string,
    activeColor: string
}

let ps:PerfectScrollbar;

function Sidebar(props: SidebarProps) {
    const sidebar = React.useRef<HTMLDivElement>(null);
    // verifies if routeName is the one active (in browser input)
    const activeRoute = (routeName:string) => {
        return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    };
    React.useEffect(() => {
        if (navigator.platform.indexOf("Win") > -1) {
            // @ts-ignore
            ps = new PerfectScrollbar(sidebar.current, {
                suppressScrollX: true,
                suppressScrollY: false,
            });
        }
        return function cleanup() {
            if (navigator.platform.indexOf("Win") > -1) {
                ps.destroy();
            }
        };
    });
    return (
        <div
            className="sidebar"
            data-color={props.bgColor}
            data-active-color={props.activeColor}
        >
            <div className="logo">
                <a
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="simple-text logo-mini"
                >
                    <div className="logo-img">
                        <img src={logo} alt="react-logo" />
                    </div>
                </a>
                <a
                    className="simple-text logo-normal"
                >
                    KEEP TRACK
                </a>
            </div>
            <div className="sidebar-wrapper" ref={sidebar}>
                <Nav>
                    {props.routes.map((prop, key) => {
                        return (
                            <li
                                className={
                                    activeRoute(prop.path)
                                }
                                key={key}
                            >
                                <NavLink
                                    to={prop.layout + prop.path}
                                    className="nav-link"
                                    activeClassName="active"
                                >
                                    <i className={prop.icon} />
                                    <p>{prop.name}</p>
                                </NavLink>
                            </li>
                        );
                    })}
                </Nav>
            </div>
        </div>
    );
}

export default Sidebar;
