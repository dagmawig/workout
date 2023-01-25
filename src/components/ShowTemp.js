import React, { useEffect, useState } from 'react';
import './ShowTemp.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateTemp, updateLoading, updateUserData } from './workoutSlice';
import axios from 'axios';

function ShowTemp() {

    const stateSelector = useSelector(state => state.workout);
    const { state } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [exercise, updateExer] = useState('');

    let template = (state.user) ? stateSelector.userData.templateArr[state.index] : stateSelector.userData.fixTempArr[state.index];
    async function saveTemplate(newTempArr) {
        let updateURI = process.env.REACT_APP_API_URI + 'updateTemp';
        let res = await axios.post(updateURI, { userID: localStorage.getItem("workout_userID"), templateArr: newTempArr }).catch(err => console.log(err));
        return res;
    }

    function deleteTemp() {
        let name = template.name;
        let tempArr = JSON.parse(JSON.stringify(stateSelector.userData.templateArr));
        tempArr.splice(state.index, 1);

        dispatch(updateLoading(true));
        saveTemplate(tempArr).then(res => {
            let data = res.data;
            if (data.success) {
                navigate('/workout', { replace: true });
                dispatch(updateTemp(data.data.templateArr));
                window.$('#delTempModal').modal('hide');
                alert(`Template ${name} deleted successfully!`)
                dispatch(updateLoading(false));
            } else {
                dispatch(updateLoading(false));
                alert(`${data.err}`)
            }
        })
    }

    function editTemp() {
        localStorage.setItem("workout_index", state.index);
        navigate('/edittemp', { replace: true, state: { user: true, index: state.index } });
    }

    function calcTime(template) {
        let arr = template.workoutTimeArr;
        if (arr.length === 0) return 'Never';
        let lastTime = new Date(arr[arr.length - 1]).getTime();
        let hourDiff = Math.floor((new Date().getTime() - lastTime) / (1000 * 3600));
        return (hourDiff < 24) ? `${hourDiff} hours ago` : `${Math.floor(hourDiff / 24)} day(s) ago`;
    }

    function toWorkout(user) {
        navigate('/logworkout', { replace: true, state: { user: user, index: state.index } });
    }

    function openDelModal() {
        window.$('#delTempModal').modal('show');
    }

    function showDetail(exer) {
        updateExer(exer);
        window.$('#exerDetModal').modal('show');
    }

    window.$("#exerDetModal").on("hidden.bs.modal", function () {
        updateExer('')
    });

    function exerEle() {
        if (template === undefined) return null;
        return template.exerList.map((item, i) => {
            return (
                <div className="row text-left" key={i + template.name}>
                    <div className='showtemp_exer_name col-10'>
                        {item.sets} X {item.name}
                    </div>
                    <div className='showtemp_exer_gif col-2' align='right'>
                        <button className="gif_button" onClick={e => showDetail(item)} ><i className="fa-solid fa-question fa"></i></button>
                    </div>
                </div>
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
        <div className='showtemp container'>
            <div className='showtemp_header row' style={{ 'justifyContent': (state.user) ? 'space-between' : 'left' }}>
                <div className='showtemp_header_back col-2'>
                    <Link to='/workout'>
                        <button className="back_button"><i className="fa-solid fa-arrow-left fa-2x"></i></button></Link>
                </div>
                {(state.user) ? (<><div className='showtemp_content_edit col-2 align-self-center' align='right'>
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
                        <button className='newtemplate_add_button col-6' onClick={() => toWorkout(state.user)}>START WORKOUT</button>
                    </div>
                </div>
            </div>
            <div className="modal" id='delTempModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-success">
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
                        <div className="modal-header bg-success">
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
                                    <img src={'/images/' + exercise.localUrl} style={{ backgroundColor: 'white' }} alt="my-gif" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>Close</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowTemp;