import React, { Component } from 'react'
import api from './api';
import {withAlert} from 'react-alert';
//import { CSSTransitionGroup } from 'react-transition-group'

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            FoodList: [],
        }
    }
    componentDidMount() {
        api.get('/items').then(response => {
        this.setState({foodList:response.data});
        this.state.foodList=response.data;
        console.log("Food list details: ",this.state.FoodList);
        }).catch(error => {
            console.log(error);
        })
    }

    searchText(e) {
        var u = this.refs.title.value;
        this.state.search = e;
        this.setState({ search: e });
        //console.log(this.state.search.length);
    }

    // cart button
    cart(product) {
        if (JSON.parse(sessionStorage.getItem('user'))) {
            this.setState({ foodName: product.food_name });
            var b = [];
            localStorage.setItem('filterdFood', JSON.stringify(product));
            console.log("Selected food details: ",JSON.parse(localStorage.getItem('filterdFood')));
            this.props.history.push('/foodOrder');
        } else {
            //alert("you must login to continue");
            this.props.alert.show("you must login to continue");
        }
    }
    render() {
        return (
            <div>
                    <div >
                        <span style={{color:"green", fontSize:"20px",textAlign:"right"}}>Food Search</span>
                    </div>
                <div className="input-group mb-3">
                   
                    <input type="text" ref="title" onChange={e => this.searchText(e.target.value)} className="form-control" id="basic-url" aria-describedby="basic-addon3" />
                </div>
                {this.state.search.length > 0 ? (
                    <div className="row" style={{backgroundColor:" #80ffd4"}}>
                    {/* <br/> */}
                        {this.state.foodList.filter(f => f.food_name.toLowerCase().replace(/\s/g, '').includes(this.state.search.toLowerCase().replace(/\s/g, ''))).map((o,index) =>
                           
                           <div className="col-sm-3" key={this.state.foodList.food_id} key={index}>
                                {/* {o?(
                                    <div> */}
                                <img src={o.food_image} width="55%" height="45%" alt="" />
                               
                                <div className="item-info-product ">
                                   
                                    <h4>
                                        <p >{o.food_name}</p>
                                    </h4>
                                    
                                    <div className="info-product-price">
                                        <button type="button" className="btn btn-primary" onClick={() => this.cart(o)}>
                                            Order
                                        </button>
                                    </div>
                                    
                                </div>
                                {/* </div>
                                ):(<p>No data match</p>)} */}
                            </div>
                        )}

                    </div>
                ) : []}
            </div>
        )
    }
}
export default withAlert(Search);