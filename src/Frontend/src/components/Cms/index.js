/* eslint-disable arrow-body-style */
import React from 'react';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import store from 'store';
import styles from './styles.css';

import {Route, Link, Switch, Redirect} from 'react-router-dom'; 

import isLoggedIn from '../../helpers/is_logged_in'; //ensure that the user is logged in.
import UserProfile from '../UserProfile';
import Upload from '../Upload';
import GetFiles from '../GetFiles';
import View from '../View'; 
import ShareFile from '../ShareFile';
import GetFolder from '../GetFolder'
import MoveFile from '../MoveFile'







const handleLogout = (history) => () => {
  store.remove('loggedIn');
  history.push('/welcome'); 
  console.log('you have been logged out. boo!');
};

const Cms = ({history}) => {
  if (!isLoggedIn()){
         return <Redirect to = "/login"/>
    }
  return (
    <div>
      <Helmet>
        <title>CMS</title>
      </Helmet>
      
        <Sidebar as={Menu} ui visible inverted left vertical sidebar menu>
        <Link to="/userprofile"> 
          <Menu.Item name="profile">
            <Icon name="user" />
            Users
          </Menu.Item>
        </Link>
    
        <Link to="/docs/folder"> 
          <Menu.Item name="Documents">
            <Icon name="folder open" />
            Folders
          </Menu.Item>
        </Link>

        <Link to="/docs/files"> 
          <Menu.Item name="Documents">
            <Icon name="file alternate" />
            Files
          </Menu.Item>
        </Link>

        <Link to="/docs/upload"> 
          <Menu.Item name="Upload">
            <Icon name="upload" />
            Upload File
          </Menu.Item>
        </Link>
        
        <Menu.Item name="logout" onClick={handleLogout(history)}>
          <Icon name="power" />
          Logout
        </Menu.Item>
      </Sidebar>
      <div className={styles.mainBody}>

        <Switch>
        <Route path="/docs/folder" component={GetFolder}/>
        <Route path="/docs/files/:id" component={MoveFile}/>
        <Route path="/docs/files/:id/share" component={ShareFile}/>
        <Route path="/docs/files" component={GetFiles}/>
        <Route path="/docs/upload" component={Upload}/>
        <Route exact path="/userprofile" component={UserProfile}/>
        </Switch>
        
      </div>
    </div>
  );
};

export default Cms;
