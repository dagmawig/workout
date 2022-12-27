import React from 'react';
import './Search.css';
var muscles = require('../exerMuscle.json');
var exercises = require('../exercises.json')
var bodyParts = require('../exerBody.json')


function Search() {
    function handleSelect(e) {
        console.log("e.value")
    }
    return (
        <div className="search container">
            <div className='row search_select'>
                <div className='col-4'>
                    Search By :
                </div>
                <div className='col-8'>
                   <select className='form-select' aria-label='Default select'>
                    <option defaultValue={true} className='small'>Select</option>
                    <option value='1' className='small'>Body Part</option>
                    <option value='2' className='small'>Muscle Group</option>
                    <option value='3' className='small'>Workout Name</option>
                   </select>
                </div>
                <div className='col-4'>
                    Options :
                </div>
                <div className='col-8'>
                    Options
                </div>
            </div>
        </div>
    )
}

export default Search;