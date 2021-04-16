import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiRecord";
import { Redirect } from "react-router-dom";

class NewRecord extends Component {
	constructor() {
		super();
		this.state = {
			title: "",
			body: "",
			photo: "",
			error: "",
			user: {},
			fileSize: 0,
			loading: false,
			redirectPatient: false,
		};
	}

	componentDidMount() {
		this.formData = new FormData();
		this.setState({ user: isAuthenticated().user });
	}

	isValid = () => {
		const { title, body, fileSize } = this.state;
		if (fileSize > 100000) {
			this.setState({
				error: "File size should be less than 100kb",
				loading: false,
			});
			return false;
		}
		if (title.length === 0 || body.length === 0) {
			this.setState({ error: "All fields are required", loading: false });
			return false;
		}
		return true;
	};

	handleChange = name => event => {
		this.setState({ error: "" });
		const value =
			name === "photo" ? event.target.files[0] : event.target.value;

		const fileSize = name === "photo" ? event.target.files[0].size : 0;
		this.formData.set(name, value);
		this.setState({ [name]: value, fileSize });
	};

	clickSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });

		const token = isAuthenticated().token;
		const patientId = this.props.patient_id;

		this.formData.set('karen', patientId);

		create(patientId, token, this.formData).then((data) => {
			if (data.error) this.setState({ error: data.error });
			else {
				this.setState({
					loading: false,
					title: "",
					body: "",
					redirectToPatient: true,
				});
			}
		});
	};

	newRecordForm = (title, body) => (
		<form>
			<div className="form-group">
				<label className="text-muted">Post Record Photo</label>
				<input
					onChange={this.handleChange("photo")}
					type="file"
					accept="image/*"
					className="form-control"
				/>
			</div>
			<div className="form-group">
				<label className="text-muted">Title</label>
				<input
					onChange={this.handleChange("title")}
					type="text"
					className="form-control"
					value={title}
				/>
			</div>

			<div className="form-group">
				<label className="text-muted">Body</label>
				<textarea
					onChange={this.handleChange("body")}
					type="text"
					className="form-control"
					value={body}
				/>
			</div>

			<button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
				Create Record
			</button>
		</form>
	);

	render() {
		const {
			title,
			body,
			photo,
			user,
			error,
			loading,
			redirectToRecord,
		} = this.state;

		if (redirectToRecord) {
			return <Redirect to={`/findrecords`} />;
		}

		return (
			<div className="container">
				<h2 className="mt-5 mb-5">Create a New Patient Record</h2>
				<div
					className="alert alert-danger"
					style={{ display: error ? "" : "none" }}
				>
					{error}
				</div>


				{loading ? (
					<div className="jumbotron text-center">
						<h2>Loading...</h2>
					</div>
				) : (
					""
				)}

				{this.newRecordForm(title, body)}
			</div>
		);
	}
}

export default NewRecord;
