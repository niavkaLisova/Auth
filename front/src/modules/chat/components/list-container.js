import React from 'react'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Avatar from 'material-ui/Avatar'
import { List, ListItem } from 'material-ui/List'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Subheader from 'material-ui/Subheader'
import * as ChatActions from '../actions/chat-actions'
import ListroomsContainer from './listrooms-container'
import { socketConnect } from 'socket.io-react'
import { connect } from "react-redux"

@connect((store, ownProps) => {
    return {
      roomId: store.chat.roomId,
      findUser: store.chat.findUser,
      user: store.user.name,
      limit: store.chat.limit
    };
})
class ListContainer extends React.Component {
	constructor(props) {
    	super(props);

	    this.state = {
	    	receiver: '',
	    	visible: true,
	    	receiverObj: {}
	    };
	    this.props.dispatch(ChatActions.allChat());

		this.props.socket.on('room created', (data) => {
	    	this.props.dispatch(ChatActions.chatAddRoom(data));
	    })
	}


	onChangeReceiver(event) {
		let visible = (event.target.value.length > 0)? false: true;
	    this.setState({
	      receiver: event.target.value,
	      visible
	    });

	    if (event.target.value.length > 0) {
	    	this.props.dispatch(ChatActions.findUser(event.target.value));
	    } else {
	    	this.props.dispatch(ChatActions.chatFindUser([]));
	    }
	}

	newChat() {
		if(this.state.receiver) {
			let userAdd = this.state.receiverObj;

			if (!this.state.receiverObj._id) {
				this.props.findUser.map( (user) => {
					console.log(this.state.receiver == user.name)
					if (this.state.receiver == user.name) {
						userAdd = user;
					}
				});
			}

		    this.props.dispatch(ChatActions.chatFindUser([]));
			
			this.props.dispatch(ChatActions.newChat(userAdd, this.props.user, this));
			
			this.setState({
		      receiver: '',
		      receiverObj: {},
		      visible: true
		    });
		}
	}

	roomIdUpdated(id) {
		if(this.props.roomId != '') {
			this.props.socket.emit('leave room', this.props.roomId);
		}
		this.props.dispatch(ChatActions.beetwenUpdated(id));
		this.props.dispatch(ChatActions.getMessagesRoom(id, this.props.limit))
		this.props.socket.emit('join room', id);
		this.props.dispatch(ChatActions.limitStart());
		let style = window.getComputedStyle(window.document.getElementById('scroll'), null);
		let height = style.getPropertyValue("height");

		window.document.getElementById('scrollContainer').scrollTo(0, parseFloat(height))
	}

	findReceiver(user) {
		this.setState({
			receiver: user.name,
			receiverObj: user
		})
	}

	render() {
		return (
			<div>
				<List>
					<Subheader>Find user</Subheader>
					<TextField
							hintText="Receiver or receivers"
					     	name={'Receiver or receivers'}
				            value={this.state.receiver}
				            onChange={this.onChangeReceiver.bind(this)}
				            floatingLabelText="Receiver"
				    	/> 
			    	<FlatButton
				        label="add" 
				        primary={true} 
				        onClick={this.newChat.bind(this)} 
				      />
				
					{this.props.findUser.map( (user) => {
						return (
							<Card key={user._id}>
							    <CardHeader
							      title={user.name}
							      subtitle={user.email}
							      avatar=""
							      onClick={ () => this.findReceiver(user)}
							    />
							</Card>
							)
					})
					}
				</List>
				<ListroomsContainer visible={this.state.visible} />
			</div>
		)
	}
}

export default socketConnect(ListContainer);
