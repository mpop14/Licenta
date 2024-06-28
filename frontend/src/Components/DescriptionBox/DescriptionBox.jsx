import React from 'react'

import './DescriptionBox.css'

export const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Rewiews (102)</div>
        </div>
        <div className="descriptionbox-description">
            <p><strong> High-Quality Hand-Poured Soy Candles</strong>
           
            </p>
            <p>
            Discover the elegance and warmth of our premium candles, crafted to elevate your home ambiance. Each candle is meticulously hand-poured using premium soy wax, ensuring a clean and long-lasting burn. Our unique fragrances are designed to infuse your space with a sense of calm and luxury, creating an inviting atmosphere for any occasion.
            </p>
        </div>
    </div>
  )
}
export default DescriptionBox