import React, { Component } from "react";
import { list } from "./apiRecord";
import DefaultPatient from "../images/mountains.jpg";
import { Link } from "react-router-dom";

class Records extends Component {
	constructor() {
		super();
		this.state = {
			records: [],
		};
	}

	loadRecords = () => {
		list()
			.then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					this.setState({ records: data });
				}
			})
			.catch((err) => console.log(err));
	};

	componentDidMount() {
		this.loadRecords(this.state.page);
	}

	// loadMore = (number) => {
	// 	this.setState({ page: this.state.page + number });
	// 	this.loadRecords(this.state.page + number);
	// };

	// loadLess = (number) => {
	// 	this.setState({ page: this.state.page - number });
	// 	this.loadRecords(this.state.page - number);
	// };

	renderRecords = (records) => {
		return (
			<div className="row">
				<table class="table">
					<thead>
						<tr>
							<th scope="col">#id</th>
							<th scope="col">Title</th>
							<th scope="col">Body</th>
							<th scope="col">Edit</th>
							<th scope="col">Delete</th>
						</tr>
					</thead>
					<tbody>
						{records.map((record, i) => {
							const posterId = record.postedBy
								? `/user/${record.postedBy._id}`
								: "";
							const posterName = record.postedBy
								? record.postedBy.name
								: " Unknown";

							return (
								<>
									<tr>
										<th scope="row">{record._id}</th>
										<td>{record.title}</td>
										<td>{record.body}</td>
										<td>
											<Link
												to={`/record/${record._id}`}
												className="btn btn-raised btn-warning btn-sm mr-5"
											>
												View or Edit
											</Link>
										</td>
										<td>
											<Link
												to={`/record/${record._id}`}
												className="btn btn-raised btn-danger btn-sm mr-5"
											>
												Delete
											</Link>
										</td>
									</tr>
								</>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	};

	render() {
		const { records } = this.state;
		return (
			<div className="container">
				<h2 className="mt-5 mb-5">
					{!records.length ? "No more records!" : "Recent records"}
				</h2>

				{this.renderRecords(records)}
			</div>
		);
	}
}

export default Records;
