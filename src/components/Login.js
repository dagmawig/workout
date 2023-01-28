import React, { useState, useEffect } from 'react';
import './Login.css';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { auth } from './FirebaseConfig';
import { updateLoading, updateUserID } from './workoutSlice';
import { signInWithEmailAndPassword, sendSignInLinkToEmail, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function Login() {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, getEmail] = useState('');
    const [password, getPassword] = useState('');

    function signIn(e) {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCred) => {

                let user = userCred.user;

                if (user.emailVerified) {

                    localStorage.setItem("workout_userID", user.uid);
                    localStorage.setItem("workout_email", email);
                    dispatch(updateUserID(user.uid));

                    window.location.reload();
                }
                else {
                    sendSignInLinkToEmail(auth, email).then(() => {
                        alert(`Email not verified.\nVerification link sent to ${email}.\nPlease verify your email.`);
                    });

                    signOut(auth).then(()=>{
                    }).catch(err=>console.log(err))
                }
            }).catch((error) => alert(error.message));
    }

    function goHome() {
        navigate('/', { replace: true });
    }

    useEffect(() => {
        if(document.readyState==='complete') dispatch(updateLoading(false));
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
                        <Link to="/reset">
                            Forgot password? Reset password here.
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;