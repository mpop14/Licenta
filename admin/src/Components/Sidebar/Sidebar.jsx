import React from 'react'
import { Link } from 'react-router-dom'

import add_product_icon from '../../assets/cart_icon.png'
import  list_product_icon from '../../assets/cross_icon.png'
import list_order_icon from '../../assets/star_icon.png'
import './Sidebar.css'

export const Sidebar = () => {
    return (
    <div className='sidebar'>
        <Link to={'/addproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={add_product_icon} alt="" />
            <p>Add Candels</p>
        </div>
        </Link>
        <Link to={'/listproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={list_product_icon} alt="" />
            <p>View & Remove Candels</p>
        </div>
        </Link>
        <Link to={'/listorders'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={list_order_icon} alt="" />
            <p>Order List</p>
        </div>
        </Link>
    </div>
    )
}
export default Sidebar