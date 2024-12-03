import React from 'react';
import Navbar from './navbar';

const BaseCompents = ({children} :any) => {
  return (
    <>
      <Navbar user={null} signOut={() => console.log("singout")}/>
      {children}
    </>
  )
}

export default BaseCompents;