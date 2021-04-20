import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiPatient";
    import { Redirect } from "react-router-dom";

class NewPatient extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            information: "",
            photo: "",
            error: "",
            user: {},
            fileSize: 0,
            loading: false,
            redirectPatient: false
        };
    }

    componentDidMount() {
        this.formData = new FormData();
        this.setState({ user: isAuthenticated().user });
    }

    isValid = () => {
        const { name, information, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            });
            return false;
        }
        if (name.length === 0 || information.length === 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "", loading: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.formData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;


            create(userId, token, this.formData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({
                        loading: false,
                        name: "",
                        information: "",
                        redirectToPatient: true
                    });
                }
            });
        }
    };

    newPatientForm = (name, information) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post Patient Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={this.handleChange("name")}
                    type="text"
                    className="form-control"
                    value={name}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Information</label>
                <textarea
                    onChange={this.handleChange("information")}
                    type="text"
                    className="form-control"
                    value={information}
                />
            </div>

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Create Patient
            </button>
        </form>
    );

    render() {
        const {
            name,
            information,
            photo,
            user,
            error,
            loading,
            redirectToPatient
        } = this.state;

        if (redirectToPatient) {
            return <Redirect to={`/findpatients`} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create a new patient</h2>
                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                {loading && !error ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    ""
                )}

                {this.newPatientForm(name, information)}
            </div>
        );
    }
}

export default NewPatient;
