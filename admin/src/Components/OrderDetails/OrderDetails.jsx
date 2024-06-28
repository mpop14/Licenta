import React, { useEffect, useState } from 'react';
import './OrderDetails.css';

const OrderDetails = ({ products }) => {
    const [all_product, setAll_Product] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
            .then(response => response.json())
            .then(data => setAll_Product(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);
    return (
        <div className='order-details'>
            <div className="order-details-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
            </div>
            <hr />
            {all_product.map((product, index) => {
                if (products[index] > 0) {
                    return (
                        <div key={index}>
                            <div className="order-details-format order-details-format-main">
                                <img src={product.image} alt="" className='order-details-product-icon' />
                                <p>{product.name}</p>
                                <p>${product.new_price}</p>
                                <button className='order-details-quantity'>{products[index]}</button>
                                <p>${product.new_price * products[index]}</p>
                            </div>
                            <hr />
                        </div>
                    );
                } else {
                    return null;
                }
            })}
        </div>
    );
};

export default OrderDetails;
