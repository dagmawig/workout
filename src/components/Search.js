import React, { useState, useEffect } from 'react';
import './Search.css';
import { useDispatch } from 'react-redux';
import { updateLoading, updateUserData } from './workoutSlice';
import axios from 'axios';
var muscles = require('../exerMuscle.json');
var exerciseNames = require('../exerciseNames.json');
var bodyParts = require('../exerBody.json');
var exercisesLocal = require('../exercisesLocal.json');

function Search() {

    const dispatch = useDispatch();
    const [filter, updateFilter] = useState(null);
    const [disable, updateDisable] = useState(true);
    const [exerFilter, updateExer] = useState(exercisesLocal);
    const [hidden, updateHidden] = useState(true);
    const[myRef] = useState(React.createRef());

    function optionsList(list) {
        return list.map((item, i) => {
            return (
                <option value={item} className='small' key={i + 'option'}>{item}</option>
            )
        })
    }

    function exercisesList(list) {
        return list.map((item, i) => {
            return (
                <div className='row exercise' key={i + 'exer'}>
                    <div className='col-7 search_text'>
                        <div className='row text'>
                            <div className='row first'>
                            <div className='col-12 name'><b>Workout {`${i+1}/${list.length}`}</b></div>
                            <div className='col-12 name_value'>{item.name}</div>
                            </div>
                            <div className='row second'>
                            <div className='col-12 body'><b>Body Part</b></div>
                            <div className='col-12 body_value'>{item.bodyPart}</div>
                            </div>
                            <div className='row third'>
                            <div className='col-12 equipment'><b>Equipment</b></div>
                            <div className='col-12 equip_value'>{item.equipment}</div>
                            </div>
                            <div className='row fourth'>
                            <div className='col-12 target'><b>Target</b></div>
                            <div className='col-12 target_value'>{item.target}</div>
                            </div>
                            
                        </div>
                    </div>
                    <div className='col-5 search_gif'>
                        <img src={'/images/' + item.localUrl} style={{backgroundColor: 'white'}} alt="my-gif" />
                    </div>
                </div>
            )
        })
    }

    function handleChange(value) {
        updateFilter(value);
        document.getElementById('option').selectedIndex = 0;
        updateExer([])
        if (value === 'empty') {
            updateDisable(true);
            updateHidden(true);
            updateExer(exercisesLocal);
        }
        else {
            updateDisable(false);
            updateHidden(false);
        }
    }

    function handleChangeOpt(value) {
        myRef.current.scrollTo(0, 0);
        
        if (filter === 'Body Part') updateExer(exercisesLocal.filter(exer => exer.bodyPart === value));
        else if (filter === 'Muscle Group') updateExer(exercisesLocal.filter(exer => exer.target === value))
        else if (filter === 'Workout Name') updateExer(exercisesLocal.filter(exer => exer.name === value))
        else updateExer([]);
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
        <div className="search container">
            <div className='row search_select'>
                <div className='row filter'>
                    <div className='col-4'>
                        <b>Filter By:</b>
                    </div>
                    <div className='col-8'>
                        <select className='form-select' aria-label='Default select' id='filter' onChange={e => handleChange(e.target.value)}>
                            <option defaultValue={true} className='small' value='empty'>Select (All)</option>
                            <option value='Body Part' className='small'>Body Part</option>
                            <option value='Muscle Group' className='small'>Muscle Group</option>
                            <option value='Workout Name' className='small'>Workout Name</option>
                        </select>
                    </div>
                </div>
                <div className='row options' hidden={hidden}>
                    <div className='col-4'>
                        <b>Options:</b>
                    </div>
                    <div className='col-8'>
                        <select className='form-select' id='option' aria-label='Default select' disabled={disable} onChange={e => handleChangeOpt(e.target.value)}>
                            <option defaultValue={true} className='small' value='empty'>Select</option>
                            {(filter === 'Body Part') ? optionsList(bodyParts) : ((filter === 'Muscle Group') ? optionsList(muscles) : optionsList(exerciseNames))}
                        </select>
                    </div>
                </div>

            </div>
            <div ref={myRef} className='row search_exercises'>
                {exercisesList(exerFilter)}
            </div>
        </div>
    )
}

export default Search;