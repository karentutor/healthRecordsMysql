import React, { Component } from "react";
import { comment, uncomment } from "./apiRecord";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

class Comment extends Component {
    state = {
        comments: '',
        body: '',
        role: '',
        title: '',
		error: ""
	};

    
        handleChange = name => event => {
        this.setState({ error: "" });
        const value = event.target.value;
        this.setState({ [name]: value });
    };

    

	addComment = (e) => {
		e.preventDefault();

		if (!isAuthenticated()) {
			this.setState({ error: "Please signin to leave a comment" });
			return false;
		}


		const userId = isAuthenticated().user._id;
		const role = isAuthenticated().user.role;
		const token = isAuthenticated().token;
        const recordId = this.props.recordId;
        const { body, title } = this.state;

        comment(userId, token, recordId, body, userId, role, title).then((data) => {

		    if (data.error) {
		 		console.log(data.error);
            }
             this.setState({ body: '', title: ''  });
                        // dispatch fresh list of coments to parent (SinglePost)
            //this.props.updateComments(data);
		 });
	};
	render() {
		const { error } = this.state;

		return (
			<div>
				<h2 className="mt-5 mb-5">Add a Patient Record</h2>

				<form onSubmit={this.addComment}>
					<div className="form-group">
						<input
							type="text"
							onChange={this.handleChange("title")}
							value={this.state.title}
							className="form-control"
							placeholder="Leave record title..."
						/><br />
						<input
							type="text"
							onChange={this.handleChange("body")}
							value={this.state.body}
							className="form-control"
							placeholder="Leave a comment..."
						/>

						<button className="btn btn-raised btn-success mt-2">Post</button>
					</div>
				</form>

				<div
					className="alert alert-danger"
					style={{ display: error ? "" : "none" }}
				>
					{error}
				</div>
                              </div>
				
		);
	}
}

export default Comment;
