import React, { Component } from "react";
import { singleRecord, update } from "./apiRecord";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import DefaultPatients from "../images/mountains.jpg";

class EditRecord extends Component {
	constructor() {
		super();
		this.state = {
			id: "",
			recordId: "",
			message: "",
			title: "",
			body: "",
			redirectToRecords: false,
			error: "",
			fileSize: 0,
			loading: false,
		};
	}

	init = (recordId) => {
		singleRecord(recordId).then((data) => {
			if (data.error) {
				this.setState({ redirectToRecords: true });
            } else {
				this.setState({
					id: data.postedBy,
					title: data.title,
					body: data.body,
					recordId: recordId,
					error: "",
				});
			}
		});
	};

	componentDidMount() {
		this.recordData = new FormData();
		const recordId = this.props.match.params.recordId;
		this.init(recordId);
	}

	isValid = () => {
		const { title, body, fileSize } = this.state;
		if (fileSize > 1000000) {
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

	handleChange = (title) => (event) => {
		this.setState({ error: "" });
		const value = title === "photo" ? event.target.files[0] : event.target.value;

		const fileSize = title === "photo" ? event.target.files[0].size : 0;
		this.recordData.set(title, value);
		this.setState({ [title]: value, fileSize });
	};

	clickSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });

		if (this.isValid()) {
			const recordId = this.props.match.params.recordId;
			const token = isAuthenticated().token;

			update(recordId, token, this.recordData).then((data) => {
				if (data.error) this.setState({ error: data.error });
				else {
					console.log(data);
					this.setState({
                        loading: false,
                        message: 'Record updated',
						title: data.title,
						body: data.body,
						redirectTorecords: true,
					});
				}
			});
		}
	};

	editRecordForm = (title, body, recordId) => (
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
				<label className="text-muted">title</label>
				<input
					onChange={this.handleChange("title")}
					type="text"
					className="form-control"
					value={title}
				/>
			</div>

			<div className="form-group">
				<label className="text-muted">body</label>
				<textarea
					onChange={this.handleChange("body")}
					type="text"
					className="form-control"
					value={body}
				/>
			</div>

			<button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
				Update record
			</button>
		</form>
	);

	render() {
		const {
			id,
			title,
			body,
			message,
			recordId,
			redirectToRecords,
			error,
			loading,
		} = this.state;

		if (redirectToRecords) {
			return <Redirect to={`/findrecords`} />;
		}

		return (
			<div className="container">
				<h2 className="mt-5 mb-5">{title}</h2>

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
                    {message} <Link to="/findrecords"> Return to records</Link>.
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
					// }/patient/photo/${recordId}`}
					// onError={i => (i.target.src = `${DefaultPatients}`)}
					alt={title}
				/>

				{isAuthenticated().user.role === "admin" &&
					this.editRecordForm(title, body, recordId)}

				{isAuthenticated().user._id == id &&
					this.editRecordForm(title, body, recordId)}
			</div>
		);
	}
}

export default EditRecord;
