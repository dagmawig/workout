import React, { useState, useEffect } from 'react';
import './PassReset.css';
import { Link } from 'react-router-dom';
import { auth } from './FirebaseConfig';
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { updateLoading } from './workoutSlice';
import { useDispatch } from 'react-redux';


function Reset() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    function goHome() {
        navigate('/', { replace: true });
    }

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
                        <button type="submit" className="reset_pass btn" style={{ backgroundColor: 'rgb(179, 119, 71)' }} onClick={goHome}>
                            Explore App Without Login <i className="fa-solid fa-mobile"></i>
                        </button>
                    <br /><br />
                    <div>
                        <Link to="/signup">
                            New user? Create account here.
                        </Link>
                    </div>
                    <div>
                        <Link id="login_link" to="/login">
                            Remember password? Sign in here.
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Reset;