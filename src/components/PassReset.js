import React, { useState, useEffect } from 'react';
import './PassReset.css';
import { auth } from './FirebaseConfig';
import { updateLoading } from './workoutSlice';
import { useDispatch } from 'react-redux';


function Reset() {

    const dispatch = useDispatch();
    const [email, getEmail] = useState('');

    // function handling user password reset
    const resetPass = (e) => {

        e.preventDefault();

        auth.sendPasswordResetEmail(email).then(() => {
            alert(`Password reset link sent to ${email}.`);
            getEmail("");
            document.getElementById("login_link").click();
        }).catch(err => alert(err.message));
    }

    // reroutes to signup page
    function toSignUp() {
        localStorage.setItem("workout_comp", "signup");
        window.location.reload();
    }

    // reroutes to login page
    function toLogin() {
        localStorage.setItem("workout_comp", "login");
        window.location.reload();
    }

    // disables loading component
    useEffect(() => {
        dispatch(updateLoading(false))
    }, []);

    return (
        <div className="reset row">
            <div className="reset_form col-sm-5">
                <form>
                    <h3>Workout App</h3>
                    <h4>Reset Password</h4>
                    <br />
                    <div className="form-group">
                        <label htmlFor="email"><b>Email</b></label>
                        <input type="email" className="form-control" placeholder="email" onChange={(e) => getEmail(e.target.value)} style={{ backgroundColor: 'rgb(179, 165, 153)' }}></input>
                    </div>
                    <br />
                    <button type="submit" onClick={resetPass} className="reset_pass btn" style={{ backgroundColor: 'rgb(179, 119, 71)' }}>
                        Reset Password <i className="fa fa-key"></i>
                    </button>
                    <br /><br />
                    <div>
                        <a href='' onClick={toSignUp}>
                            New user? Create account here.
                        </a>
                    </div>
                    <div>
                        <a href='' onClick={toLogin}>
                            Remember password? Sign in here.
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Reset;