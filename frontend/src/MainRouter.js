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
import FindRecords from "./record/FindRecords";
import NewRecord from "./record/NewRecord";
import EditRecord from "./record/EditRecord";
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
            <PrivateRoute exact path="/record/create" component={NewRecord} />
            <Route exact path="/record/:recordId" component={SingleRecord} />
            <PrivateRoute
                exact
                path="/record/edit/:recordId"
                component={EditRecord}
            />
            <Route exact path="/users" component={Users} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signin" component={Signin} />
            <PrivateRoute
                exact
                path="/user/edit/:userId"
                component={EditProfile}
            />
            <PrivateRoute exact path="/findpeople" component={FindPeople} />
            <PrivateRoute exact path="/findrecords" component={FindRecords} />

            <PrivateRoute exact path="/user/:userId" component={Profile} />
        </Switch>
    </div>
);

export default MainRouter;