import React, {useState} from 'react';
import './Search.css';
var muscles = require('../exerMuscle.json');
var exerciseNames = require('../exerciseNames.json');
var bodyParts = require('../exerBody.json');

function Search() {
    const [filter, updateFilter] = useState(null);
    const [disable, updateDisable] = useState(true);
    function optionsList(list) {
        return list.map((item, i) => {
            return (
                <option value={item} className='small' key ={i+'option'}>{item}</option>
            )
        })
    }

    function handleChange(value) {
        updateFilter(value);
        if(value==='empty') updateDisable(true);
        else updateDisable(false);
    }

    return (
        <div className="search container">
            <div className='row search_select'>
                <div className='col-4'>
                    Search By :
                </div>
                <div className='col-8'>
                   <select className='form-select' aria-label='Default select' id='filter' onChange={e=>handleChange(e.target.value)}>
                    <option defaultValue={true} className='small' value='empty'>Select</option>
                    <option value='Body Part' className='small'>Body Part</option>
                    <option value='Muscle Group' className='small'>Muscle Group</option>
                    <option value='Workout Name' className='small'>Workout Name</option>
                   </select>
                </div>
                <div className='col-4'>
                    Options :
                </div>
                <div className='col-8'>
                <select className='form-select' aria-label='Default select' disabled={disable}>
                    <option defaultValue={true} className='small'>Select</option>
                    {(filter==='Body Part')? optionsList(bodyParts) : ((filter==='Muscle Group')? optionsList(muscles) : optionsList(exerciseNames))}
                   </select>
                </div>
            </div>
        </div>
    )
}

export default Search;