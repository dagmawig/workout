import React, { useState } from 'react';
import './NewTemplate.css';
import { Link } from 'react-router-dom';
var exercisesLocal = require('../exercisesLocal.json');
var exerciseNames = require('../exerciseNames.json');
var bodyParts = require('../exerBody.json');

function NewTemplate() {

    const [filterArr, updateFilter] = useState(exercisesLocal);
    const [exerciseList, updateExerList] = useState([]);
    const [selectedExer, updateSelExer] = useState('empty');

    function handleChange(value) {
        document.getElementById('exer-list').selectedIndex = 0;
        let tempArr = (value === 'empty') ? exercisesLocal : exercisesLocal.filter(ele => ele.bodyPart === value)
        updateFilter(tempArr);
    }

    function handleSel(value) {
        updateSelExer(value);
    }

    function addExer() {
        if (selectedExer === 'empty') alert('please select exercise');
        else if (exerciseList.filter(ele => ele.name === selectedExer).length !== 0) alert(`${selectedExer} already exists in template. Pick a different exercise.`);
        else {
            let exer = exercisesLocal.filter(ele => ele.name === selectedExer)[0];
            exer.sets = 4;
            let tempList = [...exerciseList];
            tempList.push(exer);
            updateExerList(tempList);
            window.$('#exerciseModal').modal('hide');
        }
    }

    function removeExer(index) {
        console.log('it clicks', index)
        exerciseList.splice(index,1);
        updateExerList([...exerciseList]);
    }

    function addSet(index) {
        let tempList = [...exerciseList];
        tempList[index].sets++;
        updateExerList(tempList);
    }

    function removeSet(index) {
        let tempList = [...exerciseList];
        tempList[index].sets--;
        updateExerList(tempList);
    }

    function openExercise() {
        window.$('#exerciseModal').modal('show');
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
                            <button className="remove_button fa-solid fa-x" value={i} onClick={e=>removeExer(e.target.value)}></button>
                        </div>
                    </div>
                    <div className='newtemplate_exer_ele_content row'>
                        <div className='newtemplate_exer_set_header row'>
                            <div className='newtemplate_set col-2'>
                                <div className='newtemplate_set_text row'>
                                    <p className='col-12 text-center'>SET</p>
                                </div>
                            </div>
                            <div className='newtemplate_prev col-2'>
                                <div className='newtemplate_prev_text row'>
                                    <p className='col-12 text-center'>PREV</p>
                                </div>
                            </div>
                            <div className='newtemplate_lbs col-3'>
                                <div className='newtemplate_lbs_text row'>
                                    <p className='col-12 text-center'>LBS</p>
                                </div>
                            </div>
                            <div className='newtemplate_reps col-3'>
                                <div className='newtemplate_reps_text row'>
                                    <p className='col-12 text-center'>REPS</p>
                                </div>
                            </div>
                            <div className='newtemplate_reps_remove col-2'>
                                <div className='newtemplate_reps_space row'>
                                    <p className='col-12 text-center'></p>
                                </div>
                            </div>
                        </div>
                        {setList(item, i)}
                    </div>
                    <div className='newtemplate_reps_add_set row'>
                        <div className='newtemplate_rep_add_button row'>
                            <button className='newtemplate_add_button col-6' value={i} onClick={e=>addSet(e.target.value)} >ADD SET</button>
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
                    <div className='newtemplate_prev col-2'>
                        <div className='newtemplate_prev_val row'>
                            <p className='col-12 text-center'>-</p>
                        </div>
                    </div>
                    <div className='newtemplate_lbs col-3'>
                        <div className='newtemplate_lbs_val row'>
                            <input className='lbs_input'></input>
                        </div>
                    </div>
                    <div className='newtemplate_reps col-3'>
                        <div className='newtemplate_reps_val row'>
                            <input className='reps_input'></input>
                        </div>
                    </div>
                    <div className='newtemplate_reps_remove col-2'>
                        <div className='newtemplate_reps_button row'>
                           {(item!==0)? <button className="reps_remove_button fa-solid fa-minus" value={index} onClick={e=>removeSet(e.target.value)}></button> : <></>} 
                        </div>
                    </div>
                </div>
            )
        })
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
                    <Link to='/workout'>
                        <button className="x_button"><i className="fa-solid fa-xmark fa-2x"></i></button></Link>
                </div>
                <div className='newtemplate_content_title col-8'>
                    <p className='temp_header_text'>New workout template</p>
                </div>
                <div className='newtemplate_content_save col-2'>
                    <button className="save_button"><i className="fa-solid fa-floppy-disk fa-2x"></i></button>
                </div>
            </div>
            <div className='newtemplate_content row'>
                <div className='newtemplate_content_form row'>
                    <div className='newtemplate_content_header row'>
                        <div className='newtemplate_content_name col-8'>
                            <input className="form-control newtemplate_name_input" type="text" placeholder="Enter Workout Name" />
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
                    <div className="modal" id='exerciseModal' tabIndex="-1" aria-hidden={true}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-success">
                                    <h5 className="modal-title"><b>Add Exercise</b></h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                        <b>Filter by:</b>
                                    </div>
                                    <div className='newtemplate_filter_select'>
                                        <select className='select form-select select_filter' aria-label='Default select' id='filter' style={{ 'fontWeight': 'bold', 'backgroundColor': 'rgb(125, 149, 90)' }} onChange={e => handleChange(e.target.value)}>
                                            <option defaultValue={true} className='small' value='empty' style={{ 'fontWeight': 'bold' }}>Select (All)</option>
                                            {filterList()}
                                        </select>
                                    </div>
                                    <select className="select select_exer form-select" id='exer-list' size={10} onChange={e => handleSel(e.target.value)}>
                                        <option defaultValue={true} className='small option_exer' value='empty' style={{ 'fontWeight': 'bold', 'textDecoration': 'underline', 'fontSize': '15pt'}}>{filterArr.length} Total Exercises</option>
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
        </div>
    )
}

export default NewTemplate; 