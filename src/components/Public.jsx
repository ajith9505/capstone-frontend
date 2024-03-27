import { Link } from "react-router-dom";

import React from 'react'

const Public = () => {
  return (
    <div className="public-container">
      <h1>Welcome to Pettycash Manager</h1>

      <div>
        <p>
          Petty cash management is the careful handling and controlling of a small amount of cash that a business keeps for minor daily expenses. It involves organizing, tracking, and documenting the usage of this fund to maintain financial accuracy and accountability.
        </p>
      </div>

      <div className="link-container">
        <div className="link me-2">
          <Link id="login" to='login'>Login</Link>
        </div>
        <div className="link ms-2">
          <Link id="register" to='register'>Register</Link>
        </div>
      </div>

    </div>
  )
}

export default Public