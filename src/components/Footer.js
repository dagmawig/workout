import React from 'react';
import './Footer.css';

function Footer() {

    // reroutes to workout page
    function toWork() {
        localStorage.setItem("workout_comp", 'workout');
        window.location.reload();
    }

    // reroutes to history page
    function toHistory() {
        localStorage.setItem("workout_comp", 'history');
        window.location.reload();
    }

    // reroutes to home page
    function toHome() {
        localStorage.setItem("workout_comp", 'home');
        window.location.reload();
    }

    // reroutes to profile page
    function toProfile() {
        localStorage.setItem("workout_comp", 'profile');
        window.location.reload();
    }

    return (
        <div className='footer container' style={{ backgroundColor: '#873e23' }}>
            <div className='footer_row row'>
                <div className='footer_search col-3'>
                    <button className="footer_button" onClick={toHome}><i className="fa-solid fa-dumbbell fa-2x"></i></button>
                </div>
                <div className='footer_profile col-3'>
                    <button className="footer_button" onClick={toWork}><i className="fa fa-plus fa-2x"></i></button>
                </div>
                <div className='footer_profile col-3'>
                    <button className="footer_button" onClick={toHistory}><i className="fa fa-clock-rotate-left fa-2x"></i></button>
                </div>
                <div className='footer_profile col-3'>
                    <button className="footer_button" onClick={toProfile}><i className="fa-solid fa-user fa-2x"></i></button>
                </div>
            </div>
        </div>
    )
}

export default Footer;