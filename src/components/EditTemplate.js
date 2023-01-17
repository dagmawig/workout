import React, { useState } from 'react';
import './EditTemplate.css';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateTemp } from './workoutSlice';
import { useNavigate } from 'react-router-dom';
var bodyParts = require('../exerBody.json');
var exercisesLocal = require('../exercisesLocal.json');

function EditTemplate() {
    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    let template = stateSelector.templateArr[state.index];
    const [tempName, updateName] = useState(template.name);
    const [exerciseList, updateExerList] = useState(template.exerList);
    const [filterArr, updateFilter] = useState(exercisesLocal);
    const [selectedExer, updateSelExer] = useState('3/4 sit-up');

    function handleChange(value) {
        document.getElementById('exer-edit-list').selectedIndex = 0;
        let tempArr = (value === 'empty') ? exercisesLocal : exercisesLocal.filter(ele => ele.bodyPart === value)
        updateFilter(tempArr);
        updateSelExer(tempArr[0].name);
    }

    function handleSel(value) {
        updateSelExer(value);
    }

    function saveTemp() {
        if (!tempName.split(' ').join('')) alert('enter wolrkout template name');
        else if (stateSelector.templateArr.filter((ele, i) => ele.name === tempName && i !== state.index).length !== 0) alert('workout template name already exist. use a different template name.');
        else if (exerciseList.length === 0) alert('add at least one exercise')
        else {
            let workoutTemp = {
                name: tempName,
                exerList: JSON.parse(JSON.stringify(exerciseList))
            }
            let newTempArr = JSON.parse(JSON.stringify(stateSelector.templateArr));
            newTempArr[state.index] = workoutTemp;

            dispatch(updateTemp(newTempArr));
            navigate('/workout', { replace: true })
        }
    }

    function saveTempModal() {
        if (!tempName.split(' ').join('')) alert('enter wolrkout template name');
        else if (stateSelector.templateArr.filter((ele, i) => ele.name === tempName && i !== state.index).length !== 0) alert('workout template name already exist. use a different template name.');
        else if (exerciseList.length === 0) alert('add at least one exercise')
        else {
            let workoutTemp = {
                name: tempName,
                exerList: JSON.parse(JSON.stringify(exerciseList))
            }
            let newTempArr = JSON.parse(JSON.stringify(stateSelector.templateArr));
            newTempArr[state.index] = workoutTemp;

            dispatch(updateTemp(newTempArr));
            window.$('#saveModal').modal('hide');
            navigate('/workout', { replace: true })
        }
    }

    function noSaveModal() {
        window.$('#saveModal').modal('hide');
        navigate('/workout', { replace: true })
    }

    function openSaveModal() {
        window.$('#saveModal').modal('show');
    }

    function addExer() {
        if (selectedExer === 'empty') alert('please select exercise');
        else if (exerciseList.filter(ele => ele.name === selectedExer).length !== 0) alert(`${selectedExer} already exists in template. Pick a different exercise.`);
        else {
            let exer = JSON.parse(JSON.stringify(exercisesLocal.filter(ele => ele.name === selectedExer)[0]));
            exer.sets = 4;
            let tempList = JSON.parse(JSON.stringify(exerciseList));
            tempList.push(exer);
            updateExerList(tempList);
            window.$('#exerModal').modal('hide');
        }
    }

    function removeExer(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        tempList.splice(index, 1);
        updateExerList(tempList);
    }

    function addSet(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        tempList[index].sets++;
        updateExerList(tempList);
    }

    function removeSet(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        if (tempList[index].sets > 1) tempList[index].sets--;
        updateExerList(tempList);
    }

    function exerListEle() {
        return exerciseList.map((item, i) => {
            return (
                <div className='newtemplate_exer_ele row' key={i + 'exerListEle'}>
                    <div className='newtemplate_exer_ele_header row'>
                        <div className='newtemplate_exer_name col-10'>
                            <b>{item.name}</b>
                        </div>
                        <div className='newtemplate_exer_remove col-2' align='right'>
                            <button className="remove_button fa-solid fa-x" value={i} onClick={e => removeExer(e.target.value)}></button>
                        </div>
                    </div>
                    <div className='newtemplate_exer_ele_content row'>
                        <div className='newtemplate_exer_set_header row'>
                            <div className='newtemplate_set col-2'>
                                <div className='newtemplate_set_text row'>
                                    <p className='col-12 text-center'>SET</p>
                                </div>
                            </div>
                            <div className='newtemplate_prev col-4'>
                                <div className='newtemplate_prev_text row'>
                                    <p className='col-12 text-center'>PREV</p>
                                </div>
                            </div>
                            <div className='newtemplate_lbs col-3'>
                                <div className='newtemplate_lbs_text row'>
                                    <p className='col-12 text-center'>{(item.metric === 'wr') ? 'LBS' : (item.metric === 'dt' ? 'MILES' : 'SECONDS')}</p>
                                </div>
                            </div>
                            <div className='newtemplate_reps col-3'>
                                <div className='newtemplate_reps_text row'>
                                    <p className='col-12 text-center'>{item.metric === 'wr' ? 'REPS' : item.metric === 'dt' ? 'MIN' : ''}</p>
                                </div>
                            </div>
                            {/* <div className='newtemplate_reps_remove col-2'>
                                <div className='newtemplate_reps_space row'>
                                    <p className='col-12 text-center'></p>
                                </div>
                            </div> */}
                        </div>
                        {setList(item, i)}
                    </div>
                    <div className='newtemplate_reps_add_set row'>
                        <div className='newtemplate_rep_add_button row'>
                            <div className='newtemplate_prev col-4'>
                            </div>
                            {item.sets > 1 ? <button className='newtemplate_add_button col-3' align='center' value={i} onClick={() => removeSet(i)} >- SET</button> : null}
                            <button className='newtemplate_add_button col-3' value={i} onClick={e => addSet(e.target.value)} >+ SET</button>
                            <div className='newtemplate_prev col-2'>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    function setList(exer, index) {
        let tempArr = [...Array(exer.sets).keys()];
        return tempArr.map(item => {
            return (
                <div className='newtemplate_exer_set_content row' key={item + exer.name + 'setList'}>
                    <div className='newtemplate_set col-2'>
                        <div className='newtemplate_set_val row'>
                            <p className='col-12 text-center'>{item + 1}</p>
                        </div>
                    </div>
                    <div className='newtemplate_prev col-4'>
                        <div className='newtemplate_prev_val row'>
                            <p className='col-12 text-center'>-</p>
                        </div>
                    </div>
                    <div className='newtemplate_lbs col-3'>
                        <div className='newtemplate_lbs_val row'>
                            <input className='lbs_input' disabled style={{ 'opacity': '.5' }}></input>
                        </div>
                    </div>
                    <div className='newtemplate_reps col-3'>
                        <div className='newtemplate_reps_val row'>
                            {exer.metric === 'wr' || exer.metric === 'dt' ? <input className='reps_input' disabled style={{ 'opacity': '.5' }}></input> : null}
                        </div>
                    </div>
                    {/* <div className='newtemplate_reps_remove col-2'>
                        <div className='newtemplate_reps_button row'>
                            {(item !== 0) ? <button className="reps_remove_button fa-solid fa-minus" value={index} onClick={e => removeSet(e.target.value)}></button> : <></>}
                        </div>
                    </div> */}
                </div>
            )
        })
    }

    function openExercise() {
        window.$('#exerModal').modal('show');
    }

    function optionsList() {
        return filterArr.map((item, i) => {
            return (
                <option value={item.name} className='small' key={i + 'option'} style={{ 'fontWeight': 'bold' }}>{item.name}</option>
            )
        })
    }

    function filterList() {
        return bodyParts.map((item, i) => {
            return (
                <option value={item} className='small' key={i + 'option'} style={{ 'fontWeight': 'bold' }}>{item}</option>
            )
        })
    }

    return (
        <div className='newtemplate container'>
            <div className='newtemplate_header row'>
                <div className='newtemplate_header_x col-2'>
                    <button className="x_button"><i className="fa-solid fa-xmark fa-2x" onClick={() => openSaveModal()}></i></button>
                </div>
                <div className='newtemplate_content_title col-8'>
                    <p className='temp_header_text'>Edit template</p>
                </div>
                <div className='newtemplate_content_save col-2' align='right'>
                    <button className="save_button" onClick={saveTemp}><i className="fa-solid fa-floppy-disk fa-2x"></i></button>
                </div>
            </div>
            <div className='newtemplate_content row'>
                <div className='newtemplate_content_form row'>
                    <div className='newtemplate_content_header row'>
                        <div className='newtemplate_content_name col-8'>
                            <input className="form-control newtemplate_name_input" type="text" placeholder="Enter Workout Name" defaultValue={tempName} onChange={e => updateName(e.target.value)} />
                        </div>
                    </div>
                    <div className='newtemplate_exer_list row'>
                        {exerListEle()}
                    </div>
                    <div className='newtemplate_content_add row'>
                        <div className='newtemplate_content_add_button row'>
                            <button className='newtemplate_add_button col-6' onClick={openExercise}>ADD EXERCISE</button>
                        </div>
                    </div>
                    <div className="modal" id='exerModal' tabIndex="-1" aria-hidden={true}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-success">
                                    <h5 className="modal-title"><b>Add Exercise</b></h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                        <b style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>Filter by:</b>
                                    </div>
                                    <div className='newtemplate_filter_select'>
                                        <select className='select form-select select_filter' aria-label='Default select' id='filter' style={{ 'fontWeight': 'bold', 'backgroundColor': 'rgb(125, 149, 90)' }} onChange={e => handleChange(e.target.value)}>
                                            <option defaultValue={true} className='small' value='empty' style={{ 'fontWeight': 'bold' }}>Select (All)</option>
                                            {filterList()}
                                        </select>
                                    </div>
                                    <div className='select_exer_title' style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>
                                        {filterArr.length} Total Exercises
                                    </div>
                                    <select className="select select_exer form-select" id='exer-edit-list' size={10} onChange={e => handleSel(e.target.value)} defaultValue={filterArr[0].name}>
                                        {optionsList()}
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>Close</b></button>
                                    <button type="button" className="btn btn-primary" onClick={addExer}><b>Add</b></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal" id='saveModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-success">
                            <h5 className="modal-title"><b>Save Template?</b></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                <b style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>You may have made changes to template. Do you want to save them?</b>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={noSaveModal}><b>No</b></button>
                            <button type="button" className="btn btn-primary" onClick={saveTempModal}><b>Yes</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTemplate;