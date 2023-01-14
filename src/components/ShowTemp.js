import React, { useState } from 'react';
import './ShowTemp.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateTemp } from './workoutSlice';

function ShowTemp() {

    const stateSelector = useSelector(state => state.workout);
    const { state } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [exercise, updateExer] = useState('');

    let template = (state.user) ? stateSelector.templateArr[state.index] : stateSelector.fixTempArr[state.index];

    function deleteTemp() {
        let tempArr = [...stateSelector.templateArr];
        tempArr.splice(state.index, 1);
        dispatch(updateTemp(tempArr));
        navigate('/workout', { replace: true })
        window.$('#delTempModal').modal('hide');
    }

    function editTemp() {
        navigate('/edittemp', { replace: true, state: { user: true, index: state.index } });

    }

    function toWorkout() {
        navigate('/logworkout', { replace: true, state: { user: true, index: state.index } });
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
                        <button className="edit_button" onClick={openDelModal} ><i className="fa-solid fa-trash fa-2x"></i></button>
                    </div></>) : null}
            </div>
            <div className='showtemp_content row'>
                <div className='showtemp_content_form row'>
                    <div className='showtemp_content_title col-12'>
                        <p className='row showtemp_header_text text-right'>{template.name}</p>
                    </div>
                    <div className='showtemp_content_time col-12'>
                        <p className='row showtemp_header_last text-left'>Last performed: 2 days ago</p>
                    </div>
                    <div className='showtemp_content_exer col-12'>
                        {exerEle()}
                    </div>
                    <div className='newtemplate_content_add_button row'>
                        <button className='newtemplate_add_button col-6' onClick={toWorkout}>START WORKOUT</button>
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
                                <b style={{ 'fontSize': '12pt', 'fontWeight': '550' }}>Are you sure you want to delete <span style={{ 'fontSize': '15pt' }}>{template.name}</span>?</b>
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