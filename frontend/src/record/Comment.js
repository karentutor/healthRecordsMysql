import React, { Component } from "react";
import { comment, uncomment } from "./apiRecord";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

class Comment extends Component {
    state = {
        text: "",
        error: ""
    };

    render() {
 
        return (<p>hi</p>
         );
    }
}

export default Comment;
