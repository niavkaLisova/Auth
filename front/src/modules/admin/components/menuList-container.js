import React from 'react'
import { Link } from 'react-router-dom'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'

import classNames from 'classnames'
import { connect } from 'react-redux'

@connect((store, ownProps) => {
  return {
    user: store.user
  };
})
class MenuListContainer extends React.Component {
  render() {
    return (
    	<List component="nav">
    		<Link to='/admin'>
		        <ListItem button>
		        	<ListItemIcon>
		            	<Icon>dashboard </Icon>
		          	</ListItemIcon>
		          	<ListItemText primary="Panel" />
		        </ListItem>
		    </Link>
		    {(this.props.user.email == 'admino')? (
    		<Link to='/admin/junior'>
		        <ListItem button>
		        	<ListItemIcon>
			            <Icon>accessibility</Icon>
			        </ListItemIcon>
		        	<ListItemText primary='Junior' />
		        </ListItem>
	        </Link>
	        ): ('')}
	        <Link to='/admin/manager'>
		        <ListItem button>
		        	<ListItemIcon>
		            	<Icon>build </Icon>
		          	</ListItemIcon>
		          	<ListItemText primary="Manager" />
		        </ListItem>
		    </Link>
	      </List>
	)
  }
}

export default MenuListContainer;