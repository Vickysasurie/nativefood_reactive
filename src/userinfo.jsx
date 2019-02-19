import React, { Component } from 'react'
import api from './api';
import './userinfo.css';
//import CryptoJS from 'crypto-js';
import {withAlert} from 'react-alert';

class userinfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
            user: JSON.parse(sessionStorage.getItem('user')),
            file: '',
            imagePreviewUrl: 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538303-user_512x512.png',
            userOrder:[],
        }
        this.log = this.logout.bind(this);
        //this.state.image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog";
        this.state.image = "https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png";
        //console.log("initial user info",this.state.user);
        this.change=this.change.bind(this);
        if(this.state.user){
            this.state.imagePreviewUrl=this.state.user.user_image;
            //console.log(this.state.imagePreviewUrl);
        }
        // Decrypt
        // var ciphertext=localStorage.getItem('user');
        // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
        // var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        // this.state.user=decryptedData;
        //console.log(this.state.user);
    }
    componentDidMount(){
        //console.log(localStorage.getItem('uname'));
        window.scrollTo(0,0);
        if(this.state.user){
            api.get('/ordersBy/'.concat(this.state.user.user_id)).then(response=>{
                console.log("User orders data: ",response.data);
                //this.state.userOrder=response.data;
                this.setState({userOrder:response.data});
                //console.log("User Orders in state: ",this.state.userOrder);
            }).catch(error=>{
                console.log(error);
            })
        }
        if(this.state.userOrder.invoice_number){
            console.log(this.state.userOrder);
        }
    }
    //logout
    logout() {
        sessionStorage.clear('user');
        alert("You logout successfully");
        this.props.alert.show("You logout successfully")
        window.location.reload(true);
        this.props.history.push('/');
    }
    // change user info
    change(){
        console.log("User profile after change",this.state.user);
        api.put('/users/'.concat(this.state.user.user_id),this.state.user);
        sessionStorage.clear('user');
        sessionStorage.setItem('user',JSON.stringify(this.state.user));
        window.location.reload(true);
        //alert("profile changed successfully");
        this.props.alert.show("profile changed successfully");
    }
 
    // change image
    changeImage(e){
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.onloadend = () => {
          this.setState({
            file: file,
            imagePreviewUrl: reader.result
            
          });
          
        }
        //console.log(this.state.imagePreviewUrl);
        //this.setState({imagePreviewUrl:imagePreviewUrl});
        reader.readAsDataURL(file)
    }
