import React, { useState } from 'react';
import './Login.css';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'

function Login() {

    const dispatch = useDispatch();
    const [email, getEmail] = useState('');
    const [password, getPassword] = useState('');

    function signIn() {

    }

    return (
        <div className='login row'>
             <div className="login_form col-sm-5">
                <form>
                    <h4>Welcome To Workout App</h4>
                    <br />
                    <div className="form-group">
                        <label for="email"><b>Email</b></label>
                        <input type="email" className="form-control sign" placeholder="email" size="22" onChange={(e) => getEmail(e.target.value)} style={{backgroundColor: 'rgb(179, 165, 153)'}}></input>
                    </div>
                    <br />
                    <div className="form-group">
                        <label for="password"><b>Password</b></label>
                        <input type="password" className="form-control sign" placeholder="password" size="22" onChange={(e) => getPassword(e.target.value)} style={{backgroundColor: 'rgb(179, 165, 153)'}}></input>
                    </div>

                    <br />
                    <button type="submit" onClick={signIn} className="login_signIn btn" style={{backgroundColor: 'rgb(179, 119, 71)'}}>
                        Sign In <i className="fa fa-sign-in"></i>
                    </button>
                    <br /><br />
                    <div>
                        <Link to="/signup">
                            <a>New user? Create account here.</a>
                        </Link>
                    </div>
                    <div>
                        <Link to="/reset">
                            <a>Forgot password? Reset password here.</a>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;