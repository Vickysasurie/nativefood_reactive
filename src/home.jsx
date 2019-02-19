import React from 'react';
import './css/bootstrap.css'
import './css/style.css'
import './css/popuo-box.css'
import api from './api';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import {withAlert} from 'react-alert'


class Home extends React.Component{
    constructor(props){
		
		super(props);
		this.myRef = React.createRef()
        this.state = {
			visible:false,
			foodList:[],
			searchresults:[],
			id: 0,
            search: "",
            address: '',
            Items: [],
            Provi: [],
            lat: 0,
            lng: 0,
            distance: 0,
            disArray: [],
            radius: 1,
            searchToggle: false,
			popup:[],
			foodName:'',//for modal
			findFood:[],
			searchNew:'',
			offers:[],
			offercart:[],
			finalCart:{"food_id":"","food_name":"","food_image":"","price":"","available":"","quantity":"","provider_id":"","provider_name":"","provider_address":"","provider_mobile_number":"","order_status":"","user_id":"","email":"","user_mobile_number":"","total_price":"","gstin":"","tax":""},
			quantitySelected:0,
        }
    }
    componentDidMount(){
		//localStorage.clear('invoice');
        api.get('/items').then(response => {
            // console.log(response.data);
            this.setState({ foodList: response.data });
            console.log("Food list: ", this.state.foodList);
        })
            .catch(error => console.log(error));


        api.get('/provider').then(response => {
            
            console.log("Provider data: ",response.data)
            this.setState({ Provi: response.data })
		}).catch(err => { console.log(err) });
		
		api.get('/offers').then(response => {
            console.log("Offer data: ",response.data)
            this.setState({ offers: response.data })
		}).catch(err => { console.log(err) });
	}
	// location search starts
	showPosition(position) {
        // console.log(position.coords.latitude,position.coords.longitude);
        this.setState({ lat: position.coords.latitude, lng: position.coords.longitude });
        //console.log(this.state.lat, this.state.lng);

        //this.transform(this.state.Provi, this.state.radius);
        let a = this.transform(this.state.Provi, this.state.radius);
        console.log("Food id: ",this.state.Items);
        this.setState({ disArray: a });
        console.log("filterd provider by current location: ",this.state.disArray);
        // console.log("length of set: ",this.state.Items.size);
        //console.log(a)
	}
	
	getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => { this.showPosition(position) });
            
        } else {
            this.props.alert.show("Geolocation is not supported by this browser.");
        }
    }
    handleChange = address => {
        this.setState({ address });
        // if(this.state.address.length<=0) {
        //     this.setState({searchToggle:false});
        // }
    };

    handleSelect = address => {
    
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.state.lat = latLng.lat;
                this.state.lng = latLng.lng;
				this.setState({}); 
				console.log('Success', latLng);
                let a = this.transform(this.state.Provi, this.state.radius);
                //console.log(this.state.Items);
                this.setState({ disArray: a });
                //console.log(this.state.disArray);
                // console.log("length of set: ",this.state.Items.size);
                //console.log(a)
            })

            .catch(error => console.error('Error', error));
    };

    transform(Provi, distance) {
        this.setState({ searchToggle: true });
        var Items = [];
        var dist = [];
        if (!Provi) return [];
        if (!distance) return Provi;
        //searchTex = searchTex.toLowerCase();
        if (Provi.filter((it) => {
            var a = this.isShow(distance, this.state.lat, this.state.lng, it.lat, it.lon);
            //console.log(a);
            if (a[0] === true) {
                var b = Object.assign({}, it, { distance: a[1] });
                dist.push(b);
            }
            return a[0];
        })) {
            dist.map(a => console.log("Distance: ",a.distance));
            if (dist.sort((a, b) => {
                return (a.distance - b.distance)
            })) {
                //console.log("sorted")
                if (dist.map((a) => {
                    //console.log(a.distance);
                    Items.push.apply(Items, a.food_id);
                })) {
                    this.setState({
                        Items: new Set(Items)
                    });
                    //this.setState({ searchToggle: false });
                    
                }
                return dist;
            }
        }
    }

    isShow(distance, clat, clng, lat, lng) {
        //console.log("map Filter");
        console.log(distance + ' ' + clat + ' ' + clng + ' ' + lat + ' ' + lng);


        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat - clat);  // deg2rad below
        var dLon = this.deg2rad(lng - clng);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(clat)) * Math.cos(this.deg2rad(lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        //console.log(d);

        if (d < distance) {
            //console.log(true);
            return [true, d];

        }
        else {
            //console.log(false);
            return [false, d];
        }
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
// location search ends

// search box
search(e) {
	this.setState({ search: e.target.value });
}
// cart button
cart(product){
	if(JSON.parse(sessionStorage.getItem('user'))){
	console.log(product);
	//this.state.popup=product;
	this.setState({foodName:product.food_name});
	var b = [];
	//console.log(product.food_id);
	for (var i = 0; i < this.state.disArray.length; i++) {
		if ((this.state.disArray[i].food_id.includes((product.food_id)))) {
			//console.log("provider: ",this.state.disArray[i]);
			var a = Object.assign({}, this.state.disArray[i], { indexOf: this.state.disArray[i].food_id.indexOf((product.food_id)) })
			//console.log(a);
			b.push(a);
			this.setState({popup:b});
		}
	}
	if(b.length>0){
		localStorage.setItem('filterdFood', JSON.stringify(b));
		console.log("Filtered food: ",JSON.parse(localStorage.getItem('filterdFood')));
		product=null;
	} else {
		localStorage.setItem('filterdFood', JSON.stringify(product));
		console.log("Filtered food: ",JSON.parse(localStorage.getItem('filterdFood')));
		b=[];
	}
	
	this.props.history.push('/foodorder');
  } else{
	  this.props.alert.show("you must login to continue");
    }
}
find(e) {
	//this.setState({searchNew:e});
	this.state.searchNew=e;
	this.state.Items=[];
	//this.scroll();
	//console.log(this.state.searchNew);
	if(e.length<=0){
		this.setState({visible:false});
	} else if(e.length>0) {
		this.setState({visible:true});
	}
	//console.log(this.state.visible)
	// console.log(this.refs.topic.value);
	// var food_name = this.refs.topic.value;
	// //console.log(this.state.foodList);
	// for(var i=0;i<this.state.foodList.length;i++){
	// 	 if( (this.state.foodList[i].food_name.toLowerCase()).includes((e.toLowerCase())) ){
	// 		// if( (e.toLowerCase() ).includes(this.state.foodList[i].food_name.toLowerCase()) ) {
	// 		console.log(this.state.foodList[i]);
	// 		this.state.findFood[i]=this.state.foodList[i];
	// 		//this.setState({findFood:this.state.foodList[i]});
	// 		//console.log(this.state.findFood);
	// 		this.setState({visible:true});
	// 	} else {
	// 		//console.log("No items match");
	// 		//console.log(this.state.findFood);
			
	// 	}
		//console.log(e.length)
		
	
}

// scroll demo 
scroll() {
	// window.scrollTo({
	// 	top:this.myRef.current.offsetTop,
	// 	behavior:"smooth"
	// })
	this.props.alert.show("You can track your order by click the track order at top")
}

offerCart(o) {
	console.log("selected offer food:", o)
	this.state.offercart=o;
	this.setState({offerCart:o})
	//console.log("Offer cart:",this.state.offercart);
	//this.state.finalCart.push(this.state.offercart.available);
	//this.setState({finalCart:this.state.offercart.available});
	//console.log(this.state.finalCart);
}
add() {
	if(this.state.offercart.available>this.state.quantitySelected) {
		this.setState({quantitySelected:++this.state.quantitySelected});
		this.state.finalCart.quantity=this.state.quantitySelected;
	} else {
		alert("Selected food is no more available");
	}

}
sub() {
	if(this.state.quantitySelected>1) {
		this.setState({quantitySelected:--this.state.quantitySelected});
		this.state.finalCart.quantity=this.state.quantitySelected;
	} else {
		alert("Minimum limit reached");
	}
}

close(){
	this.setState({quantitySelected:0});
}

send(){
	
	this.state.finalCart.food_id=this.state.offercart.food_id;
	this.state.finalCart.food_name=this.state.offercart.food_name;
	this.state.finalCart.food_image=this.state.offercart.food_image;
	this.state.finalCart.price=this.state.offercart.deal_price;
	this.state.finalCart.available=this.state.offercart.available;
	this.state.finalCart.gstin=this.state.offercart.gstin;
	this.state.finalCart.tax=this.state.offercart.tax;

	this.state.finalCart.provider_id=this.state.offercart.provider_id;
	this.state.finalCart.provider_name=this.state.offercart.provider_name;
	this.state.finalCart.provider_address=this.state.offercart.provider_address;
	this.state.finalCart.provider_mobile_number=this.state.offercart.provider_mobile_number;
	this.state.finalCart.order_status="confirmed";
	
	this.state.finalCart.user_id=JSON.parse(sessionStorage.getItem('user')).user_id;
	this.state.finalCart.email=JSON.parse(sessionStorage.getItem('user')).email;
	this.state.finalCart.user_mobile_number=JSON.parse(sessionStorage.getItem('user')).mobile_number;
	this.state.finalCart.address=JSON.parse(sessionStorage.getItem('user')).address;

	this.state.finalCart.total_price=this.state.finalCart.quantity * this.state.finalCart.price;
	console.log(this.state.finalCart);
	localStorage.setItem('offerCart',JSON.stringify(this.state.finalCart));
	
	this.close();
	//this.props.alert.show("Your food add successfully");
	this.props.history.push("/offerCart");
}

errorBuy() {
	this.props.alert.show("You must login to continue");
}


    render(){         
    
        return(
            <div >

	{/* start of top carousel */}
	<div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img className="d-block w-100" src={require('./images/slide1.jpg')} alt="First slide"/>
    </div>
    <div className="carousel-item">
      <img className="d-block w-100" src={require('./images/slide4.jpg')} alt="Second slide"/>
    </div>
    <div className="carousel-item">
      <img className="d-block w-100" src={require('./images/slide3.jpg')} alt="Third slide"/>
    </div>
  </div>
  <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="sr-only">Previous</span>
  </a>
  <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="sr-only">Next</span>
  </a>
</div>


{/* end of top carousel */}
	<br/>
		<div className="header-bot_inner_wthreeinfo_header_mid">
		
		<div>
                        <PlacesAutocomplete
                            value={this.state.address}
                            onChange={this.handleChange}
                            onSelect={this.handleSelect}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div className="form-group has-search">
									{/* <span className="fa fa-search form-control-feedback"></span> */}
									<div>
										<h4 style={{display:"inline"}}> Search Places </h4>
										<img src={require("./images/arrow.gif") } style={{display:"inline"}} height="40px" width="50px" alt="" />
										
										<input type="text" className="form-control"
											{...getInputProps({
												placeholder: 'Search Places ...',

											})} autoFocus={true}
											
										/>
									</div>
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>

                        <span style={{fontSize:"25px",color:" #ffbb33"}}>Use my location</span><br/>
                        <button style={{backgroundColor:"#4dff4d"}} onClick={() => this.getLocation()}><i className="fas fa-thumbtack fa-2x"></i></button>

                    </div>		
				{/* <div className="agileits_search">
					<form action="#" method="post">
						<input name="Search" type="search" placeholder="How can we help you today?" required=""/>
						<button type="submit" className="btn btn-default" aria-label="Left Align">
							<span className="fa fa-search" aria-hidden="true"> </span>
						</button>
					</form>
				</div> */}
			{/* <div className="clearfix"></div> */}
		</div>
	
					
	<div className="ads-grid">
		<div className="container-fluid">

			<h3 className="tittle-w3l"> Food List
				<span className="heading-style">
					<i></i>
					<i></i>
					<i></i>
				</span>
			</h3>

			<div className="side-bar col-md-3" style={{backgroundColor:"#ccff33"}}>
				<div className="search-hotel">
					<h3 className="agileits-sear-head" style={{display:"inline"}}>Search Food..</h3>
					
					{/* <i className="far fa-hand-point-down 3x"></i> */}
					<img src={require("./images/arrow.gif")} height="50px" alt="" style={{ display:"inline"}} />
					<div >
						<input type="search" style={{color:"#00301e"}} placeholder="Food name..." name="search" required="" ref="topic"  onChange={e=> this.find(e.target.value)} autoComplete="off" />
						{/* <button className="btn btn-outline-success" onClick={()=> this.find()}>Find</button> */}
					</div>
				</div>
				
        {this.state.visible === false?(
			<div>
				<div className="left-side" >
					<h3 className="agileits-sear-head">Food Preference</h3>
					<ul>
						<li>
							{/* <input type="checkbox" className="checked"/> */}
							<span className="span">Vegetarian</span>
						</li>
						<li>
							{/* <input type="checkbox" className="checked"/> */}
							<span className="span">Non-Vegetarian</span>
						</li>
					</ul>
				</div>
		
		
		
				<div className="customer-rev left-side">
					<h3 className="agileits-sear-head">Customer Review</h3>
					<ul>
						<li>
							<a >
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<span>5.0</span>
							</a>
						</li>
						<li>
							<a >
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star-o" aria-hidden="true"></i>
								<span>4.0</span>
							</a>
						</li>
						<li>
							<a >
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								{/* <i className="fa fa-star-half-o" aria-hidden="true"></i> */}
								<i className="fa fa-star-o" aria-hidden="true"></i>
								<span>3.0</span>
							</a>
						</li>
						<li>
							<a >
								<i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star" aria-hidden="true"></i>
								{/* <i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star-o" aria-hidden="true"></i>
								<i className="fa fa-star-o" aria-hidden="true"></i> */}
								<span>2.0</span>
							</a>
						</li>
						<li>
							<a >
								<i className="fa fa-star" aria-hidden="true"></i>
								{/* <i className="fa fa-star" aria-hidden="true"></i>
								<i className="fa fa-star-half-o" aria-hidden="true"></i>
								<i className="fa fa-star-o" aria-hidden="true"></i>
								<i className="fa fa-star-o" aria-hidden="true"></i> */}
								<span>1.0</span>
							</a>
						</li>
					</ul>
				</div>
			
				<div className="left-side">
					<h3 className="agileits-sear-head">Categories</h3>
					<ul>
						<li>
							{/* <input type="checkbox" className="checked"/> */}
							<span className="span">South Indian</span>
						</li>
						<li>
							{/* <input type="checkbox" className="checked"/> */}
							<span className="span">North Indian</span>
						</li>
						<li>
							{/* <input type="checkbox" className="checked"/> */}
							<span className="span">Chineese </span>
						</li>
						
					</ul>
				</div>
		
				<div className="deal-leftmk left-side" id="" style={{overflowY:"scroll", height:"1800px"}}>
					<h3 className="agileits-sear-head">Special Deals</h3>
					{this.state.offers.map((o,index)=>
					<div key={index}>
					<div className="special-sec1">
					{/* className="col-xs-4 img-deals" */}
						<div >
							<img width="60%" height="60%" src={o.food_image} alt=""/>
						</div>
						<div >
							<h3 style={{display:"inline", fontSize:"20px"}}>{o.food_name}</h3>
							{/* <img style={{display:"inline"}} width="8%" height="10%" src="http://justsearchhere.com/assets/images/Category_Images/image661803363.png" alt="" /> */}
							{o.food_type === "Vegetarian" ?(
												<div >
												<img data-toggle="tooltip" title="Veg" width="8%" height="8%" src="http://justsearchhere.com/assets/images/Category_Images/image661803363.png" alt="" />
												
												</div>
												):(
													<div >
												<img data-toggle="tooltip" title="Non-Veg" width="8%" height="8%" src="data:image/png;base64,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" alt="" />
												
												</div>
											)
											}
							<p >Original price:</p>
							<del >Rs.{o.original_price}</del>
							<p >Deal price:</p>
							<p >Rs.{o.deal_price}</p>
							{JSON.parse(sessionStorage.getItem('user'))? (
							<button className="button" style={{backgroundColor:"powderblue"}} data-toggle="modal" data-target="#offer" onClick={()=> this.offerCart(o)}>Buy</button>
							):(
								<button className="button" style={{backgroundColor:"powderblue"}} onClick={()=>this.errorBuy()} >Buy</button>
							)}
							</div>
						<div className="clearfix"></div>
					</div>
					
					</div>
					)}
				</div>
				
			</div>
	):[]}
			</div>

			<div className="col-md-9"  ref={this.myRef} >
			<div className="clearfix"></div>
		{/* find food part starts */}
		{/* {console.log("this.state.findFood")}
		{this.state.visible === true?(
					<div className="product-sec1">
						<h3 className="heading-tittle">Search Results</h3>
						
						<div className="row">
								<div className="col-sm-4">
									<img src={this.state.findFood.food_image} width="55%" height="45%" alt=""/>
									<div className="item-info-product ">
										<h4>
											<a >{this.state.findFood.food_name}</a>
										</h4>
											<div className="info-product-price">
												<span className="item_price">{this.state.findFood.price}</span>
												
												<button type="button" className="btn btn-link"  onClick={()=>this.cart(this.state.findFood)}>
												Order
											</button>
										</div>
									</div>
								</div>
						</div>			
						<div className="clearfix"></div>
					</div>
		):[]} */}
	
				{/* find food part ends */}

	{this.state.Items.size >0 || this.state.visible === true ?(
			<div style={{backgroundColor:" #80ffd4"}}>
				
					{/* map filter starts */}
					<div>
						{this.state.Items.size >0?(
							<div>
								<h3 className="heading-tittle" style={{color:"green"}}>Map filtered results</h3>
								<div className="row">
								
								{this.state.foodList.filter(f => Array.from(this.state.Items).includes(f.food_id)).map((f,index) =>
									<div className="col-sm-3" key={index}>
									

										<img src={f.food_image} width="55%" height="40%" alt=""/>
										<h4>
										<p >{f.food_name}</p> &nbsp;
										
											{f.food_type === "Vegetarian" ?(
												<div >
												<img data-toggle="tooltip" title="Veg" width="10%" height="10%" src="http://justsearchhere.com/assets/images/Category_Images/image661803363.png" alt="" />
												
												</div>
												):(
													<div >
												<img data-toggle="tooltip" title="Non-Veg" width="10%" height="10%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN8AAADiCAMAAAD5w+JtAAAAkFBMVEX////UAADRAADaQUHZNzfolJT0y8vyxsbqnp7eWFjlh4f54+P21tbvtbX87u7sqanvu7vbTk799fXrpKTkgYH++vr33NzxwcHXIiLgaGj21dX54uLXJyfwu7vfYmLhcHDje3vbSEjtsLDaPT3WFxfXHx/jfX3ol5fXLi7fY2PVDQ3eW1vhbm7cUlLnjY3YMjJ9FwOmAAALLUlEQVR4nO2daXvqLBCGE7TWpe5aa6qtS/dW+///3TEMJGTzsAxgevl8eN+ao8JtCAwwMwSBqMm6+/1Awtrq9TDrD4IqLcakxmxMhDR3pXStVf3hQCTsF/GWf4UuFhlPsnSDl7+EF+texOv5rg2+SEu4e8LlWncxYu1JegdXybVVO3Nfa6fH4T4lnLOLM37pZeG1cjiKfjlOBy7cs9dk6bdiaOpyILhdY/Zq5rlaeJoywJf4xR178em7Vohid5CMTn9vWGv1XSdUNYFpfPqTtc4Sk6bGitgNnPDm+eW7Rsja8gY6BL6j7woha8exZgDa+v9HaqUB8H0HT7yh/jEB34qNfsR3ddD1wLgaf5SPjRBXvprqyldvXfnqrStfvXXlq7eufPXWla/euvLVW1e+euvKV29d+eqtKx+iJnejafe5s//9+Pj43R+eZ+11VO1HhSJXfPPb9+/YryHrlkEvHI4Le5BO+KLj71mHE0IeZpZ2duzztTahjC8NIUsbbhuW+XpHKTiGGL6hu91Y5WsdVL2gyH6EWwWLfKMPHR8v8jXErIQ1voW2HykJyz1TtWSJ775h4p9HVmi9qRW++bOp9yHpIA2JNvhGhnBQlSlKXfD55k84rqNki3EL0fkiFDioDcJYgc33jun3SzaXxveN69ZM9qYOOah8EwuxE73L4bPifm/oMobId2fH5d6sl8Hji2xFFBj5pKLxWcMzA8Tiu7cZD0L0Z75IfD274S4k8ss3sUoXV0x3mMDha9rmS6NsfPD9OAjG2vrjG7qINSNdX3yPbkLpyK0nvlcneCfp2NrmfG/OIiE7Pvgs2i156dgxxnwvzvBCnUHClO/GaZzus2u+gdswZKK8P2HIt3SKF4Z7t3xWZw1lUp5JmPEdHOOF4YNLPksrEuekulphxPftHC8OdXPG58jwzEpxPc2Eb3OmGvZ0cMU395OCQ20qb8DnZNpXIqUYaAM+B4sS5XLDZ3nJrFpKPYw+n1vLWpSKla3P9+ELT6mBavN5a55qDVSbz1fvGUthKU2bz4dtxvXhgM8jnkoaCV0+5zO/DJ/8LFCXz+fjp2LC6PI9e6RT2YzQ5VudKd2+5Oupy+c3fR+Rdt3S5PM4utN6Su+1aPLdeuaT9vHV5Jv65ZPvQDX5jh7ZYknnSNTk+/HIFkt6gNDk82l9xnqxzOdtbYLLMp/TXb8yWebzSAYVld3prCuf7Azpynfl8yDbz99f7z//+vjX8YgWy7b94tv+bFjm++vzB9/zP+kVbE2+hef5u3RwoCafF9eCVNbXX3yvn0nvwevyPXikc7H+6Xf9Wnp40Obz24HKbwDq8nlwPUul4ISmvf/nlU8+slqbz6cFquAkqc3n8wFUOCKmlv4TCpEs+v4v/kZAlVrq8/mbQqgc0KTP583DQMnH3MB/0NsWtUolDfh89aBKB2wZ8E08+e8+OuLzZGOrBaqa8HnpYRQjWIziH8Ye+F7VqmjE1/IQv6KYO8ws/qjhnE/1gDQzPofBqSDlEFXD+D/XsyTF6CNjPsezCPVkPqbxt12ngE/K9TOOn3aJp3G8nTGfQ087ea86RD6HW2Xyq56YfM5aqMKqGSqfo0GQrHUqh5H/BTXnYCXeRqtuKPl7XHgT/upVDSf/koO1NM1Eizh8A9t06oknUPlsT3X1E7xh5a+zOhVUnfRZ4LPpcWCSahgvf6Q1QKNMyoj5Py1ZojpWpxU+O3u6hkmUUfPv9r7w+bQzR1rgC+ZGaeeLIg+mOb6x81/PUPNffxrXBz1/OWI3atazWOILJluk/PMrw9TXVDbOD0CJPSY3KHWxcv7DwPgIAdLAuHmBtfM7WkaZ2kmoNVcvk7XzV3YKBwPl6EgbrxoWz88ZfmmdnxO+Y1bC6vlH66by+UevqKcDWT+/6m5z7tyxPBz5RD+FzDLfSesnKURCtjvNHNfnZJ/vZJUuNl9nGU//+NM3PamjXC74Yg3Ws0bh+L+QHgDY3OyUXD6U5IqPqtcaHp8P+6+4lwy/moef43CBNI5XySmfB1356q0rX7115au3UPii3c3xZtiyYF7JlHxsr6vtg//wtWODQ8x4O6NvEx30ox9ql8T/6YjX6Y7Lq2B1ranxkl92gPKzPrmwX7oJShJsi96td1AyFF2xBSPDRwS3GurPI/BNMifGkWZqjsCOkuBQNaIfzfO9sQoIgsS+9Eyggv9XGvmXLfkEeafLJ5590s3ev/tC+clyOtsxG/+Hr5XCcPXpJeopWM1XLLn08ZDiE9z2snwl25rJViTjI2/n+VgDFSPeoHkez/IVA2TLoyLk+NL94QzfnBdKGp0tX2/hbip8xzP5bSr46DeKfp2sed6nfETQY67k3+/lYRU//+VBO5J8ydEZGT7uYA7P9ojtrjSyfEmXUMEHu07C09MXHlzKR1qDVPAe7jTFpsST/rai65fmOxT5WBtZJX3kHr6kleXjyRQq+FiujrSBAlNb+LvQ/bOSm8Klio0YaT5WoMi3ybTHIGk1nRxf+HmWj7kH8ZcQVsG+tYKPNRyJKb80H2tBIh9URFzOg5V5cGMU+GCjpIpvkO1Bd0Ro5BV88AmZfWspvnH6Cwt8kQCTLXiR8sEATXu9Kr5gS9/D+1kadMA9JjrJp0WVlWzARxawq7fM8g3FHzoQ6/Oe8t2sk96ikq8vNlB2N8XvCzddLvh0WckmfH3oOWIPPoEPAgCzltUN1Cfl6wYb+hWzM3wwBLJGD1FbPEV5bvwjkDm5m5aCxAcHGJ5ahMD3nN6rRPDLPol8UMTp8Ur5BtEdU0QfLeiolmmFEj/y/PgOPWa+5Hn8fVGpC5ckH2vyY5GPjkG5hxya2iHDxzpEgW+YDtcUig2B8VgGDvlJEM45vnQX5pF+VWl7leULjvDXUf3+wZY1ebtN+HZp1woNkeayp8XQrP1p1fP2yyooK7nHfnwTPvbOZcon+fydBI8gbYXlfMPktlMbKB1Sob+arrnAuJ2lpeDxCUdxVfefh/SXFfiEdGLlfHM+pkfp/Rf48uMD9EHpWVYofMK2euX4Ny+Mf8CXejax5y95yax+uLdt1vLSXaTy8b2VKxmHL9hm+Ursl2nBfmFmZeIWU+E2ABOtl4D97z987GdMnlIkvqSFMj4w4gX7kx2DK9qf3GzO3L8SgWkOT7fQJVfYZ6zb4TcQiS9xlGd8bHb7wIuZf4j/muVLZoMVfH3h6RYm4hV8zFVxNcfl437kfP73xGo0jQknQ/ZqLxIl057leT4hSuRNuAp80UQQvb5n74WaDbD4WCgH5+PHMhPyun/le3u8t8vxsWjySr7kuJpMb1mcv8Pd5XF5hGyXy0+AQODjjxxfCyjx+EzCTHJ8vO+p4kui6TPVLMZPsta7LpaMwcdsrWStI6rEK/BBPodqtys2Z82GMFbylQCe5RvL8UEXI65/ZlyxyD6//inwtSrnD1R8tSNzsZov6O2zhOX25wPjgq6iMGV8p01eXBumD4MYjnC/SZ6Ppfjb39JLovl2iC9UZ44f0w/0S64Vnz+q1jK9Gj5NS3e6+Y82K2kc0nocTdvTtW6IiYnuF8PpcLeIqtx82ZD9zU0mpbPZaqAdx2I9oWr4/KVrC81yxMdXnSOeL1h8vJ6kh036rhKqmunIwbdK1EPML1csOB/2tFiyE6KU/ueixRMowWoOv4FEJf3WJYunVuCjdTIHfdGOJrwgRb8cp8MvJQm/yKrtY7DG0+NQMN4Sg0eIoi16MtZJYu3FyN2exzpZUmZjPxi81Pm2lSn/nC3/EiAZF7fQzCJPLkkkLDc2F+Nady4gQvbVQeWTdffb7wGGZno9zPrZGeE/MNG0s8KBTxEAAAAASUVORK5CYII=" alt="" />
												
												</div>
											)
											}
										</h4>
											<button type="button" className="btn btn-primary"  onClick={()=>this.cart(f)}>
												Order
											</button>
											<br/>
									<br/>
									</div>
								)}
								</div>
							</div>
					):(
						<div className="product-sec1">
						<h3 className="heading-tittle" >Search Results</h3>
						
						<div className="row">
						{/* {console.log(this.state.foodList)} */}
							{this.state.foodList.filter(f=>f.food_name.toLowerCase().replace(/\s/g,'').includes(this.state.searchNew.toLowerCase().replace(/\s/g,''))).map((o,index) =>
								
								<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={index}>
								
									<img src={o.food_image} width="55%" height="40%" alt=""/>
									<h4>
									<p  style={{display:"inline",color:" #476b6b"}}>{o.food_name} </p> &nbsp;
									{o.food_type === "Vegetarian" ?(
												<div >
													<img data-toggle="tooltip" data-placement="top" title="Veg" width="10%" height="10%" src="http://justsearchhere.com/assets/images/Category_Images/image661803363.png" alt="" />
													{/* {console.log("hai")} */}
												</div>
												):(
												<div >
													<img data-toggle="tooltip" data-placement="top" title="Non veg" width="10%" height="10%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN8AAADiCAMAAAD5w+JtAAAAkFBMVEX////UAADRAADaQUHZNzfolJT0y8vyxsbqnp7eWFjlh4f54+P21tbvtbX87u7sqanvu7vbTk799fXrpKTkgYH++vr33NzxwcHXIiLgaGj21dX54uLXJyfwu7vfYmLhcHDje3vbSEjtsLDaPT3WFxfXHx/jfX3ol5fXLi7fY2PVDQ3eW1vhbm7cUlLnjY3YMjJ9FwOmAAALLUlEQVR4nO2daXvqLBCGE7TWpe5aa6qtS/dW+///3TEMJGTzsAxgevl8eN+ao8JtCAwwMwSBqMm6+/1Awtrq9TDrD4IqLcakxmxMhDR3pXStVf3hQCTsF/GWf4UuFhlPsnSDl7+EF+texOv5rg2+SEu4e8LlWncxYu1JegdXybVVO3Nfa6fH4T4lnLOLM37pZeG1cjiKfjlOBy7cs9dk6bdiaOpyILhdY/Zq5rlaeJoywJf4xR178em7Vohid5CMTn9vWGv1XSdUNYFpfPqTtc4Sk6bGitgNnPDm+eW7Rsja8gY6BL6j7woha8exZgDa+v9HaqUB8H0HT7yh/jEB34qNfsR3ddD1wLgaf5SPjRBXvprqyldvXfnqrStfvXXlq7eufPXWla/euvLVW1e+euvKV29d+eqtKx+iJnejafe5s//9+Pj43R+eZ+11VO1HhSJXfPPb9+/YryHrlkEvHI4Le5BO+KLj71mHE0IeZpZ2duzztTahjC8NIUsbbhuW+XpHKTiGGL6hu91Y5WsdVL2gyH6EWwWLfKMPHR8v8jXErIQ1voW2HykJyz1TtWSJ775h4p9HVmi9qRW++bOp9yHpIA2JNvhGhnBQlSlKXfD55k84rqNki3EL0fkiFDioDcJYgc33jun3SzaXxveN69ZM9qYOOah8EwuxE73L4bPifm/oMobId2fH5d6sl8Hji2xFFBj5pKLxWcMzA8Tiu7cZD0L0Z75IfD274S4k8ss3sUoXV0x3mMDha9rmS6NsfPD9OAjG2vrjG7qINSNdX3yPbkLpyK0nvlcneCfp2NrmfG/OIiE7Pvgs2i156dgxxnwvzvBCnUHClO/GaZzus2u+gdswZKK8P2HIt3SKF4Z7t3xWZw1lUp5JmPEdHOOF4YNLPksrEuekulphxPftHC8OdXPG58jwzEpxPc2Eb3OmGvZ0cMU395OCQ20qb8DnZNpXIqUYaAM+B4sS5XLDZ3nJrFpKPYw+n1vLWpSKla3P9+ELT6mBavN5a55qDVSbz1fvGUthKU2bz4dtxvXhgM8jnkoaCV0+5zO/DJ/8LFCXz+fjp2LC6PI9e6RT2YzQ5VudKd2+5Oupy+c3fR+Rdt3S5PM4utN6Su+1aPLdeuaT9vHV5Jv65ZPvQDX5jh7ZYknnSNTk+/HIFkt6gNDk82l9xnqxzOdtbYLLMp/TXb8yWebzSAYVld3prCuf7Azpynfl8yDbz99f7z//+vjX8YgWy7b94tv+bFjm++vzB9/zP+kVbE2+hef5u3RwoCafF9eCVNbXX3yvn0nvwevyPXikc7H+6Xf9Wnp40Obz24HKbwDq8nlwPUul4ISmvf/nlU8+slqbz6cFquAkqc3n8wFUOCKmlv4TCpEs+v4v/kZAlVrq8/mbQqgc0KTP583DQMnH3MB/0NsWtUolDfh89aBKB2wZ8E08+e8+OuLzZGOrBaqa8HnpYRQjWIziH8Ye+F7VqmjE1/IQv6KYO8ws/qjhnE/1gDQzPofBqSDlEFXD+D/XsyTF6CNjPsezCPVkPqbxt12ngE/K9TOOn3aJp3G8nTGfQ087ea86RD6HW2Xyq56YfM5aqMKqGSqfo0GQrHUqh5H/BTXnYCXeRqtuKPl7XHgT/upVDSf/koO1NM1Eizh8A9t06oknUPlsT3X1E7xh5a+zOhVUnfRZ4LPpcWCSahgvf6Q1QKNMyoj5Py1ZojpWpxU+O3u6hkmUUfPv9r7w+bQzR1rgC+ZGaeeLIg+mOb6x81/PUPNffxrXBz1/OWI3atazWOILJluk/PMrw9TXVDbOD0CJPSY3KHWxcv7DwPgIAdLAuHmBtfM7WkaZ2kmoNVcvk7XzV3YKBwPl6EgbrxoWz88ZfmmdnxO+Y1bC6vlH66by+UevqKcDWT+/6m5z7tyxPBz5RD+FzDLfSesnKURCtjvNHNfnZJ/vZJUuNl9nGU//+NM3PamjXC74Yg3Ws0bh+L+QHgDY3OyUXD6U5IqPqtcaHp8P+6+4lwy/moef43CBNI5XySmfB1356q0rX7115au3UPii3c3xZtiyYF7JlHxsr6vtg//wtWODQ8x4O6NvEx30ox9ql8T/6YjX6Y7Lq2B1ranxkl92gPKzPrmwX7oJShJsi96td1AyFF2xBSPDRwS3GurPI/BNMifGkWZqjsCOkuBQNaIfzfO9sQoIgsS+9Eyggv9XGvmXLfkEeafLJ5590s3ev/tC+clyOtsxG/+Hr5XCcPXpJeopWM1XLLn08ZDiE9z2snwl25rJViTjI2/n+VgDFSPeoHkez/IVA2TLoyLk+NL94QzfnBdKGp0tX2/hbip8xzP5bSr46DeKfp2sed6nfETQY67k3+/lYRU//+VBO5J8ydEZGT7uYA7P9ojtrjSyfEmXUMEHu07C09MXHlzKR1qDVPAe7jTFpsST/rai65fmOxT5WBtZJX3kHr6kleXjyRQq+FiujrSBAlNb+LvQ/bOSm8Klio0YaT5WoMi3ybTHIGk1nRxf+HmWj7kH8ZcQVsG+tYKPNRyJKb80H2tBIh9URFzOg5V5cGMU+GCjpIpvkO1Bd0Ro5BV88AmZfWspvnH6Cwt8kQCTLXiR8sEATXu9Kr5gS9/D+1kadMA9JjrJp0WVlWzARxawq7fM8g3FHzoQ6/Oe8t2sk96ikq8vNlB2N8XvCzddLvh0WckmfH3oOWIPPoEPAgCzltUN1Cfl6wYb+hWzM3wwBLJGD1FbPEV5bvwjkDm5m5aCxAcHGJ5ahMD3nN6rRPDLPol8UMTp8Ur5BtEdU0QfLeiolmmFEj/y/PgOPWa+5Hn8fVGpC5ckH2vyY5GPjkG5hxya2iHDxzpEgW+YDtcUig2B8VgGDvlJEM45vnQX5pF+VWl7leULjvDXUf3+wZY1ebtN+HZp1woNkeayp8XQrP1p1fP2yyooK7nHfnwTPvbOZcon+fydBI8gbYXlfMPktlMbKB1Sob+arrnAuJ2lpeDxCUdxVfefh/SXFfiEdGLlfHM+pkfp/Rf48uMD9EHpWVYofMK2euX4Ny+Mf8CXejax5y95yax+uLdt1vLSXaTy8b2VKxmHL9hm+Ursl2nBfmFmZeIWU+E2ABOtl4D97z987GdMnlIkvqSFMj4w4gX7kx2DK9qf3GzO3L8SgWkOT7fQJVfYZ6zb4TcQiS9xlGd8bHb7wIuZf4j/muVLZoMVfH3h6RYm4hV8zFVxNcfl437kfP73xGo0jQknQ/ZqLxIl057leT4hSuRNuAp80UQQvb5n74WaDbD4WCgH5+PHMhPyun/le3u8t8vxsWjySr7kuJpMb1mcv8Pd5XF5hGyXy0+AQODjjxxfCyjx+EzCTHJ8vO+p4kui6TPVLMZPsta7LpaMwcdsrWStI6rEK/BBPodqtys2Z82GMFbylQCe5RvL8UEXI65/ZlyxyD6//inwtSrnD1R8tSNzsZov6O2zhOX25wPjgq6iMGV8p01eXBumD4MYjnC/SZ6Ppfjb39JLovl2iC9UZ44f0w/0S64Vnz+q1jK9Gj5NS3e6+Y82K2kc0nocTdvTtW6IiYnuF8PpcLeIqtx82ZD9zU0mpbPZaqAdx2I9oWr4/KVrC81yxMdXnSOeL1h8vJ6kh036rhKqmunIwbdK1EPML1csOB/2tFiyE6KU/ueixRMowWoOv4FEJf3WJYunVuCjdTIHfdGOJrwgRb8cp8MvJQm/yKrtY7DG0+NQMN4Sg0eIoi16MtZJYu3FyN2exzpZUmZjPxi81Pm2lSn/nC3/EiAZF7fQzCJPLkkkLDc2F+Nady4gQvbVQeWTdffb7wGGZno9zPrZGeE/MNG0s8KBTxEAAAAASUVORK5CYII=" alt="" />
													{/* {console.log("oii selfie")} */}
												</div>
											)
											}
											</h4>
											<button type="button" className="btn btn-primary"  onClick={()=>this.cart(o)}>
												Order
											</button>
											<br/>
									<br/>
								</div>
						    )}
						</div>			
						<div className="clearfix"></div>
					</div>
					)}
					</div>
					
					 
			</div>
	):(
				<div className="wrapper" >
					
					<div className="product-sec1" style={{backgroundColor:" #80ffd4"}}>
						<h3 className="heading-tittle" >Breakfast</h3>
						<div className="row" >
							
							{this.state.foodList.filter(f1 =>(f1.breakfast === true)).map((f2,index) =>
								<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={index}>
									<img src={f2.food_image} width="55%" height="40%" alt=""/>
									{/* <div className="item-info-product "> */}
									<h4>
										<p style={{display:"inline",color:" #476b6b"}} >{f2.food_name}</p> &nbsp;
										
										{f2.food_type === "Vegetarian" ?(
												<div style={{display:"inline"}}>
													<img data-toggle="tooltip" data-placement="top" title="Veg" width="10%" height="10%" src="http://justsearchhere.com/assets/images/Category_Images/image661803363.png" alt="" />
														
												</div>
												):(
												<div style={{display:"inline"}}>
													<img data-toggle="tooltip" data-placement="top" title="Non veg" width="10%" height="10%" src="data:image/png;base64,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" alt="" />
												
												</div>
											)
											}
									</h4>
									<button type="button" className="btn btn-primary"  onClick={()=>this.cart(f2)}>
										Order
									</button>
								
								
									{/* </div> */}
								</div>
							)}
						
						</div>
						
						
						<div className="clearfix"></div>
					</div>
	
					<div className="product-sec1 product-sec2" style={{backgroundColor:" #80ffd4"}}>
						<div className="col-xs-7 effect-bg">
							<h3 className="">Pure Energy</h3>
							<h6>Enjoy our all healthy Products</h6>
							<p>Get Extra 10% Off</p>
						</div>
						<h3 className="w3l-nut-middle">Native Foods</h3>
						<div className="col-xs-5 bg-right-nut">
							<img src="images/nut1.png" alt=""/>
						</div>
						<div className="clearfix"></div>
					</div>
			
					<div className="product-sec1" style={{backgroundColor:" #80ffd4"}}>
						<h3 className="heading-tittle">Lunch</h3>
						<div className="row" >
							
							{this.state.foodList.filter(f1 =>(f1.lunch === true)).map((f2,index) =>
								<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={index}>
									<img src={f2.food_image} width="55%" height="45%" alt=""/>
									
									<h4>
										<p style={{display:"inline",color:" #476b6b"}}>{f2.food_name}</p> &nbsp;
										{f2.food_type === "Vegetarian" ?(
												<div style={{display:"inline"}}>
												<img data-toggle="tooltip" data-placement="top" title="Veg" width="10%" height="10%" src="http://justsearchhere.com/assets/images/Category_Images/image661803363.png" alt="" />
													{/* {console.log("hai")} */}
												</div>
												):(
													<div style={{display:"inline"}}>
												<img data-toggle="tooltip" data-placement="top" title="Non Veg" width="10%" height="10%" src="data:image/png;base64,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" alt="" />
												{/* {console.log("oii selfie")} */}
												</div>
											)
											}
									</h4>
								
										<button type="button" className="btn btn-primary"  onClick={()=>this.cart(f2)}>
										Order
									</button>
									
								
								</div>
							)}
						
						</div>
					
					
						
						<div className="clearfix"></div>
					</div>
		
					<div className="product-sec1" style={{backgroundColor:" #80ffd4"}}>
						<h3 className="heading-tittle">Dinner</h3>
						<div className="row" >
							
							{this.state.foodList.filter(f1 =>(f1.dinner === true)).map((f2,index) =>
								<div className=" col-xs-12 col-sm-6 col-md-4 col-lg-3" key={index}>
									<img src={f2.food_image} width="55%" height="45%" alt=""/>
									
									<h4>
										<p style={{display:"inline",color:" #476b6b"}}>{f2.food_name}</p> &nbsp;
										{f2.food_type === "Vegetarian" ?(
												<div style={{display:"inline"}}>
												<img data-toggle="tooltip" data-placement="top" title="Veg" width="10%" height="10%" src="http://justsearchhere.com/assets/images/Category_Images/image661803363.png" alt="" />
													
												</div>
												):(
													<div style={{display:"inline"}}>
												<img data-toggle="tooltip" data-placement="top" title="Non Veg" width="10%" height="10%" src="data:image/png;base64,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" alt="" />
												
												</div>
											)
											}
											<br/>
											
									</h4>
									
									<button type="button" className="btn btn-primary"  onClick={()=>this.cart(f2)}>
										Order
									</button>

									
									
								</div>
							)}
						
						</div>
						
						<div className="clearfix"></div>
					</div>

				</div>
			)}

			</div>
	
		</div>
	</div>

								{/* modalbox */}
						
				<div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="exampleModalCenterTitle">{this.state.foodName}</h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
						
					</div>
					<div className="modal-body">
						{this.state.popup.map((p, index) =>

							<tr key={p.provider_id}>
							{/* <th> <input type="radio" className="form-check-input" id="materialInline1" name="inlineMaterialRadiosExample" onChange={() => this.selectProvider(p.provider_id, index)}/>
								<label className="form-check-label" htmlFor="materialInline1"></label></th> */}                                
								<th><input type="checkbox" name="provider" className="form-check-input" value={p.provider_id} /></th>
								
								<th scope="row">{p.price[p.indexOf]}</th>
								<td>{p.quantity[p.indexOf]}</td>
								<td>{p.available[p.indexOf]}</td>
								<td>{p.provider_address}&nbsp; ({(Number(p.distance).toFixed(1))})kms</td>
								{/* <td>
									<StarRatingComponent name="rate2"  editing={false}
										renderStarIcon={() => <span>✿</span>}
										starCount={5}
										value={p.rating[p.indexOf]}
										/>
								</td>    
									<button className="btn btn-outline-info bg-light" onClick={() => this.addCart(p, index)}>Add to cart</button> */}
								
							</tr>
						)}
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
						<button type="button" className="btn btn-primary">Save changes</button>
					</div>
					</div>
				</div>
				</div>
	
	

		

{/* modal for special deals */}
	<div className="modal fade" id="offer" tabIndex="-1" role="dialog" data-keyboard="false" data-backdrop="static">
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
						<h3 className="agileinfo_sign">Cart </h3>
					
				                          {/* add cart */}
                            
                                          <pre>
								<div style={{textAlign:"left"}}>
									<h5 style={{display:"inline",}}>Food name:</h5> &nbsp;
									<p style={{display:"inline"}}>{this.state.offercart.food_name}</p>
								</div>
								
								<div style={{textAlign:"left"}}>
									<h5 style={{display:"inline"}}>Available:</h5> &nbsp;
									<p style={{display:"inline"}}>{this.state.offercart.available}</p>
								</div>
								
								<div style={{textAlign:"left"}}>
									<h5 style={{display:"inline"}}>Original price:</h5> &nbsp;
									<del style={{display:"inline"}}>{this.state.offercart.original_price}</del>
								</div>
								
								<div style={{textAlign:"left"}}>
									<h5 style={{display:"inline"}}>Deal price:</h5> &nbsp;
									<p style={{display:"inline"}}>{this.state.offercart.deal_price}</p>
								</div>
								
                                <div>
                                    <button className="btn btn-success" onClick={() => this.add()}>+</button> &nbsp;
                                
                                          {/* show add */}
											
                                        {/* <div>
                                        
											{((this.state.cart.quantity[this.state.i]) && (this.state.cart.food_id[this.state.i] === this.state.food_id) && (this.state.cart.provider_id[this.state.i] === this.state.provider_id))?(
												<div>
													{this.state.cart.quantity[this.state.i]}
												</div>
											):(
												<div>
														{this.state.food_quantity}
												</div>
											)}
											
										</div> */}
										

                                    <button className="btn btn-danger" onClick={() => this.sub()}>-</button><br/>
                                </div>
                            </pre>
							<span>
								
												{this.state.quantitySelected?(
													<div>
														<p>Quantity selected</p>
														<p>{this.state.quantitySelected}</p>
													</div>
												):[]}
											</span>
                            <div>
                                <button className="btn btn-info" data-dismiss="modal" onClick={()=> this.send()}>Send to Cart</button>
                            </div>
                      
                        </div>

						<div className="clearfix"></div>
					</div>
					<div className="clearfix"></div>
				</div>
			</div>
			
		</div>
	
            </div>
        );
    }
}
export default withAlert(Home);