import React from 'react'
import { Route, IndexRoute, Switch } from 'react-router'
import LoginContainer from '../modules/login/components/login-container'
import ChatContainer from '../modules/chat/components/chat-container'
import UserContainer from '../modules/user/components/user-container'
import AdminPanelContainer from '../modules/admin/components/adminPanel-container'
import AdminJuniorContainer from '../modules/admin/components/adminJunior-container'
import ManagerContainer from '../modules/admin/components/manager-container'
import DashboardContainer from '../modules/dashboard/components/dashboard-container'
import AdminReportContainer from '../modules/admin/components/adminReport-container'
import Welcome from '../modules/register/components/welcome'
import Error from '../modules/register/components/error'
import Confirm from '../modules/login/components/confirm'
import RegisterContainer from '../modules/register/components/register-container'
import { RouteHandler } from 'react-router'
import requireAuth from './require-auth'

export default (
	<Switch>
		<Route exact path="/" component={Welcome} />
		<Route path="/register" component={RegisterContainer} />
		<Route path="/login" component={LoginContainer} />
		<Route path='/confirm/:email/:id' component={Confirm} />
		<Route path='/admin/junior' component={AdminJuniorContainer} />
		<Route path='/admin/manager' component={ManagerContainer} />
		<Route path='/admin/report' component={AdminReportContainer} />
		<Route path='/admin' component={AdminPanelContainer} />
		<Route path='/error/:time' component={Error} />
		<DashboardContainer>
   			<Route path='/user/:id?' component={UserContainer} />
     	   	<Route path='/chat/' component={ChatContainer} />
     	</DashboardContainer>
	</Switch>
);

//
// onEnter={requireAuth}