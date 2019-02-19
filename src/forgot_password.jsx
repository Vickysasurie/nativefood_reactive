import React, {Component} from 'react';
import './invoice.css';
import {withAlert} from 'react-alert';
import api from './api';
import AccountRecover from './account_recover'


//import api from './api';
class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            userData:'',
            oneUserData:'',
        }
        
        //this.props.alert.show(" Food added successfully!!!",this.props.history.push("/offerCheckout"));
    }
    componentWillMount() {
        api.get('/users').then(response=>{
            this.setState({userData:response.data});
        }).catch(error=>{
            console.log(error);
        })
    }
    checkUser() {
        var count=0;
        for(var i=0;i<this.state.userData.length;i++) {
            // console.log(typeof(this.state.userData[i].email));
            // console.log(typeof(this.state.email))
            if(this.state.userData[i].email.includes( (this.state.email) ) ) {
                    count++;
                    this.state.oneUserData=this.state.userData[i]
                    this.setState({oneUserData:this.state.oneUserData});
                    // console.log(this.state.userData[i].email);
                    // console.log(this.state.email)
            } else {
                
            }
        }
        if(count>=1) {
            //alert("Your account exists");
            console.log(this.state.oneUserData);
        } else {
            alert("No account info")
        }
    }
    
  
    render() {
        return(
            <div>
            
                {this.state.oneUserData?(
                <AccountRecover {...this.props} userInfo={this.state.oneUserData}></AccountRecover>
                ):(
                    <div>
                        <label>E-mail:</label>
                        <input type="email" placeholder="Enter your registed email id" onChange={event=> this.setState({email:event.target.value})}/><br/><br/>
                        <button onClick={()=> this.checkUser()}>Check user</button>
                    </div>
                )}
            </div>
        )
    }
} 
 export default withAlert(ForgotPassword);