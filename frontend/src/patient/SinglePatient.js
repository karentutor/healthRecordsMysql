import React, { Component } from "react";
import { singlePatient, remove } from "./apiPatient";
import DefaultPatient from "../images/mountains.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import NewRecord from '../record/NewRecord';
import Records from '../record/Records';

class SinglePatient extends Component {
	state = {
		patient: "",
		commentId: '',
		redirectToHome: false,
		redirectToSignin: false,
		test: null
	};


 handleCallback = (userId, role, token, recordId, body, title) =>{
	 console.log(userId, role, token, recordId, body, title);
    }
	componentDidMount = () => {
        const patientId = this.props.match.params.patientId;

		singlePatient(patientId).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({
				// 	comments: dataComments,
				patient: data
				});
			}
		});
	};



	deletePatient = () => {
		const patientId = this.props.match.params.patientId;
		const token = isAuthenticated().token;
		remove(patientId, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ redirectToHome: true });
			}
		});
	};

	deleteConfirmed = () => {
		let answer = window.confirm("Are you sure you want to delete your patient?");
		if (answer) {
			this.deletePatient();
		}
	};

	  updateComments = comments => {
        this.setState({ comments });
    };

	renderPatient = (patient) => {
		const posterId = patient.postedBy ? `/user/${patient.postedBy}` : "";

		const posterName = patient.postedBy ? patient.name : " Unknown";
		return (
			<div className="card-body">
				<img
					// src={`${process.env.REACT_APP_API_URL}/patient/photo/${patient._id}`}
					src={`${DefaultPatient}`}
					alt={patient.name}
					// onError={(i) => (i.target.src = `${Defaultpatient}`)}
					className="img-thunbnail mb-3"
					style={{
						height: "300px",
						width: "100%",
						objectFit: "cover",
					}}
				/>

				<p className="card-text">{patient.information}</p>
				<br />
				<p className="font-italic mark">
					Posted by <Link to={`${posterId}`}>{posterName} </Link>
					on {new Date(patient.created).toDateString()}
				</p>
				<div className="d-inline-block">
					<Link
						to={`/findpatients`}
						className="btn btn-raised btn-primary btn-sm mr-5"
					>
						Back to patients
					</Link>

					{isAuthenticated().user &&
						isAuthenticated().user._id == patient.postedBy && (
							<>
								<Link
									to={`/patient/edit/${patient.postedBy }`}
									className="btn btn-raised btn-warning btn-sm mr-5"
								>
									Update patient
								</Link>
								<button
									onClick={this.deleteConfirmed}
									className="btn btn-raised btn-danger"
								>
									Delete patient
								</button>
							</>
						)}

					<div>
						{isAuthenticated().user && isAuthenticated().user.role === "admin" && (
							<div class="card mt-5">
								<div className="card-body">
									<h5 className="card-title">Admin</h5>
									<p className="mb-2 text-danger">Edit/Delete as an Admin</p>
									<Link
										to={`/patient/edit/${patient._id}`}
										className="btn btn-raised btn-warning btn-sm mr-5"
									>
										Update patient
									</Link>
									<button
										onClick={this.deleteConfirmed}
										className="btn btn-raised btn-danger"
									>
										Delete patient
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	};



	render() {
		const { commentId, patient, redirectToHome, redirectToSignin } = this.state;

		if (redirectToHome) {
			return <Redirect to={`/`} />;
		} else if (redirectToSignin) {
			return <Redirect to={`/signin`} />;
		}

		return (
			<div className="container">
				<h2 className="display-2 mt-5 mb-5">{patient.name}</h2>

				{!patient ? (
					<div className="jumbotron text-center">
						<h2>Loading...</h2>
					</div>
				) : (
					this.renderPatient(patient)
				)}


				<NewRecord patient_id={patient.patient_id} parentCallback={this.handleCallback} />
				<Records />
			</div>
		);
	}
}

export default SinglePatient;
