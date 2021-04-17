import React, { Component } from "react";
import { singleRecord, remove } from "./apiRecord";
import DefaultPatient from "../images/mountains.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";

class SingleRecord extends Component {
	state = {
		record: "",
		redirectToHome: false,
		redirectToSignin: false,
		test: null,
	};

    componentDidMount = () => {
        
        const recordId = this.props.match.params.recordId;

        singleRecord(recordId).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({
					record: data,
				});
			}
		});
	};

	// deleteRecord = () => {
	// 	const recordId = this.props.match.params.recordId;
	// 	const token = isAuthenticated().token;
	// 	remove(recordId, token).then((data) => {
	// 		if (data.error) {
	// 			console.log(data.error);
	// 		} else {
	// 			this.setState({ redirectToHome: true });
	// 		}
	// 	});
	// };

	// deleteConfirmed = () => {
	// 	let answer = window.confirm("Are you sure you want to delete your record?");
	// 	if (answer) {
	// 		this.deleteRecord();
	// 	}
	// };

	// updateComments = (comments) => {
	// 	this.setState({ comments });
	// };

	renderRecord = (record) => {
		const posterId = record.postedBy ? `/user/${record.postedBy}` : "";

		const posterName = record.postedBy ? record.name : " Unknown";
		return (
			<div className="card-body">
				<img
					// src={`${process.env.REACT_APP_API_URL}/patient/photo/${patient._id}`}
					src={`${DefaultPatient}`}
					alt={record.name}
					// onError={(i) => (i.target.src = `${Defaultpatient}`)}
					className="img-thunbnail mb-3"
					style={{
						height: "300px",
						width: "100%",
						objectFit: "cover",
					}}
				/>

				<p className="card-text">{record.information}</p>
				<br />
				<p className="font-italic mark">
					Posted by <Link to={`${posterId}`}>{posterName} </Link>
					on {new Date(record.created).toDateString()}
				</p>
				<div className="d-inline-block">
					<Link
						to={`/findrecords`}
						className="btn btn-raised btn-primary btn-sm mr-5"
					>
						Back to records
					</Link>

					{isAuthenticated().user &&
						isAuthenticated().user._id == record.postedBy && (
							<>
								<Link
									to={`/record/edit/${record.postedBy}`}
									className="btn btn-raised btn-warning btn-sm mr-5"
								>
									Update record
								</Link>
								<button
									onClick={this.deleteConfirmed}
									className="btn btn-raised btn-danger"
								>
									Delete record
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
										to={`/record/edit/${record._id}`}
										className="btn btn-raised btn-warning btn-sm mr-5"
									>
										Update record
									</Link>
									<button
										onClick={this.deleteConfirmed}
										className="btn btn-raised btn-danger"
									>
										Delete record
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
		// const { commentId, record, redirectToHome, redirectToSignin } = this.state;

		// if (redirectToHome) {
		// 	return <Redirect to={`/`} />;
		// } else if (redirectToSignin) {
		// 	return <Redirect to={`/signin`} />;
		// }

        return (
            
			// <div className="container">
			// 	<h2 className="display-2 mt-5 mb-5">{record.name}</h2>

			// 	{!record ? (
			// 		<div className="jumbotron text-center">
			// 			<h2>Loading...</h2>
			// 		</div>
			// 	) : (
			// 		//this.renderRecord(record)
            //             <p>hi</p>
			// 	)}
			// </div>
            <p>hi</p>
		);
	}
}

export default SingleRecord;
