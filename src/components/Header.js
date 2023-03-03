import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateLoading, updateUserData } from './workoutSlice';
import axios from "axios";

function Header() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // logs off user from app
    function logOff() {
        localStorage.setItem("workout_userID", '');
        navigate('/', { replace: true });
        window.location.reload();
    }

    // opens reset modal
    function showReset() {
        window.$('#resetModal').modal('show');
    }

    // shows log off modal
    function showLogOff() {
        window.$('#logOffModal').modal('show');
    }

    // updates user data with reset account
    async function resetD() {
        let updateURI = process.env.REACT_APP_API_URI + 'resetData';
        let res = await axios.post(updateURI, { userID: localStorage.getItem("workout_userID") }).catch(err => console.log(err));

        return res;
    }

    // resets user account
    function resetData() {

        dispatch(updateLoading(false));
        resetD().then(res => {
            let data = res.data;
            console.log(data.success)

            if (data.success) {
                dispatch(updateUserData(data.data));
                localStorage.setItem("workout_comp", "workout");
                window.location.reload();
                alert(`Workout data reset successfully!`);
                window.$('#resetModal').modal('hide');
                dispatch(updateLoading(false));
            }
            else {
                dispatch(updateLoading(false));
                alert(`${data.err}`)
            }
        })
    }

    return (
        <div className="header container" style={{ backgroundColor: '#873e23' }}>
            <div className='header_row text-center row'>
                <div className='header_reset col-3' align='left'>
                    <button className="footer_button" onClick={showReset}><i className={`fa-solid fa-rotate-left fa`}></i></button>
                </div>
                <div className='header_title col-6'>
                    WORKOUT
                </div>
                <div className='header_login col-3' align='right'>
                    <button className="footer_button" onClick={showLogOff}><i className={`fa-solid ${localStorage.getItem("workout_userID") ? 'fa-power-off' : 'fa-user'} fa`}></i></button>
                </div>
            </div>
            <div className="modal" id='resetModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><b>Reset Account</b></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                <b style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>Do you want to reset your account? This would delete all workout data.</b>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>No</b></button>
                            <button type="button" className="btn" onClick={resetData} style={{ backgroundColor: '#9e5f2f' }}><b>Yes</b></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id='logOffModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><b>Logoff</b></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                <b style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>Do you want to log out?</b>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>No</b></button>
                            <button type="button" className="btn" onClick={logOff} style={{ backgroundColor: '#9e5f2f' }}><b>Yes</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;