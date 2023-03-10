import React, { useState, useEffect } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';
import { auth } from './FirebaseConfig';
import { useNavigate } from 'react-router-dom';

function SignUp() {

    const navigate = useNavigate();
    const [email, getEmail] = useState('');
    const [password, getPassword] = useState('');
    const [valid] = useState(null);

    // function handling user sign up
    const signUp = (e) => {
        e.preventDefault();

        if (valid) return;

        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {

                let user = auth.currentUser;
                user.sendEmailVerification()
                    .then(function () {
                        auth.signOut().then(() => {
                            alert(`Verification link sent to ${email}. \n Please click on the link to verify your email and log into your acount.`);
                            navigate('/', { replace: true });
                        }).catch(err => console.log(err))

                    }).catch(function (e) {
                        alert(e);
                    });
            })
            .catch((error) => alert(error));
    }

    // reroutes to password reset page
    function toReset() {
        localStorage.setItem("workout_comp", "reset");
        window.location.reload();
    }

    // reroutes to login page
    function toLogin() {
        localStorage.setItem("workout_comp", "login");
        window.location.reload();
    }

    // reroutes to home page when user is logged in
    useEffect(() => {
        if (localStorage.getItem("workout_userID")) {
            navigate('/', { replace: true })
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
                        <input type="email" className="form-control" placeholder="email" size="22" onChange={(e) => getEmail(e.target.value)} style={{ backgroundColor: 'rgb(179, 165, 153)' }}></input>
                    </div>
                    <br />
                    <div className="form-group">
                        <label htmlFor="password"><b>Password</b></label>
                        <input type="password" className="form-control " placeholder="password" size="22" onChange={(e) => getPassword(e.target.value)} style={{ backgroundColor: 'rgb(179, 165, 153)' }}></input>
                    </div>
                    <br />
                    <button type="submit" onClick={signUp} className="sign_up_button btn btn-warning" style={{ backgroundColor: 'rgb(179, 119, 71)' }}>
                        <Link to={(valid) ? "/" : "/signup"} className="signUp_link" id="signup">
                            Sign Up <i className="fa fa-user-plus"></i>
                        </Link>
                    </button>
                    <br /><br />
                    <div>
                        <a href='' onClick={toLogin}>
                            Existing user? Sign in here.
                        </a>
                    </div>
                    <div>
                        <a href='' onClick={toReset} >
                            Forgot password? Reset password here.
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;