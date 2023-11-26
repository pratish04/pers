import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import "./Navbar.css";

const Navbar=()=>{

    const navigate=useNavigate();

    return (
        <div className='navbar'>
            
            <div onClick={()=>{navigate('/upload-products')}}>upload products</div>
            <div onClick={()=>{navigate('/view-products')}}>view products</div>
        </div>
    );
};

export default Navbar;