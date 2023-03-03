import React, { useState, useEffect } from 'react';
import './Login.css';
import { useDispatch } from 'react-redux';
import { auth } from './FirebaseConfig';
import { updateUserID } from './workoutSlice';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, getEmail] = useState('');
    const [password, getPassword] = useState('');

    // signs in user using firebase authentication
    function signIn(e) {
        e.preventDefault();

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {

                let user = auth.currentUser;

                if (user.emailVerified) {

                    localStorage.setItem("workout_userID", user.uid);
                    localStorage.setItem("workout_email", email);
                    localStorage.setItem("workout_comp", 'home');

                    dispatch(updateUserID(user.uid));

                    window.location.reload();
                }
                else {
                    user.sendEmailVerification().then(() => {
                        alert(`Email not verified.\nVerification link sent to ${email}.\nPlease verify your email.`);
                    });

                    auth.signOut().then(() => {
                    }).catch(err => console.log(err))
                }
            }).catch((error) => alert(error.message));
    }

    // reroutes user to password reset page
    function toReset() {
        localStorage.setItem("workout_comp", "reset");
        window.location.reload();
    }

    // reroutes user to sign up page
    function toSignUp() {
        localStorage.setItem("workout_comp", "signup");
        window.location.reload();
    }

    // reroutes page to user account if user is logged in
    useEffect(() => {
        if (localStorage.getItem("workout_userID")) {
            navigate('/', { replace: true })
        }
    }, []);

    return (
        <div className='login row'>
            <div className="login_form col-sm-5">
                <form>
                    <h4>Welcome To Workout App</h4>
                    <br />
                    <div className="form-group">
                        <label htmlFor="email"><b>Email</b></label>
                        <input type="email" className="form-control sign" placeholder="email" size="22" onChange={(e) => getEmail(e.target.value)} style={{ backgroundColor: 'rgb(179, 165, 153)' }}></input>
                    </div>
                    <br />
                    <div className="form-group">
                        <label htmlFor="password"><b>Password</b></label>
                        <input type="password" className="form-control sign" placeholder="password" size="22" onChange={(e) => getPassword(e.target.value)} style={{ backgroundColor: 'rgb(179, 165, 153)' }}></input>
                    </div>

                    <br />
                    <button type="submit" onClick={signIn} className="login_signIn btn" style={{ backgroundColor: 'rgb(179, 119, 71)' }}>
                        Sign In <i className="fa fa-sign-in"></i>
                    </button>
                    <br /><br />
                    <div>
                        <a href='' onClick={toSignUp}>
                            New user? Create account here.
                        </a>
                    </div>
                    <div>
                        <a href='' onClick={toReset}>
                            Forgot password? Reset password here.
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;