import React from 'react';
import './Workout.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
var exercisesLocal = require('../exercisesLocal.json');

function Workout() {

    const stateSelector = useSelector(state => state.workout);
    const navigate = useNavigate();

    function toTemp(i) {
        navigate('/showtemp', { replace: true, state: { user: true, index: i } })
    }
    function toFixTemp(i) {
        navigate('/showtemp', { replace: true, state: { user: false, index: i } })
    }

    function calcTime(template) {
        let arr = template.workoutTimeArr;
        if(arr.length===0) return 'Never';
        let lastTime = new Date(arr[arr.length-1]).getTime();
        let hourDiff = Math.floor((new Date().getTime() - lastTime)/(1000*3600));
        return (hourDiff<24)? `${hourDiff} hours ago`: `${Math.floor(hourDiff/24)} day(s) ago`;
    }

    function templateEle(tempArr, userTemp) {
        return tempArr.map((item, i) => {
            return (
                <button className='template_button col-12' key={`${item.name}+${i}+${(userTemp)? 'user' : 'fixed'}`} value='user' onClick={(userTemp)? (e => toTemp(i)) : (e => toFixTemp(i))}>
                    <div className='template_content col-12'>
                        <div className='template_content_header row'>
                            <p className="row" style={{'height': '26px', 'fontWeight': 'bold', 'fontSize': '16pt'}}>{item.name}</p>
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
                <p className="row text-left" key={`${template.name}+${i}+${(userTemp)? 'user' : 'fixed'}`}>{item.sets} X {item.name}</p>
            )
        })
    }

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
                                <Link to="/template">
                                    <button className="plus_button"><i className="fa fa-plus  fa-2x"></i></button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {templateEle(stateSelector.templateArr, true)}
                </div>
                <div className='workout_samples row'>
                    <div className='template_header col-12>'>
                        <div className='template_header_row row'>
                            <div className='template_title col-12'>
                                <p className="row text-left">SAMPLE TEMPLATES</p>
                            </div>
                        </div>
                    </div>
                    {templateEle(stateSelector.fixTempArr, false)}
                </div>
            </div>
        </div>
    )
}

export default Workout;