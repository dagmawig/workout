import React, { useState } from 'react';
import './NewTemplate.css';
import { Link } from 'react-router-dom';
var exercisesLocal = require('../exercisesLocal.json');
var exerciseNames = require('../exerciseNames.json');
var bodyParts = require('../exerBody.json');

function NewTemplate() {

    const [filterArr, updateFilter] = useState(exercisesLocal);

    function handleChange(value) {
        document.getElementById('exer-list').selectedIndex = 0;
        let tempArr = (value==='empty')? exercisesLocal : exercisesLocal.filter(ele=>ele.bodyPart===value)
        updateFilter(tempArr);
    }

    function openExercise() {
        console.log("ittt")
        window.$('#exerciseModal').modal('show');
    }

    function optionsList() {
        return filterArr.map((item, i) => {
            return (
                <option value={item.name} className='small' key={i + 'option'}><b>{item.name}</b></option>
            )
        })
    }

    function filterList() {
        return bodyParts.map((item, i) => {
            return (
                <option value={item} className='small' key={i + 'option'}><b>{item}</b></option>
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
                    <div className='newtemplate_content_add row'>
                        <div className='newtemplate_content_add_button row'>
                            <button className='newtemplate_add_button col-6' onClick={openExercise}>ADD EXERCISE</button>
                        </div>
                    </div>
                    <div className="modal" id='exerciseModal' tabindex="-1" aria-hidden={true}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-success">
                                    <h5 className="modal-title"><b>Add Exercise</b></h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className='newtemplate_filter_text' style={{'marginBottom': '5px'}}>
                                        <b>Filter by:</b>
                                    </div>
                                    <div className='newtemplate_filter_select'>
                                        <select className='select form-select select_filter' aria-label='Default select' id='filter' style={{'fontWeight': 'bold', 'backgroundColor': 'rgb(125, 149, 90)'}} onChange={e => handleChange(e.target.value)}>
                                            <option defaultValue={true} className='small' value='empty' style={{'fontWeight': 'bold'}}>Select (All)</option>
                                            {filterList()}
                                        </select>
                                    </div>
                                    <select className="select select_exer form-select" id='exer-list' size={10}>
                                        <option defaultValue={true} className='small option_exer' value='empty' style={{'fontWeight': 'bold'}}>{filterArr.length} Total Exercises</option>
                                        {optionsList()}
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>Close</b></button>
                                    <button type="button" className="btn btn-primary"><b>Add</b></button>
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