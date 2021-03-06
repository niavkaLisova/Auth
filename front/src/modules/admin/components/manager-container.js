import React from 'react'
import { connect } from 'react-redux'
import { socketConnect } from 'socket.io-react'

import appHistory from '../../../utils/app-history'
import * as UserActions from '../../user/actions/user-actions'
import Admin from './admin-container'
import SelectContainer from './manager/select/select-container'
import BoxContainer from './manager/box/box-container'

import Paper from '@material-ui/core/Paper'
import { Container, Row, Col } from 'react-grid-system'

export default class ManagerContainer extends React.Component {
	render() {
		return (
		  	<Admin>
			    <div>
			      <Row>
			      	<Col md={8}>
			      		<SelectContainer />
			      	</Col>
			      	<Col md={4}>
			      		<BoxContainer />
			      	</Col>
			      </Row>
			    </div>
		    </Admin>
		)
	}
}