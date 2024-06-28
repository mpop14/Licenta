import React, {createContext, useEffect, useState} from "react";

//import all_product from '../Components/Assets/all_product'

export const ShopContext = createContext(null);
 //initializare cos de cumparaturi
const getDefaultCart = () => {
    let cart = {};
    //momentan n avem o referinta la cate elemente vor fi pe site deci adaugam default minim spatiu de 300
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        fetch('http://localhost:4000/allproducts').then((response) => response.json()).then((data) => setAll_Product(data))

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json'
                },
                body:"",
            }).then((response) =>response.json()).then((data) => setCartItems(data));
        }
    },[])

    const addToCart = (itemId) => {
        setCartItems((prev)=>({...prev, [itemId]:prev[itemId]+1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"itemId":itemId}),
            }).then((response) =>response.json()).then((data) => console.log(data));
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev)=>({...prev, [itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"itemId":itemId}),
            }).then((response) =>response.json()).then((data) => console.log(data));
        }
    }

    const getTotalCartAmount = () => {
        let TotalAmount = 0;
        for (let item in cartItems){
            if(cartItems[item] > 0){
                let itemInfo = all_product.find((product)=> product.id === Number(item));
                TotalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return TotalAmount;
    }

    const getTotalCartItems = () => {
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item] > 0){
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const resetCartItems = () => {
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/resetcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json'
                },
                body:"",
            }).then(response => response.json())
              .then(data => console.log(data));
        }
    };

    //toate intrarile pentru a le pasa si a ne putea face utile operatiile de sortare
    const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart, resetCartItems};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;