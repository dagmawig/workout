import React, { useEffect } from 'react';
import './Workout.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateLoading, updateUserData } from './workoutSlice';
import axios from 'axios';

function Workout() {

    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function toTemp(i) {
        navigate('/showtemp', { replace: true, state: { user: true, index: i } })
    }
    function toFixTemp(i) {
        navigate('/showtemp', { replace: true, state: { user: false, index: i } })
    }

    function toNewTemp() {
        if (localStorage.getItem("workout_userID")) {
            navigate('/template', { replace: true })
        }
        else {
            window.$('#loginModal').modal('show');
        }
    }

    function toLogin() {
        window.$('#loginModal').modal('hide');
        navigate('/login', { replace: true });

    }

    function calcTime(template) {
        let arr = template.workoutTimeArr;
        if (arr.length === 0) return 'Never';
        let lastTime = new Date(arr[arr.length - 1]).getTime();
        let hourDiff = Math.floor((new Date().getTime() - lastTime) / (1000 * 3600));
        return (hourDiff < 24) ? `${hourDiff} hour(s) ago` : `${Math.floor(hourDiff / 24)} day(s) ago`;
    }

    function templateEle(tempArr, userTemp) {
        return tempArr.map((item, i) => {
            return (
                <button className='template_button col-12' key={`${item.name}+${i}+${(userTemp) ? 'user' : 'fixed'}`} value='user' onClick={(userTemp) ? (e => toTemp(i)) : (e => toFixTemp(i))}>
                    <div className='template_content col-12'>
                        <div className='template_content_header row'>
                            <p className="row" style={{ 'height': '26px', 'fontWeight': 'bold', 'fontSize': '16pt' }}>{item.name}</p>
                        </div>
                        <div className='template_content_time row'>
                            Last performed: {calcTime(item)}
                        </div>
                        <div className='template_content_exer row'>
                            {tempExerEle(item, userTemp)}
                        </div>
                    </div>
                </button>
            )
        })
    }

    function tempExerEle(template, userTemp) {
        return template.exerList.map((item, i) => {
            return (
                <div className="row text-left" style={{ 'width': '100%', 'padding': 0 }} key={`${template.name}+${i}+${(userTemp) ? 'user' : 'fixed'}`}>
                    <div className='showtemp_exer_name col-12' align='left'>{item.sets} X {item.name}</div></div>
            )
        })
    }

    useEffect(() => {
        async function loadData() {
            let loadURI = process.env.REACT_APP_API_URI + 'loadData';
            let res = await axios.post(loadURI, { userID: localStorage.getItem("workout_userID") });

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
        <div className='workout container'>
            <div className='workout_content row'>
                <div className='workout_templates row'>
                    <div className='template_header col-12'>
                        <div className='template_header_row row'>
                            <div className='template_title col-10'>
                                <p className="row text-left">MY TEMPLATES</p>
                            </div>
                            <div className='template_add d-flex col-2'>
                                    <button className="plus_button"><i className="fa fa-plus  fa-2x" onClick={toNewTemp}></i></button>
                            </div>
                        </div>
                    </div>
                    {templateEle(stateSelector.userData.templateArr, true)}
                </div>
                <div className='workout_samples row'>
                    <div className='template_header col-12>'>
                        <div className='template_header_row row'>
                            <div className='template_title col-12'>
                                <p className="row text-left">SAMPLE TEMPLATES</p>
                            </div>
                        </div>
                    </div>
                    {templateEle(stateSelector.userData.fixTempArr, false)}
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
                            <button type="button" className="btn" onClick={toLogin} style={{backgroundColor: '#9e5f2f'}}><b>Yes</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Workout;