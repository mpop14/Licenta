import React, { useContext, useState } from 'react';
import './CSS/Payment.css';
import { ShopContext } from '../Context/ShopContext';

const Payment = () => {
    const { getTotalCartAmount, cartItems, resetCartItems } = useContext(ShopContext);

    const [formData, setFormData] = useState({
        telephone: "",
        address: "",
        cardNumber: "",
        cvv: "",
        expiration: "",
        cardName: "",
        cartItems: cartItems,
        total: Number(getTotalCartAmount()),
    });

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const payment = async () => {
        console.log("Payment", formData);
        try {
            if(formData.telephone==="" || formData.address===""|| formData.cardNumber===""|| formData.cvv===""|| formData.expiration===""|| formData.cardName===""){
                alert("Complecteaza toate campurile!");
                return;
            }
            if(!localStorage.getItem('auth-token')){
                alert("You must be loged in before proceeding to checkout!");
                return;
            }
            const response = await fetch('http://localhost:4000/payment', {
                method: "POST",
                headers: {
                    Accept:'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const responseData = await response.json();
            if (responseData.success) {
                resetCartItems(); // Resetează coșul de cumpărături după succesul plății
                alert("Tranzactie cu succes!")
                window.location.replace("/");
            } else {
                alert(responseData.errors);
            }
        } catch (error) {
            console.error("Error during payment:", error);
            alert("Error during payment. Please try again later.");
        }
    };

    return (
        <div className='payment'>
            <div className="payment-container">
                <h1>Payment of ${formData.total}</h1>
                <div className="payment-fields">
                    <input name='telephone' value={formData.telephone} onChange={changeHandler} type="text" placeholder='Telephone' />
                    <input name='address' value={formData.address} onChange={changeHandler} type="text" placeholder='Address' />
                    <input name='cardNumber' value={formData.cardNumber} onChange={changeHandler} type="text" placeholder='Card Number' />
                    <input name='cvv' value={formData.cvv} onChange={changeHandler} type="text" placeholder='CVV' />
                    <input name='expiration' value={formData.expiration} onChange={changeHandler} type="text" placeholder='Expiration Date (dd/MM)' />
                    <input name='cardName' value={formData.cardName} onChange={changeHandler} type="text" placeholder='Card Name' />
                </div>
                <button onClick={payment}>Complete Payment</button>
            </div>
        </div>
    );
};

export default Payment;
