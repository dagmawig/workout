import React, { useEffect, useState } from 'react';
import './ShowTemp.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateTemp, updateLoading, updateUserData } from './workoutSlice';
import axios from 'axios';

function ShowTemp() {

    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();
    const [exercise, updateExer] = useState('');

    // defines selected exercise template
    let template = (localStorage.getItem("workout_user") === 'true') ? stateSelector.userData.templateArr[localStorage.getItem("workout_index")] : stateSelector.userData.fixTempArr[localStorage.getItem("workout_index")];

    // updates database with updated exercise template array
    async function saveTemplate(newTempArr) {
        let updateURI = process.env.REACT_APP_API_URI + 'updateTemp';
        let res = await axios.post(updateURI, { userID: localStorage.getItem("workout_userID"), templateArr: newTempArr }).catch(err => console.log(err));
        return res;
    }

    // deletes exercise template
    function deleteTemp() {
        let name = template.name;
        let tempArr = JSON.parse(JSON.stringify(stateSelector.userData.templateArr));
        tempArr.splice(localStorage.getItem("workout_index"), 1);

        dispatch(updateLoading(true));
        saveTemplate(tempArr).then(res => {
            let data = res.data;
            if (data.success) {
                dispatch(updateTemp(data.data.templateArr));
                window.$('#delTempModal').modal('hide');
                localStorage.setItem("workout_comp", "workout");
                window.location.reload();
                alert(`Template ${name} deleted successfully!`);
                dispatch(updateLoading(false));
            } else {
                dispatch(updateLoading(false));
                alert(`${data.err}`)
            }
        })
    }

    // reroutes to workout page
    function toWork() {
        localStorage.setItem("workout_comp", "workout");
        window.location.reload();
    }

    // reroutes to login page
    function toLogin() {
        window.$('#loginModal').modal('hide');
        localStorage.setItem("workout_comp", "login");
        window.location.reload();
    }

    // reroutes to edit template page
    function editTemp() {
        localStorage.setItem("workout_comp", "edittemp");
        window.location.reload();
    }

    // calculates time elapsed since last workout session for a given exercise template
    function calcTime(template) {
        let arr = template.workoutTimeArr;
        if (arr.length === 0) return 'Never';
        let lastTime = new Date(arr[arr.length - 1]).getTime();
        let hourDiff = Math.floor((new Date().getTime() - lastTime) / (1000 * 3600));
        return (hourDiff < 24) ? `${hourDiff} hour(s) ago` : `${Math.floor(hourDiff / 24)} day(s) ago`;
    }

    // reroutes to log workout page
    function toWorkout(user) {
        if (localStorage.getItem("workout_userID")) {
            localStorage.setItem("workout_comp", "logworkout");
            localStorage.setItem("workout_start", Math.floor(Date.now() / 1000));
            localStorage.setItem("localInputState", JSON.stringify(null));
            localStorage.setItem("eList", JSON.stringify(null));
            window.location.reload();
        }
        else {
            window.$('#loginModal').modal('show');
        }
    }

    // opens delete templae modal
    function openDelModal() {
        window.$('#delTempModal').modal('show');
    }

    // opens exercise detail modal
    function showDetail(exer) {
        updateExer(exer);
        window.$('#exerDetModal').modal('show');
    }

    // updates exercise to empty string when exercise detail modal is hidden
    window.$("#exerDetModal").on("hidden.bs.modal", function () {
        updateExer('')
    });

    // returns exercise list component for a given template
    function exerEle() {
        if (template === undefined) return null;
        return template.exerList.map((item, i) => {
            return (
                <div className="row text-left" key={i + template.name}>
                    <div className='showtemp_exer_name col-10'>
                        {item.sets} X {item.name}
                    </div>
                    <div className='showtemp_exer_gif col-2' align='right'>
                        <button className="gif_button" onClick={e => showDetail(item)} ><i className="fa-solid fa-circle-info fa"></i></button>
                    </div>
                </div>
            )
        })
    }

    // reloads data from database
    useEffect(() => {
        async function loadData() {
            let loadURI = process.env.REACT_APP_API_URI + 'loadData';
            let res = await axios.post(loadURI, { userID: localStorage.getItem("workout_userID"), email: localStorage.getItem("workout_email") });

            return res;
        }

        dispatch(updateLoading(true));
        loadData()
            .then(res => {
                let data = res.data;
                if (data.success) {
                    dispatch(updateUserData(data.data));
                    dispatch(updateLoading(false));
                } else {
                    dispatch(updateLoading(false));
                    alert(`${data.err}`)
                }
            })
    }, [])

    return (
        <div className='showtemp container'>
            <div className='showtemp_header row' style={{ 'justifyContent': (localStorage.getItem("workout_user") === 'true') ? 'space-between' : 'left' }}>
                <div className='showtemp_header_back col-2'>
                    <button className="back_button" onClick={toWork}><i className="fa-solid fa-arrow-left fa-2x"></i></button>
                </div>
                {(localStorage.getItem("workout_user") === 'true') ? (<><div className='showtemp_content_edit col-2 align-self-center' align='right'>
                    <button className="edit_button" onClick={editTemp} ><i className="fa-solid fa-pen-to-square fa-2x"></i></button>
                </div>
                    <div className='showtemp_content_delete col-2 align-self-center' align='right'>
                        <button className="edit_button" onClick={openDelModal} ><i className="fa-solid fa-trash fa-2x" style={{ 'color': 'darkred' }}></i></button>
                    </div></>) : null}
            </div>
            <div className='showtemp_content row'>
                <div className='showtemp_content_form row'>
                    <div className='showtemp_content_title col-12'>
                        <p className='row showtemp_header_text text-right'>{(template) ? template.name : 'none'}</p>
                    </div>
                    <div className='showtemp_content_time col-12'>
                        <p className='row showtemp_header_last text-left'>Last performed: {(template) ? calcTime(template) : 'none'}</p>
                    </div>
                    <div className='showtemp_content_exer col-12'>
                        {exerEle()}
                    </div>
                    <div className='newtemplate_content_add_button row'>
                        <button className='newtemplate_add_button col-6' onClick={() => toWorkout(localStorage.getItem("workout_user"))}>START WORKOUT</button>
                    </div>
                </div>
            </div>
            <div className="modal" id='delTempModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" style={{ 'fontWeight': 'bold' }}>Delete Template</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='showtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                <b style={{ 'fontSize': '12pt', 'fontWeight': '550' }}>Are you sure you want to delete <span style={{ 'fontSize': '15pt' }}>{(template) ? template.name : 'none'}</span>?</b>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>Cancel</b></button>
                            <button type="button" className="btn btn-danger" onClick={deleteTemp}><b>Delete</b></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id='exerDetModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" style={{ 'fontWeight': 'bold' }}>Exercise Detail</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='row exercise'>
                                <div className='col-7 search_text'>
                                    <div className='row text'>
                                        <div className='row first'>
                                            <div className='col-12 name'><b>Workout</b></div>
                                            <div className='col-12 name_value'>{exercise.name}</div>
                                        </div>
                                        <div className='row second'>
                                            <div className='col-12 body'><b>Body Part</b></div>
                                            <div className='col-12 body_value'>{exercise.bodyPart}</div>
                                        </div>
                                        <div className='row third'>
                                            <div className='col-12 equipment'><b>Equipment</b></div>
                                            <div className='col-12 equip_value'>{exercise.equipment}</div>
                                        </div>
                                        <div className='row fourth'>
                                            <div className='col-12 target'><b>Target</b></div>
                                            <div className='col-12 target_value'>{exercise.target}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-5 search_gif'>
                                    <img src={process.env.PUBLIC_URL + '/images/' + exercise.localUrl} style={{ backgroundColor: 'white' }} alt="my-gif" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>Close</b></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id='loginModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" style={{ 'fontWeight': 'bold' }}>Log In/Sign Up</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='row login_modal_text'>
                                You need to log in to create a template. Login?
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>No</b></button>
                            <button type="button" className="btn" onClick={toLogin} style={{ backgroundColor: '#9e5f2f' }}><b>Yes</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowTemp;