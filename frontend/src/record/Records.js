import React, { Component } from "react";
import { list } from "./apiRecord";
import DefaultRecord from "../images/mountains.jpg";
import { Link } from "react-router-dom";

class Records extends Component {
	constructor() {
		super();
		this.state = {
			records: [],
			page: 1,
		};
	}

	loadRecords = (page) => {
		list(page).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ records: data });
			}
		});
	};

	componentDidMount() {
		this.loadRecords(this.state.page);
	}

	loadMore = (number) => {
		this.setState({ page: this.state.page + number });
		this.loadRecords(this.state.page + number);
	};

	loadLess = (number) => {
		this.setState({ page: this.state.page - number });
		this.loadRecords(this.state.page - number);
	};

	renderRecords = (records) => {
		return (
			<div className="row">
				{records.map((record, i) => {
					const posterId = record.postedBy
						? `/user/${record.postedBy._id}`
						: "";
					const posterName = record.postedBy
						? record.postedBy.name
						: " Unknown";

					return (
						<div className="card col-md-4" key={i}>
							<div className="card-body">
								<img
									src={`${process.env.REACT_APP_API_URL}/record/photo/${record._id}`}
									alt={record.title}
									onError={(i) => (i.target.src = `${DefaultRecord}`)}
									className="img-thunbnail mb-3"
									style={{ height: "200px", width: "100%" }}
								/>
								<h5 className="card-title">{record.title}</h5>
								<p className="card-text">{record.body.substring(0, 100)}</p>
								<br />
								<p className="font-italic mark">
									Posted by <Link to={`${posterId}`}>{posterName} </Link>
									on {new Date(record.created).toDateString()}
								</p>
								<Link
									to={`/record/${record._id}`}
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
		const { records, page } = this.state;
		return (
			<div className="container">
				<h2 className="mt-5 mb-5">
					{!records.length ? "No more records!" : "Recent records"}
				</h2>

				{this.renderRecords(records)}

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

				{records.length ? (
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

export default Records;
