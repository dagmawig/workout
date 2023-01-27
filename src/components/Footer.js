import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className='footer container' style={{backgroundColor: '#873e23'}}>
            <div className='footer_row row'>
                <div className='footer_search col-4'>
                    <Link to="/">
                        <button className="footer_button"><i className="fa-solid fa-dumbbell fa-2x"></i></button>
                    </Link>
                </div>
                <div className='footer_profile col-4'>
                    <Link to="/workout">
                        <button className="footer_button"><i className="fa fa-plus fa-2x"></i></button>
                    </Link>
                </div>
                <div className='footer_profile col-4'>
                    <Link to="/history">
                        <button className="footer_button"><i className="fa fa-clock-rotate-left fa-2x"></i></button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Footer;