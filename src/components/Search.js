import React, {useState} from 'react';
import './Search.css';
var muscles = require('../exerMuscle.json');
var exerciseNames = require('../exerciseNames.json');
var bodyParts = require('../exerBody.json');
var exercisesLocal = require('../exercisesLocal.json');

function Search() {

    const [filter, updateFilter] = useState(null);
    const [disable, updateDisable] = useState(true);
    const [exerFilter, updateExer] = useState([]);
    const [hidden, updateHidden] = useState(true);

    function optionsList(list) {
        return list.map((item, i) => {
            return (
                <option value={item} className='small' key ={i+'option'}>{item}</option>
            )
        })
    }

    function exercisesList(list) {
        return list.map((item, i) => { 
            return (
                <div className='row exercise' key={i+'exer'}>
                    <div className='col-6 search_text'>
                        <div className='row text'>
                            <div className='col-6 name'>Workout Name</div>
                            <div className='col-6 name_value'>{item.name}</div>
                            <div className='col-6 body'>Body Part</div>
                            <div className='col-6 body_value'>{item.bodyPart}</div>
                            <div className='col-6 equipment'>Equipment</div>
                            <div className='col-6 equip_value'>{item.equipment}</div>
                            <div className='col-6 target'>Target</div>
                            <div className='col-6 target_value'>{item.target}</div>
                        </div>
                    </div>
                    <div className='col-6 search_gif'>
                    <img src={'/images/'+item.localUrl} alt="my-gif" />
                    </div>
                </div>
            )
        })
    }

    function handleChange(value) {
        updateFilter(value);
        document.getElementById('option').selectedIndex = 0;
        updateExer([])
        if(value==='empty') {
            updateDisable(true);
            updateHidden(true);
        }
        else {
            updateDisable(false);
            updateHidden(false);
        }
    }

    function handleChangeOpt(value) {
        if(filter==='Body Part') updateExer(exercisesLocal.filter(exer=>exer.bodyPart===value));
        else if(filter==='Muscle Group') updateExer(exercisesLocal.filter(exer=>exer.target===value))
        else if(filter==='Workout Name') updateExer(exercisesLocal.filter(exer=>exer.name===value))
        else updateExer([]);
    }

    return (
        <div className="search container">
            <div className='row search_select'>
                <div className='row filter'>
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
                </div>
                <div className='row options' hidden={hidden}>
                <div className='col-4'>
                    Options :
                </div>
                <div className='col-8'>
                <select className='form-select' id='option' aria-label='Default select' disabled={disable} onChange={e=>handleChangeOpt(e.target.value)}>
                    <option defaultValue={true} className='small' value='empty'>Select</option>
                    {(filter==='Body Part')? optionsList(bodyParts) : ((filter==='Muscle Group')? optionsList(muscles) : optionsList(exerciseNames))}
                   </select>
                </div>
                </div>
                
            </div>
            <div className='row search_exercises'>
                {exercisesList(exerFilter)}
            </div>
        </div>
    )
}

export default Search;