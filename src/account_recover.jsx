import React, {Component} from 'react';
import api from './api';
import { Route , withRouter} from 'react-router-dom';

class AccountRecover extends Component {

    constructor(props) {
        super(props);
        this.state= {
            security_answer:'',
            password_change:false,
            userUpdate:{"password":""},
            confirm_password:"",
        }
   
    }
    componentDidMount() {
        // this.state.userInfo=this.props;
        // this.setState({userInfo:this.state.userInfo});
        // console.log(this.state.userInfo.username);
    }
    submitAnswer() {
        console.log(this.state.security_answer);
        if(this.state.security_answer === this.props.userInfo.security_answer) {
            //alert("its match");
            this.state.password_change=true;
            this.setState({password_change:this.state.password_change});

        } else {
            alert("no match try again")
        }
    }
    updatePassword() {
        var user='';
        if( (this.state.userUpdate.password) === (this.state.confirm_password) ) {
            if(this.state.confirm_password.length>=5) {
                
                var id=this.props.userInfo.user_id;
                console.log(id)
                api.put('/users/updatepassword/'+id,this.state.userUpdate).then(response=>{
                    console.log(response.data);
                    alert("password updated");
                    user=response.data;
                    sessionStorage.setItem('user',JSON.stringify(user));
                    
                    window.location.reload(true);
                    this.props.history.push('/');
                    
                    
                }).catch(error=>{
                    console.log(error);
                })
            } else {
                alert("Password must contains atleast 5 letters");
            }
            
        } else {
            alert("password doesnt match")
        }
        
    }

    render() {
        let userInfo = this.props;
        //console.log(this.props.userInfo.username)
        return(
            <div>
                {this.state.password_change === false?(

               
                    <div>
                        <p>Hai, {this.props.userInfo.username}</p>
                        <label>Security question</label>
                        <p>{this.props.userInfo.security_question}</p>

                        <label>Your answer</label>
                        <input type="text" placeholder="Enter your answer" onChange={event=> this.setState({security_answer:event.target.value})} />
                        <button className="btn btn-info" onClick={()=> this.submitAnswer()}>Submit</button>
                    </div>
                
                ):(
                    <div>
                        <p>Hai, {this.props.userInfo.username}</p><br/><br/>
                        <label>Password</label>
                            <input type="password" placeholder="Password"  onChange={event => this.setState({ userUpdate: Object.assign(this.state.userUpdate, { "password": event.target.value }) })} required={true} autoComplete="off" />
                        <label>Confirm Password</label>
                            <input type="password" placeholder="Confirm your password" onChange={event=>this.setState({confirm_password:event.target.value})} />
                        <button className="btn btn-success" onClick={()=> this.updatePassword()}>Update Password</button>
                    </div>
                )}
            </div>
        )
    }
}
export default AccountRecover;