import React, { Component } from "react";
import { singlePatient, update } from "./apiPatient";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import DefaultPatients from "../images/mountains.jpg";

class EditPatient extends Component {
	constructor() {
		super();
		this.state = {
			id: "",
			patientId: "",
			message: "",
			name: "",
			information: "",
			redirectToPatients: false,
			error: "",
			fileSize: 0,
			loading: false,
		};
	}

	init = (patientId) => {
		singlePatient(patientId).then((data) => {
			if (data.error) {
				this.setState({ redirectToPatients: true });
			} else {
				this.setState({
					id: data.postedBy,
					name: data.name,
					information: data.information,
					patientId: patientId,
					error: "",
				});
			}
		});
	};

	componentDidMount() {
		this.patientData = new FormData();
		const patientId = this.props.match.params.patientId;
		this.init(patientId);
	}

	isValid = () => {
		const { name, information, fileSize } = this.state;
		if (fileSize > 1000000) {
			this.setState({
				error: "File size should be less than 100kb",
				loading: false,
			});
			return false;
		}
		if (name.length === 0 || information.length === 0) {
			this.setState({ error: "All fields are required", loading: false });
			return false;
		}
		return true;
	};

	handleChange = (name) => (event) => {
		this.setState({ error: "" });
		const value = name === "photo" ? event.target.files[0] : event.target.value;

		const fileSize = name === "photo" ? event.target.files[0].size : 0;
		this.patientData.set(name, value);
		this.setState({ [name]: value, fileSize });
	};

	clickSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });

		if (this.isValid()) {
			const patientId = this.props.match.params.patientId;
			const token = isAuthenticated().token;

			update(patientId, token, this.patientData).then((data) => {
				if (data.error) this.setState({ error: data.error });
				else {
					console.log(data);
					this.setState({
                        loading: false,
                        message: 'Record updated',
						name: data.name,
						information: data.information,
						redirectTopatients: true,
					});
				}
			});
		}
	};

	editPatientForm = (name, information, patientId) => (
		<form>
			<div className="form-group">
				<label className="text-muted">Post Photo</label>
				<input
					onChange={this.handleChange("photo")}
					type="file"
					accept="image/*"
					className="form-control"
				/>
			</div>
			<div className="form-group">
				<label className="text-muted">name</label>
				<input
					onChange={this.handleChange("name")}
					type="text"
					className="form-control"
					value={name}
				/>
			</div>

			<div className="form-group">
				<label className="text-muted">information</label>
				<textarea
					onChange={this.handleChange("information")}
					type="text"
					className="form-control"
					value={information}
				/>
			</div>

			<button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
				Update patient
			</button>
		</form>
	);

	render() {
		const {
			id,
			name,
			information,
			message,
			patientId,
			redirectToPatients,
			error,
			loading,
		} = this.state;

		if (redirectToPatients) {
			return <Redirect to={`/findpatients`} />;
		}

		return (
			<div className="container">
				<h2 className="mt-5 mb-5">{name}</h2>

				<div
					className="alert alert-danger"
					style={{ display: error ? "" : "none" }}
				>
					{error}
				</div>

				<div
					className="alert alert-success"
					style={{ display: message ? "" : "none" }}
				>
                    {message} <Link to="/findpatients"> Return to patients</Link>.
				</div>

				{loading ? (
					<div className="jumbotron text-center">
						<h2>Loading...</h2>
					</div>
				) : (
					""
				)}

				<img
					style={{ height: "200px", width: "auto" }}
					className="img-thumbnail"
					// src={`${DefaultPatients}`}
					src={`${DefaultPatients}`}
					// src={`${
					//     process.env.REACT_APP_API_URL
					// }/patient/photo/${patientId}`}
					// onError={i => (i.target.src = `${DefaultPatients}`)}
					alt={name}
				/>

				{isAuthenticated().user.role === "admin" &&
					this.editPatientForm(name, information, patientId)}

				{isAuthenticated().user._id == id &&
					this.editPatientForm(name, information, patientId)}
			</div>
		);
	}
}

export default EditPatient;
