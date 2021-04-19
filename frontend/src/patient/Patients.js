import React, { Component } from "react";
import { list } from "./apiPatient";
import DefaultPatient from "../images/mountains.jpg";
import { Link } from "react-router-dom";

class Patients extends Component {
	constructor() {
		super();
		this.state = {
			patients: [],
			page: 1,
		};
	}

	loadPatients = (page) => {
		list(page).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ patients: data });
			}
		});
	};

	componentDidMount() {
		this.loadPatients(this.state.page);
	}

	loadMore = (number) => {
		this.setState({ page: this.state.page + number });
		this.loadPatients(this.state.page + number);
	};

	loadLess = (number) => {
		this.setState({ page: this.state.page - number });
		this.loadPatients(this.state.page - number);
	};

	renderPatients = (patients) => {
		return (
			<div className="row">
				{patients.map((patient, i) => {
					const posterId = patient.postedBy
						? `/user/${patient.postedBy._id}`
						: "";
					const posterName = patient.postedBy
						? patient.postedBy.name
						: " Unknown";

					return (
						<div className="card col-md-4" key={i}>
							<div className="card-body">
								<img
									src={`${process.env.REACT_APP_API_URL}/patient/photo/${patient._id}`}
									alt={patient.title}
									onError={(i) => (i.target.src = `${DefaultPatient}`)}
									className="img-thunbnail mb-3"
									style={{ height: "200px", width: "100%" }}
								/>
								<h5 className="card-title">{patient.title}</h5>
								<p className="card-text">{patient.information.substring(0, 100)}</p>
								<br />
								<p className="font-italic mark">
									Posted by <Link to={`${posterId}`}>{posterName} </Link>
									on {new Date(patient.created).toDateString()}
								</p>
								<Link
									to={`/patient/${patient._id}`}
									className="btn btn-raised btn-primary btn-sm"
								>
									Read more
								</Link>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	render() {
		const { patients, page } = this.state;
		return (
			<div className="container">
				<h2 className="mt-5 mb-5">
					{!patients.length ? "No more patients!" : "Recent patients"}
				</h2>

				{this.renderPatients(patients)}

				{page > 1 ? (
					<button
						className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
						onClick={() => this.loadLess(1)}
					>
						Previous ({this.state.page - 1})
					</button>
				) : (
					""
				)}

				{patients.length ? (
					<button
						className="btn btn-raised btn-success mt-5 mb-5"
						onClick={() => this.loadMore(1)}
					>
						Next ({page + 1})
					</button>
				) : (
					""
				)}
			</div>
		);
	}
}

export default Patients;
