import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import FindPeople from "./user/FindPeople";
import FindPatients from "./patient/FindPatients";
import NewPatient from "./patient/NewPatient";
import EditPatient from "./patient/EditPatient";
import SinglePatient from "./patient/SinglePatient";
import SingleRecord from "./record/SingleRecord";
import PrivateRoute from "./auth/PrivateRoute";
import ResetPassword from "./user/ResetPassword";
import Admin from "./admin/Admin";

const MainRouter = () => (
	<div>
		<Menu />
		<Switch>
			<Route exact path="/" component={Home} />
			<PrivateRoute exact path="/admin" component={Admin} />
			<Route
				exact
				path="/reset-password/:resetPasswordToken"
				component={ResetPassword}
			/>
			<PrivateRoute exact path="/patient/create" component={NewPatient} />
			<Route exact path="/patient/:patientId" component={SinglePatient} />
			<PrivateRoute
				exact
				path="/patient/edit/:patientId"
				component={EditPatient}
			/>
			<Route exact path="/record/:recordId" component={SingleRecord} />

			<Route exact path="/users" component={Users} />
			<Route exact path="/signup" component={Signup} />
			<Route exact path="/signin" component={Signin} />
			<PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
			<PrivateRoute exact path="/findpeople" component={FindPeople} />
			<PrivateRoute exact path="/findpatients" component={FindPatients} />

			<PrivateRoute exact path="/user/:userId" component={Profile} />
		</Switch>
	</div>
);

export default MainRouter;
