import React, { Component } from 'react';

class Footer extends Component{

    render(){
        return(
            <div>

                <footer>
		<div className="container">
		{/* <div className="footer-top">
		<div className="container">
	
			<div className="col-xs-12 " >
				<img src={require('./images/tab3.png')} alt=" "/>
				<button className="btn btn-success"  data-toggle="modal" data-target="#track-order" >Track your order</button>
			</div>
			
			<div className="clearfix"></div>
		</div>
	</div> */}

			<div className="w3l-grids-footer">
				<div className="col-xs-4 offer-footer">
					<div className="col-xs-4 icon-fot">
					<span className="fa fa-truck"  aria-hidden="true"></span>
					</div>
					<div className="col-xs-8 text-form-footer">
						<h3>Track Your Order</h3>
					</div>
					<div className="clearfix"></div>
				</div>
				<div className="col-xs-4 offer-footer">
					<div className="col-xs-4 icon-fot">
					<span className="fas fa-map-marker-alt" aria-hidden="true"></span>
					</div>
					<div className="col-xs-8 text-form-footer">
						<h3>Shop Locator</h3>
					</div>
					<div className="clearfix"></div>
				</div>
				<div className="col-xs-4 offer-footer">
					<div className="col-xs-4 icon-fot">
					<span className="fas fa-surprise"></span>
					</div>
					<div className="col-xs-8 text-form-footer">
						<h3>Get Amazing Deals </h3>
					</div>
					<div className="clearfix"></div>
				</div>
				<div className="clearfix"></div>
			</div>
	
			<div className="footer-info w3-agileits-info">
		
				<div className="col-sm-3 address-right">
					<div className="col-xs-12 footer-grids">
						<h3>Categories</h3>
						<ul>
							<li>
								<a href="">South Indian</a>
							</li>
							<li>
								<a href="">North Indian</a>
							</li>
							<li>
								<a href="">Chineese</a>
							</li>
					
						</ul>
					</div>
					
				</div>
	
				<div className="col-sm-6 address-right">
					<div className="col-xs-6 footer-grids">
						<h3>Quick Links</h3>
						<ul>
							<li>
								<a href="">About Us</a>
							</li>
							<li>
								<a href="">Contact Us</a>
							</li>
							<li>
								<a href="">Help</a>
							</li>
							<li>
								<a href="">Faqs</a>
							</li>
							<li>
								<a href="">Terms of use</a>
							</li>
							<li>
								<a href="">Privacy Policy</a>
							</li>
						</ul>
					</div>
					<div className="col-xs-6 footer-grids">
						<h3>Get in Touch</h3>
						<ul>
							<li>
								<i className="fa fa-map-marker"></i> 12A Pulavarpalayam, Tirupur.</li>
							<li>
								<i className="fa fa-mobile"></i> 9597 7708 80 </li>
							<li>
								<i className="fa fa-phone"></i> +0421 2478 12 </li>
							<li>
								<i className="fa fa-envelope-o"></i>
								<a href="mailto:nativefood@gmail.com"> nativefood@gmail.com</a>
							</li>
						</ul>
					</div>
				</div>
			
				<div className="col-sm-3 footer-grids  w3l-socialmk">
					<h3>Follow Us on</h3>
					<div className="social">
						<ul>
							<li>
								<a className="icon fb" href="#">
									<i className="fab fa-facebook-f"></i>
								</a>
							</li>
							<li>
								<a className="icon tw" href="#">
									<i className="fab fa-twitter"></i>
								</a>
							</li>
							<li>
								<a className="icon gp" href="#">
									<i className="fab fa-google-plus"></i>
								</a>
							</li>
						</ul>
					</div>
			
				</div>
		
				<div className="clearfix"></div>
			</div>
	
			<div className="agile-sometext">
				<div className="sub-some">
					<h5>Online Food Ordering</h5>
					<p>Order online. All your favourite products from the low price online supermarket for foods home delivery in Vijayamanagalam,
						Nadupatti, Pulavarpalayam, Koolipalayam and other areas in Tirupur.</p>
				</div>
				<div className="sub-some">
					<h5>Shop online with the best deals & offers</h5>
					<p>Now Get Upto 10% Off On Everyday Essential Products Shown On The Offer Page. </p>
				</div>
				
		
				<div className="sub-some child-momu">
					<h5>Payment Method</h5>
					<ul>
						<li>
							<img src={require('./images/pay1.png')} alt=""/>
						</li>
						<li>
							<img src={require('./images/pay2.png')} alt=""/>
						</li>
						<li>
							<img src={require('./images/pay3.png')} alt=""/>
						</li>
						<li>
							<img src={require('./images/pay4.png')} alt=""/>
						</li>
						<li>
							<img src={require('./images/pay5.png')} alt=""/>
						</li>
						<li>
							<img src={require('./images/pay6.png')} alt=""/>
						</li>
						<li>
							<img src={require('./images/pay7.png')} alt=""/>
						</li>
						<li>
							<img src={require('./images/pay8.png')} alt=""/>
						</li>
						{/* <li>
							<img src={pay9} alt=""/>
						</li> */}
					</ul>
				</div>
				
			</div>
		
		</div>
	</footer>

	<div className="copy-right">
		<div className="container">
			<p>© 2018 Native Food. All rights reserved | Design by
				<a href="http://shinedevelopers.com"> Shine Developers.</a>
			</p>
		</div>
	</div>
            </div>
        )
    }
}

export default Footer;