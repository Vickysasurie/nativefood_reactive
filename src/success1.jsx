import React, {Component} from 'react';
import {withAlert} from 'react-alert';

//import api from './api';
class Success1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
         
        }
        this.props.alert.show(JSON.parse(sessionStorage.getItem('user')).username," logged in successfully!!!",this.props.history.push("/"));
    }
    render(){
        return(
            <div>
                
            </div>
        )
    }
} 
 export default withAlert(Success1);