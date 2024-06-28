import React from 'react'

import './Navbar.css'
import navlogo from '../../assets/logo_big.png'
import navProfile from '../../assets/hand_icon.png'

export const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={navlogo} alt="" className="nav-logo" />
        <img src={navProfile} className='nav-profile' alt="" />
    </div>
  )
}
export default Navbar