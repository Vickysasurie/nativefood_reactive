import React, {Component} from 'react';
import {withAlert} from 'react-alert';

//import api from './api';
class Success extends Component {
    constructor(props) {
        super(props);
        this.state = {
         
        }
        this.props.alert.show("Your order placed successfully!!!",this.props.history.push("/hello"));
    }
    render(){
        return(
            <div>
                
            </div>
        )
    }
} 
 export default withAlert(Success);