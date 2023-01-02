import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <div className='footer container bg-success'>
            <div className='footer_row row'>
                <div className='footer_search col-6'>
                    <button className="footer_button"><i className="fa fa-search fa-2x"></i></button>
                </div>
                <div className='footer_profile col-6'>
                    <button className="footer_button"><i className="fa fa-dumbbell fa-2x"></i></button>
                </div>
            </div>
        </div>
    )
}

export default Footer;