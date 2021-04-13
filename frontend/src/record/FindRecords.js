import React, { Component } from "react";
import { list } from "./apiRecord";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";

class FindRecords extends Component {
    constructor() {
        super();
        this.state = {
            records: [],
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
                this.setState({ records: data });
            }
        });
    }


    renderRecords = records => {

        return (
            <div className="row">
                {records.map((record, i) => (
                    <div className="card col-md-4" key={i}>
                        <div className="card-body">
                            <h5 className="card-title">{record.title}</h5>
                            <p className="card-text">{record.body}</p>
                            <Link
                                to={`/record/${record._id}`}
                                className="btn btn-raised btn-primary btn-sm"
                            >
                                View Record
                        </Link>

                        </div>
                    </div>
                ))}
            </div>
        );
    }

    render() {
        const { records } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Find Record</h2>

                {this.renderRecords(records)}
            </div>
        );
    }

}

export default FindRecords;
