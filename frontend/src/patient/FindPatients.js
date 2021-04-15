import React, { Component } from "react";
import { list } from "./apiPatient";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";

class FindPatients extends Component {
    constructor() {
        super();
        this.state = {
            patients: [],
            error: "",
            open: false
        };
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        list().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ patients: data });
            }
        });
    }


    renderPatients = patients => {

        return (
            <div className="row">
                {patients.map((patient, i) => (
                    <div className="card col-md-4" key={i}>
                        <div className="card-body">
                            <h5 className="card-title">{patient.name}</h5>
                            <p className="card-text">{patient.information}</p>
                            <Link
                                to={`/patient/${patient._id}`}
                                className="btn btn-raised btn-primary btn-sm"
                            >
                                View Patient
                        </Link>

                        </div>
                    </div>
                ))}
            </div>
        );
    }

    render() {
        const { patients } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Find Patient</h2>

                {this.renderPatients(patients)}
            </div>
        );
    }

}

export default FindPatients;
