import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { remove } from "./apiUser";
import { signout } from "../auth";

class DeleteUser extends Component {
    state = {
        redirect: false
    };

    deleteAccount = () => {
        const token = isAuthenticated().token;
        const role = isAuthenticated().user.role;
        const userId = this.props.userId;
        remove(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                // signout user
                if (role === 'subscriber') {
                    signout(() => console.log("User is deleted"));
                    // redirect
                    this.setState({ redirect: true });
                }
                // better to not do this twice,create a new staet for this
                if (role === 'admin') {
                    this.setState({redirect: true})
                }
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm(
            "Are you sure you want to delete your account?"
        );
        if (answer) {
            this.deleteAccount();
        }
    };

    render() {

        if (this.state.redirect) {
            if (isAuthenticated().user.role === 'subscriber') return <Redirect to="/" />;
            else return <Redirect to="/findpeople" />;
        }
        return (
            <button
                onClick={this.deleteConfirmed}
                className="btn btn-raised btn-danger"
            >
                Delete Profile
            </button>
        );
    }
}

export default DeleteUser;
