import React from 'react';
import './Footer.css';

function Footer() {

    function toWork() {
        localStorage.setItem("workout_comp", 'workout');
        window.location.reload();
    }

    function toHistory() {
        localStorage.setItem("workout_comp", 'history');
        window.location.reload();
    }

    function toHome() {
        localStorage.setItem("workout_comp", 'home');
        window.location.reload();
    }

    return (
        <div className='footer container' style={{ backgroundColor: '#873e23' }}>
            <div className='footer_row row'>
                <div className='footer_search col-4'>
                    <button className="footer_button" onClick={toHome}><i className="fa-solid fa-dumbbell fa-2x"></i></button>
                </div>
                <div className='footer_profile col-4'>
                    <button className="footer_button" onClick={toWork}><i className="fa fa-plus fa-2x"></i></button>
                </div>
                <div className='footer_profile col-4'>
                    <button className="footer_button" onClick={toHistory}><i className="fa fa-clock-rotate-left fa-2x"></i></button>
                </div>
            </div>
        </div>
    )
}

export default Footer;