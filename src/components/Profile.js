import React, { useState } from 'react';
import './Profile.css';
import { useDispatch } from 'react-redux';
import { updateLoading, updateUserData } from './workoutSlice';
import axios from 'axios';
import { auth } from './FirebaseConfig';

function Profile() {

    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // updates user data with reset account
    async function resetD() {
        let updateURI = process.env.REACT_APP_API_URI + 'resetData';
        let res = await axios.post(updateURI, { userID: localStorage.getItem("workout_userID") }).catch(err => console.log(err));

        return res;
    }

    function resetAcccount() {
        dispatch(updateLoading(false));
        resetD().then(res => {
            let data = res.data;
            console.log(data.success)

            if (data.success) {
                dispatch(updateUserData(data.data));
                localStorage.setItem("workout_comp", "workout");
                window.location.reload();
                alert(`Workout data reset successfully!`);
                window.$('#resetAccModal').modal('hide');
                dispatch(updateLoading(false));
            }
            else {
                dispatch(updateLoading(false));
                alert(`${data.err}`)
            }
        })
    }

    // deleted user account data
    async function deleteAcc() {
        let updateURI = process.env.REACT_APP_API_URI + 'deleteAccount';
        let res = await axios.post(updateURI, { userID: localStorage.getItem("workout_userID") }).catch(err => console.log(err));

        return res;
    }

    function deleteAcccount() {

        dispatch(updateLoading(true));

        if (localStorage.getItem("workout_email") !== email) {
            alert('Email not correct!');
            window.$('#deleteModal').modal('hide');
            dispatch(updateLoading(false));
        }
        else {
            auth.signInWithEmailAndPassword(email, password).then(() => {

                let user = auth.currentUser;

                deleteAcc().then(res => {
                    let data = res.data;
                    if (data.success) {
                        user.delete().then(() => {
                            localStorage.setItem("workout_userID", "");
                            window.location.reload();
                            alert('User account deleted!!');
                            window.$('#deleteModal').modal('hide');
                            dispatch(updateLoading(false));
                        }).catch(e => {
                            console.log(e);
                            alert(e);
                            dispatch(updateLoading(false));
                            window.$('#deleteModal').modal('hide');
                        })
                    }
                    else {
                        alert('User data deletion failed!');
                        window.$('#deleteModal').modal('hide');
                        dispatch(updateLoading(false));
                    }
                }).catch(e => console.log(e))
            }).catch(e => {
                console.log(e);
                alert(e);
                dispatch(updateLoading(false));
                window.$('#deleteModal').modal('hide');
            })
        }



    }

    function openResetModal() {
        window.$('#resetAccModal').modal('show');
    }

    function openDeleteModal() {
        window.$('#deleteModal').modal('show');
    }

    return (
        <div className="profile container">
            <div className='row profile_header'>
                Profile
            </div>
            <div className='row profile_content'>
                <div className='row profile_content_item'>
                    <div className='row profile_email'>
                        <div className=' col-2'>
                            <i className="fa-solid fa-circle-user fa-3x" style={{ color: '#873e23' }}></i>
                        </div>
                        <div className='col-10'>
                            <p>{localStorage.getItem("workout_email")}</p>
                        </div>
                    </div>
                    <div className='row rest-account'>
                        <button onClick={openResetModal} className='btn btn-warning'><b>Reset Account</b></button>
                    </div>
                    <div className='row delete-account'>
                        <button onClick={openDeleteModal} className='btn btn-danger'><b>Delete Account</b></button>
                    </div>
                </div>
            </div>

            <div className="modal" id='resetAccModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><b>Reset Account?</b></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                <b style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>Are you sure you want to reset account? This would delete all workout data.</b>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>No</b></button>
                            <button type="button" className="btn" onClick={resetAcccount} style={{ backgroundColor: '#9e5f2f' }}><b>Yes</b></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal" id='deleteModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><b>Delete Account?</b></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                <b style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>Are you sure you want to delete account? If so please enter email and password and enter 'Yes'. This can't be undone.</b>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className='row'>
                                <input className='col-11 my-1' type='email' placeholder='email' defaultValue={email} onChange={(e)=>setEmail(e.target.value)} ></input>
                                <input className='col-11 my-1' type='password' placeholder='password' defaultValue={password} onChange={(e)=>setPassword(e.target.value)} ></input>
                            </div>
                            <button type="button" className="btn col-5" onClick={deleteAcccount} style={{ backgroundColor: '#9e5f2f' }}><b>Yes</b></button>

                            <button type="button" className="btn btn-secondary col-5" data-bs-dismiss="modal"><b>Cancel</b></button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;