import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { auth } from './FirebaseConfig';
import { signOut } from "firebase/auth";


function Header() {

    const navigate = useNavigate();

    function logOff() {
        if (localStorage.getItem("workout_userID")) {

            localStorage.setItem("workout_userID", '');
            window.location.reload();

            signOut(auth).then(()=>{
                navigate('/', { replace: true });
                alert('You are now logged off!');
            }).catch(err=>console.log(err))
 
        }
        else {
            navigate('/login', { replace: true });
        }
    }
    return (
        <div className="header container" style={{ backgroundColor: '#873e23' }}>
            <div className='header_row text-center row'>
                <div className='header_title col-6'>
                    WORKOUT
                </div>
                <div className='header_login col-6' align='right'>
                        <button className="footer_button" onClick={logOff}><i className={`fa-solid ${localStorage.getItem("workout_userID")? 'fa-power-off': 'fa-user'} fa`}></i></button>
                </div>
            </div>
        </div>
    )
}

export default Header;