cancelOrder(uo) {
    console.log(uo);
    //var o_id = uo.order_id;
    var data={"order_id":[uo.order_id],"order_status":"cancelled"};
    api.put('/orderStatus',data).then(response=>{
        console.log(response.data);
        alert("Selected order cancelled successfully");
        window.location.reload(true);
    }).catch(error=>{
        console.log(error);
    })
}
    render() {
       if(this.state.user){
        return (
            <div style={{minHeight:"250px"}} className="container-fill">
            {JSON.parse(localStorage.getItem("invoice"))?(
                <a href="/hello" data-toggle="tooltip" title="Last purchased product invoice" className="btn btn-success">Invoice</a>
            ):[]
        
            }
               
                 <button className="btn btn-warning btn-md " onClick={() => this.logout()}  style={{ float:"right" }}>Logout</button>
                <br />
                 
                 {/*<div className="row">
                    <div className="col-sm-2">
                        <p>kjddswwwwgcgsdcugsdcsbcjkscsdugccbxcjscusgdcgcsdkjddswwwwgcgsdcugsdcsbcjkscsdugccbxcjscusgdcgcsd</p>
                    </div>
                 </div>   */}
                <div >
    <div className="row my-2">
        <div className="col-lg-8 order-lg-2">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a href="" data-target="#profile" data-toggle="tab" className="nav-link active ">Profile</a>
                </li>
                <li className="nav-item">
                    <a href="" data-target="#orders" data-toggle="tab" className="nav-link">Orders</a>
                </li>
                <li className="nav-item">
                    <a href="" data-target="#edit" data-toggle="tab" className="nav-link ">Edit-Info</a>
                </li>
              
                <li className="nav-item">
                    <a href="" data-target="#order_cancel" data-toggle="tab" className="nav-link ">Cancel Order</a>
                </li>
                
            </ul>
            <div className="tab-content" id="myTabContent">
                
                <div className="tab-pane show active" id="profile">
                    <h2 className="mb-3">User Profile</h2>
                    <div className="row">
                        <div style={{textAlign:"justify",paddingLeft:"10vw"}}>

                          <div >
                            <span style={{display:"inline",fontWeight:"bold",fontSize:"18px"}}>Address:</span>
                            <p style={{display:"inline",marginLeft:"2vw"}}>
                            {this.state.user.address}
                            </p>
                         </div>

                         <div >
                            <span style={{display:"inline",fontWeight:"bold",fontSize:"18px"}}>Mobile:</span>
                            <p style={{display:"inline", marginLeft:"3vw"}}>
                            {this.state.user.mobile_number}
                            </p>

                        </div>

                        <div >
                            <span style={{display:"inline",fontWeight:"bold",fontSize:"18px"}}>E-mail:</span>
                            <p style={{display:"inline", marginLeft:"3vw"}}>
                            {this.state.user.email}
                            </p>
                        </div>

                        </div>  
                    </div>
                </div>
                {/* profile ends */}
                {/* orders starts */}
                <div className="tab-pane" id="orders">
                    <div className="alert alert-info alert-dismissable">
                     <strong>Your Order History</strong> 
                    </div>
                    <table className="table" style={{border: "1px solid"}}>
                        <thead>
                            <tr>
                                <th > <a href="#" data-toggle="tooltip" title="user orders">S No </a> </th>
                                <th>Food Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                {/* <th>Invoice Number</th> */}
                                <th>Total Price</th>
                                <th>Order Status</th>
                                <th>Payment Method</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        {this.state.userOrder.map((uo,index1) =>
                        <tbody key={index1}>
                       
                       {uo.food_id.map( (uo1,index) => 
                            <tr key={index}>
                                {/* {()=> {if(index === 1){
                                    console.log("hai")
                                        return(
                                            <td rowSpan={uo.food_id.length}>
                                    {index1+1}
                                </td>
                                        )
                                }}}           */}
                                {index === 0?(
                                    <td rowSpan={uo.food_id.length}>{index1+1}</td>
                                ):[]}
                                
                                <td>
                                    {uo.food_name[index]}
                                </td>
                                <td>
                                    {uo.quantity[index]}
                                </td>
                                <td>
                                    {uo.price[index]}
                                </td>
                                {/* <td>
                                        {uo.invoice_number}
                                </td> */}
                                {index === 0?(
                                    <td rowSpan={uo.food_id.length}> {uo.total_price}</td>
                                ):[]}
                               
                               {index === 0?(
                                    <td rowSpan={uo.food_id.length} style={{verticalAlign:"center"}}> {uo.order_status}</td>
                                ):[]}
                                {index === 0?(
                                    <td rowSpan={uo.food_id.length}> {uo.payment_option}</td>
                                ):[]}
                               <td>
                                   {uo.createdAt}
                               </td>
                            </tr>
                            )}
                        </tbody> 
                        )}
                    </table>
                </div>
                {/* ordere ends */}
                {/* edit-info starts */}
                <div className="tab-pane" id="edit">
                    <form role="form" style={{textAlign:"justify"}}>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">User name</label>
                            <div className="col-lg-9">
                                <input type="text" className="form-control" value={this.state.user.username} onChange={event => this.setState({ user: Object.assign(this.state.user, { "username": event.target.value }) })} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">E-mail</label>
                            <div className="col-lg-9">
                                <input type="text" className="form-control" value={this.state.user.email} onChange={event => this.setState({ user: Object.assign(this.state.user, { "email": event.target.value }) })} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Mobile Number</label>
                            <div className="col-lg-9">
                            <input type="text" className="form-control" value={this.state.user.mobile_number} onChange={event => this.setState({ user: Object.assign(this.state.user, { "mobile_number": event.target.value }) })} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Address</label>
                            <div className="col-lg-9">
                                <input type="text" className="form-control" value={this.state.user.address} onChange={event => this.setState({ user: Object.assign(this.state.user, { "address": event.target.value }) })} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Security Question</label>
                            <div className="col-lg-9">
                                <input type="text" className="form-control" value={this.state.user.security_question} onChange={event => this.setState({ user: Object.assign(this.state.user, { "security_question": event.target.value }) })} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label">Security Answer</label>
                            <div className="col-lg-9">
                                <input type="text" className="form-control" value={this.state.user.security_answer} onChange={event => this.setState({ user: Object.assign(this.state.user, { "security_answer": event.target.value }) })} />
                            </div>
                        </div>
                      
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label form-control-label"></label>
                            <div className="col-lg-9">
                                <a type="reset" className="btn btn-secondary" value="Cancel" title="No changes?" href="/userinfo">Cancel</a>
                                <button className="btn btn-primary" onClick={()=>this.change()} title="Update changes?">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
                {/* update user ends */}
                {/* order cancel starts */}
                <div className="tab-pane " id="order_cancel">
                    <h2 className="mb-3">Cancel Order</h2>
                    <table className="table table-responsive-sm">
                        <thead>
                            <tr>
                                <th>S No</th>
                                <th>Food Name</th>
                                <th>Price</th>
                                
                                <th>Order Status</th>
                                <th>Provider Address</th>
                                <th>Provider Mobile Number</th>
                            </tr>
                        </thead>
                        
                        {this.state.userOrder.filter(f=> ((f.order_status != "delivered" )&& (f.order_status !="cancelled"))) .map((uo,index1)=>
                            <tbody key={index1}>
                                
                                {uo.food_id.map((uoc,index)=>
                                <tr onClick={()=> this.cancelOrder(uo)} href="">
                              
                                    {index === 0?(
                                        <td rowSpan={uo.food_id.length}>{index1+1}</td>
                                    ):[]}
                                      
                                    <td>
                                        {uo.food_name[index]}
                                    </td>
                                 
                                    {index === 0?(
                                        <td rowSpan={uo.food_id.length}> {uo.total_price}</td>
                                    ):[]}
                                  
                                    <td>
                                        {uo.order_status}
                                    </td>
                                   
                                        <td>{uo.provider_address[index]}</td>
                                   
                                    <td>
                                        {uo.provider_mobile_number[index]}
                                    </td>
                                </tr>
                                )}
                            </tbody> 
                            )}
                        
                    </table>  
                </div>
                {/* order cancel ends */}
            </div>
        </div>
        {/* change user image */}
        <div className="col order-lg-1 text-center">
        
            <img src={this.state.imagePreviewUrl} className="mx-auto img-fluid img-circle d-block" width="30%" height="30%" alt="avatar"/>
            <br/>
            <h1>Hello {this.state.user.username.charAt(0).toUpperCase() +this.state.user.username.slice(1)}</h1>
            {/* <h6 className="mt-2">Upload a different photo</h6> */}
            {/* <label className="custom-file">
                <input type="file" id="file" className="custom-file-input" onChange={(e)=>this.changeImage(e)}/>
                <span className="custom-file-control">Choose file</span>
            </label> */}
        </div>
    </div>
</div>
            </div>
        );
        } else{
            return(
                <div>
                    <h1>Oops.Login again to continue</h1>
                </div>
            )
        }   

    }
}
export default withAlert(userinfo);
