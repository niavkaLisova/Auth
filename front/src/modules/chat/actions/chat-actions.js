import request from 'superagent';
import _ from 'lodash';
import * as Config from '../../../utils/config';
import * as NotificationActions from '../../notification/actions/notification-actions'

export function allChat() {
  return (dispatch) => {
      request
        .post(Config.API_DOMAIN + 'chat/room/all')
        .set('x-access-token', localStorage.getItem('token'))
        .send({'userId': localStorage.getItem('userId')})
        .end((error, response) => {
        	dispatch(chatUpdated(response.body));
        });
  }
}

export function newChat(user, myname, that) {
  return (dispatch) => {
      request
        .post(Config.API_DOMAIN + 'chat/room/new')
        .set('x-access-token', localStorage.getItem('token'))
        .send({
			    name: user.name + ' VS ' + myname,
          private: true,
 			    between: [user._id, localStorage.getItem('userId')]
			  })
        .end((error, response) => {
          that.props.socket.emit('user join room', response.body);
          dispatch(chatAddRoom(response.body));

        	if(response.body.success == false) {
        		return NotificationActions.show('Nie')(dispatch);
          } else {
            that.props.socket.emit('new room', response.body, user._id);
          	return NotificationActions.show('Room created')(dispatch);
          }
        });
  }
}

export function sendMessage(id, text, user, that) {
  return (dispatch) => {
      request
        .post(Config.API_DOMAIN + 'chat/message/new')
        .set('x-access-token', localStorage.getItem('token'))
        .send({
          'roomId': id,
          'text': text,
          'author': localStorage.getItem('userId'),
          'user': user
        })
        .end((error, response) => {
          that.props.socket.emit('message', {'roomId': id, 'msg': response.body})
          if(response.body.user == localStorage.getItem('userId')) {
            dispatch(messageAdd(response.body));

            that.props.between.map( (uid) => {
              if(uid != localStorage.getItem('userId')) {
                dispatch(socketMessage(uid, id, text, user, that));   
              }
            })
          }
        });
  }
}

export function socketMessage(uid, id, text, user, that) {
  return (dispatch) => {
      request
        .get(Config.API_DOMAIN + 'api/users/' + uid)
        .set('x-access-token', localStorage.getItem('token'))
        .end((error, response) => {
          const user = response.body;
          if(user.online.length && user.online.length > 0) {
            user.online.map( (id_online) => {
              that.props.socket.emit('message global', id_online, {
                'roomId': id,
                'text': text,
                'author': localStorage.getItem('userId'),
                'user': user
              } );
            })
          }
        });
  }
}

export function getMessages(roomId, limit) {
  return (dispatch) => {
      request
        .post(Config.API_DOMAIN + 'chat/message/all')
        .set('x-access-token', localStorage.getItem('token'))
        .send({
          'roomId': roomId,
          'user': localStorage.getItem('userId'),
          'limit': limit 
        })
        .end((error, response) => {
          dispatch(messageUpdated(response.body));
        });
  }
}

export function getMessagesRoom(roomId, limit) {
  return (dispatch) => {
      request
        .post(Config.API_DOMAIN + 'chat/message/room')
        .set('x-access-token', localStorage.getItem('token'))
        .send({
          'roomId': roomId,
          'user': localStorage.getItem('userId'),
          'limit': limit 
        })
        .end((error, response) => {
          dispatch(messageUpdated(response.body.message));
        });
  }
}

export function beetwenUpdated(roomId) {
  return (dispatch) => {
      request
        .get(Config.API_DOMAIN + 'chat/room/' + roomId)
        .set('x-access-token', localStorage.getItem('token'))
        .end((error, response) => {
          dispatch(beetwenNameClean(1));
          response.body.between.map( (user) => {
            dispatch(beetwenNameUpdated(user));
          })

          dispatch(roomIdUpdated({roomId: roomId, between: response.body.between}));
        });
  }
}
export function beetwenNameUpdated(user) {
  return (dispatch) => {   
    request
      .get(Config.API_DOMAIN + 'api/users/' + user)
      .set('x-access-token', localStorage.getItem('token'))
      .end((error, response) => {
        dispatch(betweenName(response.body));
      })
  }
}

export function findUser(search) {
  return (dispatch) => {
      request
        .post(Config.API_DOMAIN + 'api/user/find')
        .set('x-access-token', localStorage.getItem('token'))
        .send({
          'id': localStorage.getItem('userId'),
          'search': search
        })
        .end((error, response) => {
          // console.log('find User', response.body)
          dispatch(chatFindUser(response.body));
        });
  }
}

export function chatUpdated(data) {
	return {type: 'CHAT_UPDATED', data};
}

export function roomIdUpdated(data) {
  return {type: 'ROOM_ID_SET', data};
}

export function messageUpdated(data) {
  return {type: 'MESSAGE_SET', data};
}

export function messageAdd(data) {
  return {type: 'MESSAGE_ADD', data};
}

export function betweenName(data) {
  return {type: 'BETWEEN_NAME', data};
}

export function beetwenNameClean() {
  return {type: 'BETWEEN_NAME_CLEAN'};
}

export function chatFindUser(data) {
  return {type: 'CHAT_FIND_USER', data};
}

export function chatAddRoom(data) {
  return {type: 'CHAT_ADD', data};
}

export function limitSet(data) {
  return {type: 'LIMIT_SET', data};
}
