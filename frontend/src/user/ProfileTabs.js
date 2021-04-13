import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

class ProfileTabs extends Component {
    render() {
        const { records } = this.props;
        return (
            <div>
                <div className="row">
                        <h3 className="text-primary">{records.length} Records</h3>
                        <hr />
                        {records.map((record, i) => (
                            <div key={i}>
                                <div>
                                    <Link to={`/record/${record._id}`}>
                                        <div>
                                            <p className="lead">{record.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
            </div>
        );
    }
}

export default ProfileTabs;
