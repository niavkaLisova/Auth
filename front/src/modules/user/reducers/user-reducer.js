import Immutable from 'immutable'
import _ from 'lodash';

let init = {
  name: '',
  nickname: '',
  email: '',
  online: [],
  activeRoom: '',
  admin: ''
}

function userReducer(state = init, action) {
  switch (action.type) {
    case 'USER_GET':
      return {
        ...state,
        name: action.data.name,
        online: action.data.online,
        nickname: action.data.nickname,
        email: action.data.email,
        activeRoom: action.data.activeRoom,
        admin: action.data.admin
      }
      break;
    case 'ONLINE_SAVE':
      return {
        ...state,
        online: state.online.concat(action.data)
      }
      break;
    case 'USER_DATA_UPDATED': 
      return actionUserDataUpdated(state, action); 
      break;
    case 'ACTIVE_SAVE':
      return {
        ...state,
        activeRoom: action.data    
      }
      break;
    default: return state;
  }
}

function actionUserDataUpdated(state, action) {
  var key = Object.keys(action.user);
  state[key] = action.user[key];

  return _.extend({}, state);
}

export default userReducer;
