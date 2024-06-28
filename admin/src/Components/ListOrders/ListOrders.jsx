import React, { useEffect, useState } from 'react';
import ReactDOM, { render } from 'react-dom';

import './ListOrders.css';
import complete_icon from '../../assets/logo.png'; // Icon for completing the order
import cart_icon from '../../assets/cart_icon.png'; // Icon for displaying order items
import OrderDetails from '../OrderDetails/OrderDetails';

const ListOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allorders').then((res) => res.json()).then((data) => {
      setAllOrders(data.filter(order => !order.isComplete));
    });
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const completeOrder = async (id) => {
    await fetch('http://localhost:4000/completeOrder', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    });
    await fetchInfo();
  }

  const showOrderItems = (items) => {
    const orderWindow = window.open('', '_blank', 'width=800,height=600');
  
    // Write HTML content with inline styles
    orderWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f0f0f0;
            }
            .order-details{
  margin: 100px 170px;
}

.order-details hr{
  height: 3px;
  background: #e2e2e2;
  border: 0;
}

.order-details-format-main{
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr 1fr 1fr 1fr;
  align-items: center;
  gap: 75px;
  padding: 20px 0px;
  color: #454545;
  font-size: 18px;
  font-weight: 600;
}

.order-details-format{
  font-size: 17px;
  font-weight: 500;
}

.order-details-product-icon{
  height: 62px;
}

.order-details-remove-icon{
  width: 15px;
  margin: 0px 40px;
  cursor: pointer;
}

.order-details-quantity{
  width: 64px;
  height: 50px;
  border: 2px solid #ebebeb;
  background: #fff;
}

.order-details-down{
  display: flex;
  margin: 100px 0px;
}

.order-details-total{
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 200px;
  gap: 40px;
}

.order-details-total-item{
  display: flex;
  justify-content: space-between;
  padding: 15px 0px;
}

.order-details-total button{
  width: 262px;
  height: 58px;
  outline: none;
  border: none;
  background: #ff5a5a;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.order-details-promocode{
  flex: 1;
  font-size: 16px;
  font-weight: 500;
}

.order-details-promocode p{
  color: #555;
}

.order-details-promobox{
  width: 504px;
  margin-top: 15px;
  padding-left: 20px;
  height: 58px;
  background: #eaeaea;
}

.order-details-promobox input{
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  width: 330px;
  height: 50px;
}

.order-details-promobox button{
  width: 170px;
  height: 58px;
  font-size: 16px;
  background: black;
  color: white;
  cursor: pointer;
}

@media(max-width:1280px){
  .order-details{
      margin: 60px 50px;
  }

  .order-details-format-main{
      grid-template-columns: 0.5fr 3fr 0.5fr 0.5fr 0.5fr 0.5fr;
      gap: 20px;
      padding: 15px 0px;
      font-size: 15px;
  }

  .order-details-product-icon {
      height: 50px;
  }

  .order-details-remove-icon{
      margin: auto;
  }

  .order-details-quantity{
      width: 40px;
      height: 30px;
  }

  .order-details-down{
      margin: 80px 0px;
      flex-direction: column;
      gap: 80px;
  }

  .order-details-total{
      margin: 0;
  }

  .order-details-total button{
      max-width: 200px;
      height: 45px;
      font-size: 13px;
  }

  .order-details-promobox{
      width: auto;
      max-width: 500px;
  }

  .order-details-promobox input{
      width: 100%;
  }

  .order-details-promobox button{
      width: 120px;
      margin-left: -125px;
  }
}

@media(max-width:1024px){}

@media(max-width:800px){}

@media(max-width:500px){
  .order-details-format-main{
      display: none;
      grid-template-columns: 0.5fr 3fr 0.5fr;
      gap: 10px;
  }

  .order-details-format{
      display: grid;
  }
}
          </style>
        </head>
        <body>
          <div class='cartitems'>
            <!-- Content to be filled in dynamically -->
          </div>
        </body>
      </html>
    `);
  
    orderWindow.document.close();
  
    const rootElement = orderWindow.document.createElement('div');
    rootElement.id = 'order-root';
    orderWindow.document.body.appendChild(rootElement);
  
    // Now render your React component into the new window
    ReactDOM.render(<OrderDetails products={items} />, rootElement);
  }
  


  return (
    <div className='list-orders'>
      <h1>Orders List</h1>
      <div className="listorders-format-main">
        <p>Name</p>
        <p>Telephone</p>
        <p>Address</p>
        <p>View Items</p>
        <p>Complete Order</p>
      </div>
      <div className="listorders-allorders">
        <hr />
        {allOrders.map((order, index) => (
          <div key={index} className="listorders-format-main listorders-format">
            <p>{order.cardName}</p>
            <p>{order.telephone}</p>
            <p>{order.address}</p>
            <img onClick={() => showOrderItems(order.cartItems)} src={cart_icon} alt="View Items" className="listorders-view-icon" />
            <img onClick={() => completeOrder(order._id)} src={complete_icon} alt="Complete Order" className="listorders-complete-icon" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListOrders;
