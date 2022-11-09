import React from "react";
import {Outlet} from "react-router-dom";

import "./Views.css";

const Home = () => {

    return (
        <div>
            <Outlet/>
        </div>
    );
};

export default Home;