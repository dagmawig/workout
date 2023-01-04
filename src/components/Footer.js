import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className='footer container bg-success'>
            <div className='footer_row row'>
                <div className='footer_search col-6'>
                    <Link to="/">
                        <button className="footer_button"><i className="fa fa-dumbbell fa-2x"></i></button>
                    </Link>
                </div>
                <div className='footer_profile col-6'>
                    <Link to="/workout">
                        <button className="footer_button"><i className="fa fa-plus fa-2x"></i></button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Footer;