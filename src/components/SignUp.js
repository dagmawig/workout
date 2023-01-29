import React, { useState, useEffect } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';
import { auth } from './FirebaseConfig';
import { sendSignInLinkToEmail, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { updateLoading } from './workoutSlice';
import { useDispatch } from 'react-redux';

function SignUp() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, getEmail] = useState('');
    const [password, getPassword] = useState('');
    const [valid, isValid] = useState(null);

    // function handling user sign up
    const signUp = (e) => {
        e.preventDefault();

        if (valid) return;

        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {

                let user = auth.currentUser;
                user.sendEmailVerification()
                    .then(function () {
                        auth.signOut().then(()=>{
                            alert(`Verification link sent to ${email}. \n Please click on the link to verify your email and log into your acount.`);
                            navigate('/login', { replace: true });
                        }).catch(err=>console.log(err))
                        
                        //document.getElementById("signup").click();
                    }).catch(function (e) {
                        alert(e);
                    });
            })
            .catch((error) => alert(error));
    }

    function goHome() {
        navigate('/', { replace: true });
    }

    useEffect(() => {
        if(localStorage.getItem("workout_userID")) {
            navigate('/', {replace: true})
        }
    }, []);

    return (
        <div className="sign_up row">
            <div className="sign_up_form col-sm-5">
                <form>
                    <h4>Sign Up For Workout App</h4>
                    <br />

                    <div className="form-group">
                        <label htmlFor="email"><b>Email</b></label>
                        <input type="email" className="form-control" placeholder="email" size="22" onChange={(e) => getEmail(e.target.value)} style={{backgroundColor: 'rgb(179, 165, 153)'}}></input>
                    </div>
                    <br />
                    <div className="form-group">
                        <label htmlFor="password"><b>Password</b></label>
                        <input type="password" className="form-control " placeholder="password" size="22" onChange={(e) => getPassword(e.target.value)} style={{backgroundColor: 'rgb(179, 165, 153)'}}></input>
                    </div>
                    <br/>
                    <button type="submit" onClick={signUp} className="sign_up_button btn btn-warning" style={{backgroundColor: 'rgb(179, 119, 71)'}}>
                        <Link to={(valid) ? "/" : "/signup"} className="signUp_link" id="signup">
                            Sign Up <i className="fa fa-user-plus"></i>
                        </Link>
                    </button>
                    <br /><br />
                        <button type="submit" className="reset_pass btn" style={{ backgroundColor: 'rgb(179, 119, 71)' }} onClick={goHome}>
                            Explore App Without Login <i className="fa-solid fa-mobile"></i>
                        </button>
                    <br /><br />
                    <div>
                        <Link to="/login">
                            Existing user? Sign in here.
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
    );
};

export default SignUp;