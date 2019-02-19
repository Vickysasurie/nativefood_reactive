import React, {Component} from 'react'
import logo2 from './images/logo2.png'
import api from './api';
import './navbar.css';
import { withAlert } from 'react-alert'
import SocialButton from './socialbutton'
//import CryptoJS from 'crypto-js';


class Navbar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
//  signin
            username: '',
            password: '',
            userData: [],
            loginFailed: true,
            type:"password",
            userInfo:false,
// signup
            userSignup: { "username": "", "email": "", "mobile_number": "", "address": "", "password": "", "security_question": "", "security_answer": "" },
            userConfirmPassword: '',
            userData: [],
            file: '',
            imagePreviewUrl: '',
            shopSearch:'',
            location:'',
            provider:[],
            invoice_number:0,
            user_number:0,
            order:[],
            order_status:'',
            display:"none",
            order_info:[],
            shop:"",
        }
        this.Login = this.Login.bind(this);
        this.signup = this.signup.bind(this);
        //this.setState({ loginFailed: true });
    }
    componentDidMount() {
        api.get('/users').then(response => {
            // console.log(response.data);
            this.setState({ userData: response.data });
            console.log("All user data: ",this.state.userData);

        })
            .catch(error => console.log(error));
            // Encrypt
            // var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
            // console.log(ciphertext);
            // // Decrypt
            // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
            // console.log(bytes)
            // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            
            // console.log(plaintext);
            //localStorage.clear();
            // var info = JSON.parse(localStorage.getItem('user'));
            // var bytes  = CryptoJS.AES.decrypt(info.toString(), 'secretu');
            // console.log(bytes)
            var plaintext = JSON.parse(sessionStorage.getItem('user'));
            
           // console.log(plaintext);
            if(plaintext){
                this.state.userInfo=true;
            } 

            
            // api.get('/provider').then(response=>{
            //     console.log(response.data);
             
            //     this.state.provider=response.data;
            // }).catch(error=>{
            //     console.log(error);
            // })

            api.get('/order').then(response=>{
                //console.log(response.data);
                //provider=response.data;
                //console.log(provider);
                this.state.order=response.data;
            }).catch(error=>{
                console.log(error);
            })
    }
    showpassword(){
       
       if(this.state.type === "password") {
           this.setState({type: "text"});
       } else {
        this.setState({type:"password"});
       }
    }
    // login function starts
    Login() {
    //    this.props.alert.show("hello");
        for (var i = 0; i < this.state.userData.length; i++) {
            if ((this.state.username === this.state.userData[i].username) && (this.state.password === this.state.userData[i].password)) {     
                alert("Welcome " + this.state.username);
                this.props.alert.show("Welcome " + this.state.username)
               //this.props.history.push('/');
                // this.setState({ loginFailed: false });
                this.state.loginFailed = false;
               // console.log(this.state.userData[i]);
                //alert("hello welcome")
                //var user = CryptoJS.AES.encrypt(JSON.stringify(this.state.userData[i]), 'secret key 123');
                //this.props.alert.show('Welcome!',this.state.username);
                sessionStorage.setItem('user',JSON.stringify(this.state.userData[i]));
                //console.log(JSON.parse(sessionStorage.getItem('user')));
                // const alert =  this.props.alert.show('Welcome!',this.state.username, {
                //     type: 'success',
                //     position: 'bottom center',
                //     onOpen: () => {window.location.reload(true);},
                //     onClose: () => {
                        
                //         this.props.history.push('/');
                //     }
                // })
                //this.props.history.push('/userpro');
                window.location.reload(true);
                //var ciphertext = CryptoJS.AES.encrypt(this.state.userData[i], 'secret key 123');
                //console.log(user);
                 //localStorage.setItem('user',JSON.stringify(this.state.userData[i]));
                //console.log(JSON.parse(localStorage.getItem('user')));
                //var username=CryptoJS.AEX.encrypt('this.state.username','secretu');
                //var userinfo = CryptoJS.AES.encrypt(JSON.stringify(this.state.userData[i]), 'secret key 123');
                
            } else {
                console.log("Hai " + this.state.username + " check your login credentials");
            }
        }
        if (this.state.loginFailed === true) {
            alert('U are not allow ');
        }
    }
 // signup function starts
 async signup() {
      console.log(this.state.userSignup.email);
            
            // for field data validation
            var allow=false;
    
          if((this.state.userSignup.username.length>=4) && (this.state.userSignup.email.length>=8) && (this.state.userSignup.mobile_number.length>=10) && (this.state.userSignup.address.length>=5) && (this.state.userSignup.password.length>=4) && (this.state.userSignup.security_question.length>=4) && (this.state.userSignup.security_answer.length>=4) ){
            allow=true;
        }else{
            allow=false;
        }
            
            if(allow === true) {
                    if (this.state.userSignup.password === this.state.userConfirmPassword) {
                 
                                //console.log(this.state.userData[i].email)
                                //console.log(this.state.userSignup.email)
                                alert("no email match you can proceed")
                            api.post('/users', this.state.userSignup).then(response => {
                                //console.log(response.data);
                                alert("Your details are updated successfully");
                                window.location.reload(true);
                            })
                                .catch(error => console.log(error));
                        
                      
                    }
                        else {
                            alert("Password mismatch");
                        } 
                    }
                    else {
                        alert("All your details have atleat 4-7 characters");
                    }
    }
    
 
    // shop search
    shopSearch(e) {
        this.setState({shop:e})
   //console.log("hello")
  // console.log(this.state.provider)
        // for(var j=0;j<this.state.provider.length;j++){
        //     console.log(e);
        //     //console.log(this.state.provider[j].provider_address)
        //      if( ((this.state.provider[j].provider_address).toLowerCase().includes(e.toLowerCase())) ) {
        //             this.setState({location:"yes exists"});
        //             this.state.location="yes exists";
        //             console.log(this.state.location);
        //     } else {
        //             this.setState({location:"not exists"});
        //             this.state.location="not exists";
        //         //    console.log(this.state.location);
        //     }
        // }
       // this.setState({location:"not exists"});
    }

    // track order status

    orderTrack() {

        var values = this.state.invoice_number.slice(0,12);
        var values3 = this.state.invoice_number.slice(12,14);
        console.log("order tracking");
        for(var i=0;i<this.state.order.length;i++) {

            if( ((this.state.order[i].user_mobile_number) === (parseInt(this.state.user_number))) && ((this.state.order[i].invoice_number) === (parseInt(values))) ){
      
                this.setState({order_status:this.state.order[i].order_status});
                this.state.order_info=this.state.order[i];
                
            } else{
                this.setState({order_status:""});
                this.state.order_info="";
                // alert("not exists");
                // this.setState({order_info:""});
            } 
        }

    }
    close() {
        this.setState({order_status:""});
        this.state.order_info="";
    }



    hover() {
        this.setState({display:"block"})
    }
  leave(){
    this.setState({display:"none"})
  }
    // closeModal(){
    //     this.props.history.push('/')
    // }
    logout() {
        sessionStorage.clear('user');
        //alert(" logout successfully");
       this.props.alert.show(" logout successfully")    
       // window.location.reload(true);
        this.props.history.push('/');
    }

    // search box
    // search() {
    //     alert("search works fine!!!")
    //     localStorage.setItem('searchEnables', "hi");
    // }
   
   
    render(){
        const handleSocialLogin = (user) => {
            console.log(user)
          }
           
          const handleSocialLoginFailure = (err) => {
            console.error(err)
          }
        return(
            <div>
          
                <div className="header-most-top" >
                    <p>Food Offer Zone Top Deals & Discounts</p>
                </div>
                <nav className="navbar navbar-expand-md navbar-light bg-light">
                    <div className="logo_agile" >
                        <h1 style={{paddingLeft:"8vw"}}>
                            <a href="/">
                                <span>N</span>ative
                                <span>F</span>ood
                                <img src={logo2} alt=" "/>
                            </a>
                        </h1>
                    </div>

                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                                    
                    <div className="collapse navbar-collapse" id="navbarSupportedContent" >
                   
				<ul className="navbar-nav mr-auto mt-2 mt-lg-0" style={{fontSize:"16px"}}>

                    <li className="nav-item active">
						<a className="nav-link" href="/"  className="nav-link" style={{color:"black"}}>
							<span className="fas fa-home"  aria-hidden="true" style={{color:" #ff8533"}}></span>Home</a>
					</li>
                    <li className="nav-item">        
						<a style={{color:"black"}} className="nav-link" className="nav-link" href="#" data-toggle="modal" data-target="#shop-locator"> 
                        <span style={{color:" #ff8533"}} className="fas fa-map-marker-alt"></span> Shop Locator</a>
					</li>
					<li  className="nav-item">
						<a style={{color:"black"}} className="nav-link" href="#" data-toggle="modal" data-target="#track-order">
							<span style={{color:" #ff8533"}} className="fa fa-truck"  aria-hidden="true"></span>Track Order</a>
					</li>
					<li  className="nav-item">
                        <a style={{color:"black"}} className="nav-link" href='/cart'>
						<span style={{color:" #ff8533"}} className="fas fa-cart-plus" aria-hidden="true"></span> Cart
                      
                        {JSON.parse(localStorage.getItem('cart'))?(
                            
                            <span className="badge badge-primary" style={{backgroundColor:"#b8b894",border:"1px solid"}}>{JSON.parse(localStorage.getItem('cart')).food_id.length}</span>
                        ):[]}
                        
                        </a>
					</li>
                    <li  className="nav-item">
                        <a style={{color:"black"}} className="nav-link" href="/search">
						<span style={{color:" #ff8533"}} className="fas fa-search" aria-hidden="true"></span> Search</a>
					</li>

                {this.state.userInfo === false?(
                    
                        <li  className="nav-item">
                            <a style={{color:"black"}} className="nav-link" href="#" data-toggle="modal" data-target="#myModal1">
                                <span style={{color:" #ff8533"}} className="fa fa-unlock-alt" aria-hidden="true"></span> Sign In </a>
                        </li>
                    
                ):(
                   
                    <li  className="nav-item">	                  
                        <a style={{color:"black"}} className="nav-link" href="/userpro" data-toggle="tooltip" title="Want new account? logout and signup with new one" >
                            <span style={{color:" #ff8533"}} className="far fa-user-circle" aria-hidden="true"></span> {JSON.parse(sessionStorage.getItem('user')).username}
                        </a>
                    </li>
                   
                )}
                {this.state.userInfo ===  false?(
                    <li  className="nav-item">
                        <a style={{color:"black"}} className="nav-link" href="#" data-toggle="modal" data-target="#myModal2" >
                        <span style={{color:" #ff8533"}} className="fas fa-user-plus" aria-hidden="true"></span> Sign Up </a>
                    </li>
                ):[]}	
                {this.state.userInfo === true? (
              
                       <li  className="nav-item">	
                             {JSON.parse(localStorage.getItem('offercart'))?(
                                <a style={{color:"black"}} className="nav-link" href="/offerCheckout">
                                    <span style={{color:" #ff8533"}} className="far fa-check-circle" aria-hidden="true"></span> Checkout
                                </a>
                            ):(
                                <a style={{color:"black"}} className="nav-link" href="/checkout">
                                     <span style={{color:" #ff8533"}} className="far fa-check-circle" aria-hidden="true"></span> Checkout
                                </a>
                            )}                  
                        </li>
                ):[]}
                {this.state.userInfo?(
                        <li  className="nav-item">	                  
                        <a style={{color:"black"}} className="nav-link" href="" onClick={()=>this.logout()}>
                            <span style={{color:" #ff8533"}} className="fas fa-sign-out-alt" aria-hidden="true"></span> Logout
                        </a>
                    </li>
                    ):[]}		
				</ul>
		</div>
    </nav>
    {/* <button
        onClick={() => {
          this.props.alert.show('Oh look, an alert!')
        }}
      >
        Show Alert
      </button> */}
        {/* signup */}
                        <div className="modal fade" id="myModal2" tabIndex="-1" role="dialog">
                            <div className="modal-dialog">
                                
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div className="modal-body modal-body-sub_agile">
                                        <div className="main-mailposi">
                                            <span className="fa fa-envelope-o" aria-hidden="true"></span>
                                        </div>
                                        <div className="modal_body_left modal_body_left1">
                                            <h3 className="agileinfo_sign">Sign Up</h3>

                                            <div>
                                                <div className="styled-input agile-styled-input-top">
                                                    <input type="text" placeholder="Username" name="Name" onChange={event => this.setState({ userSignup: Object.assign(this.state.userSignup, { "username": event.target.value }) })} required={true} autoComplete="off" />
                                                </div>
                                                <div className="styled-input">
                                                    <input type="email" placeholder="E-mail" name="Email" onChange={event => this.setState({ userSignup: Object.assign(this.state.userSignup, { "email": event.target.value }) })} required={true} autoComplete="off" />
                                                </div>
                                                <div className="styled-input">
                                                    <input type="text" placeholder="Mobile number" name="Name" id="username" onChange={event => this.setState({ userSignup: Object.assign(this.state.userSignup, { "mobile_number": event.target.value }) })}  required={true} autoComplete="off" />
                                                </div>
                                                <div className="styled-input">
                                                    <input type="text" placeholder="Address" name="address"  onChange={event => this.setState({ userSignup: Object.assign(this.state.userSignup, { "address": event.target.value }) })}  required={true} autoComplete="off" />
                                                </div>
                                                <div className="styled-input">
                                                    <input type="password" placeholder="Password" name="Email" onChange={event => this.setState({ userSignup: Object.assign(this.state.userSignup, { "password": event.target.value }) })} required={true} autoComplete="off" />
                                                </div>
                                                <div className="styled-input">
                                                    <input type="password" placeholder="Confirm Password" name="number"  onChange={event => this.setState({userConfirmPassword:event.target.value })}  required={true} autoComplete="off" />
                                                </div>
                                                <div className="styled-input">
                                                    <input type="text" placeholder="Security Question" name="address"  onChange={event => this.setState({ userSignup: Object.assign(this.state.userSignup, { "security_question": event.target.value }) })}  required={true} autoComplete="off" />
                                                </div>
                                                <div className="styled-input">
                                                    <input type="text" placeholder="Security Answer" name="address"  onChange={event => this.setState({ userSignup: Object.assign(this.state.userSignup, { "security_answer": event.target.value }) })}  required={true} autoComplete="off" />
                                                </div>
                                                {/* <input type="submit" value="Sign Up"/> */}
                                                <button className="btn btn-outline-success" onClick={() => this.signup()}>SIGN UP</button>
                                            </div>
                                            <p>
                                                {/* <a href="#">By clicking register, I agree to your terms</a> */}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            
                            </div>
                        </div>
                        
                {/* signin */}
                            <div className="modal fade" id="myModal1" tabIndex="-1" role="dialog">
                                <div className="modal-dialog">
                                
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" >&times;</button>
                                        </div>
                                        <div className="modal-body modal-body-sub_agile">
                                            <div className="main-mailposi">
                                                <span className="fa fa-envelope-o" aria-hidden="true"></span>
                                            </div>
                                            <div className="modal_body_left modal_body_left1">
                                                <h3 className="agileinfo_sign">Sign In </h3>
                                                <p>
                                                    Sign In now, Let's start your Food Ordering. Don't have an account?
                                                    {/* <a href="#" data-toggle="modal" data-target="#myModal2"> */}
                                                       <strong> Sign Up Now</strong>
                                                        {/* </a> */}
                                                </p>
                                             
                                                <div >
                                                    <div className="styled-input agile-styled-input-top">
                                                        <input type="text" placeholder="User Name" name="Name" required={true}  onChange={event => this.setState({ username: event.target.value })} autoComplete="off" />
                                                    </div>
                                                    <div className="styled-input">
                                                        <input style={{display:"inline"}} type={this.state.type} placeholder="Password" name="password" required={true} onChange={event => this.setState({ password: event.target.value })} autoComplete="off" />
                                                        
                                                        <span  className="btn-show-pass">
                                                            {this.state.type === "password"?(
                                                                <i href="#" className="fa fa-eye" onClick={() =>this.showpassword()}></i>
                                                                ):(
                                                                <i href="#" className="fa fa-eye-slash" onClick={() =>this.showpassword()}></i>
                                                                )}
                                                        </span>
                                                    </div>
                                                    {/* <input type="submit" value="Sign In"/> */}
                                                    <button className="btn btn-outline-info" onClick={() => this.Login()}>SIGN IN</button><br/>
                                                    <a href="/forgot_password">Forgot Password?</a>
                                                </div>
                                                {/* <SocialButton
                                                    provider='facebook'
                                                    appId='332638414187943'
                                                    onLoginSuccess={handleSocialLogin}
                                                    onLoginFailure={handleSocialLoginFailure}
                                                    >
                                                    Login with Facebook
                                                </SocialButton> */}
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                            
                                </div>
                            </div>

                        {/* shop locator */}
                        <div className="modal fade" id="shop-locator" tabIndex="-1" role="dialog">
                                <div className="modal-dialog">
                                
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                                        </div>
                                        <div className="modal-body modal-body-sub_agile">
                                            <div className="main-mailposi">
                                                <span className="fa fa-envelope-o" aria-hidden="true"></span>
                                            </div>
                                            <div className="modal_body_left modal_body_left1">
                                                <h3 className="agileinfo_sign">Shop Locator</h3>
                                                {/* <a href="http://www.google.com/maps/place/77.364806,11.2595803">check</a> */}
                                                <div>
                                                    <input type="text" placeholder="Enter area" onChange={event=> this.shopSearch(event.target.value)} />
                                                    {/* <button className="btn btn-primary" onClick={()=> this.shopSearch()}>Search Area</button> */}
                                                    {this.state.provider.filter(f => Object.values(f).toString().toLowerCase().replace(/\s/g, '').split(",").join("").includes(this.state.shop.toLowerCase().replace(/\s/g, ''))).map(o =>
                                                        <div>
                                                            {this.state.shop.length>0?(
                                                                    <p style={{display:"inline"}}>{o.provider_address}</p>
                                                                ):[]
                                                            }
                                                        </div>
                                                        
                                                    )}
                                                </div>
                                                {/* <div>
                                                    {this.state.location?(
                                                        <div>
                                                            {this.state.location}
                                                        </div>
                                                    ):[]}
                                                </div> */}

                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                            
                                </div>
                            </div>

                                                    {/* track order */}
                               <div className="modal fade" id="track-order" tabIndex="-1" role="dialog" data-keyboard="false" data-backdrop="static">
                                <div className="modal-dialog">
                                
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" onClick={()=>this.close()}>&times;</button>
                                        </div>
                                        
                                        <div className="modal-body modal-body-sub_agile">
                                            
                                            <div className="main-mailposi">
                                                <span className="fa fa-envelope-o" aria-hidden="true"></span>
                                            </div>
                                            
                                            <div className="modal_body_left modal_body_left1">
                                                <h3 className="agileinfo_sign">Track Your Order</h3>
                                          
                                                <div>
                                                    <input type="text" placeholder="Invoice Number" onChange={e=> this.setState({invoice_number:e.target.value})} />
                                                    <input type="text" placeholder="Your mobile number" onChange={e=> this.setState({user_number:e.target.value})} />
                                                    <button className="btn btn-primary" onClick={()=> this.orderTrack()}>Track Order</button>
                                                </div>

                                                <div>
                                                    {this.state.order_status?(
                                                        <div>
                                                            <span style={{display:"inline"}}>Order Status: </span>
                                                            <p style={{display:"inline"}}>{this.state.order_info.order_status}</p><br/>
                                                            <span style={{display:"inline"}}>Total Price: </span>
                                                            <p style={{display:"inline"}}>Rs. {this.state.order_info.total_price}</p><br/>
                                                            <span style={{display:"inline"}}>Payment Option: </span>
                                                            <p style={{display:"inline"}}>{this.state.order_info.payment_option}</p>
                                                        </div>
                                                    ):[]}
                                                </div>

                                                <div className="clearfix"></div>

                                            </div>

                                            <div className="clearfix"></div>
                                            
                                    </div>
                            
                                </div>
                            </div>
				<div className="clearfix"></div>
			</div>
             </div>
        );
    }
}
export default withAlert(Navbar);