import React from 'react';
import Navbar from './navbar';

const BaseCompents = ({children} :any) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default BaseCompents;