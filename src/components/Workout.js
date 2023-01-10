import React from 'react';
import './Workout.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Workout() {

    const stateSelector = useSelector(state => state.workout);
    const navigate = useNavigate();

    function toTemp(i) {
        navigate('/showtemp', { replace: true, state: { user: true, index: i } })
    }

    function templateEle() {
        return stateSelector.templateArr.map((item, i) => {
            return (
                <button className='template_button col-12' key={i + item.name} value='user' onClick={e => toTemp(i)}>
                    <div className='template_content col-12'>
                        <div className='template_content_header row'>
                            <p className="row" style={{'height': '26px', 'fontWeight': 'bold', 'fontSize': '16pt'}}>{item.name}</p>
                        </div>
                        <div className='template_content_time row'>
                            Last performed: 3 days ago
                        </div>
                        <div className='template_content_exer row'>
                            {tempExerEle(item)}
                        </div>
                    </div>
                </button>
            )
        })
    }

    function tempExerEle(template) {
        return template.exerList.map((item, i) => {
            return (
                <p className="row text-left" key={i + template.name}>{item.sets} X {item.name}</p>
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
                    {templateEle()}
                </div>
                <div className='workout_samples row'>
                    <div className='template_header col-12>'>
                        <div className='template_header_row row'>
                            <div className='template_title col-12'>
                                <p className="row text-left">SAMPLE TEMPLATES</p>
                            </div>
                        </div>
                    </div>
                    <button className='template_button col-12'>
                        <div className='template_content col-12'>
                            <div className='template_content_header row'>
                                <div className='template_content_title col-10'>
                                    <p className="row text-left">Back and Biceps</p>
                                </div>
                            </div>
                            <div className='template_content_time row text-left'>
                                Last performed: 4 days ago
                            </div>
                            <div className='template_content_exer row'>
                                <p className="row text-left">3 X Deadlift (Barbell)</p>
                                <p className="row text-left">3 X Seated Row (Cable)</p>
                                <p className="row text-left">3 X Lat Pulldown (Cable)</p>
                                <p className="row text-left">3 X Bicep Curl (Barbell)</p>
                            </div>
                        </div>
                    </button>
                    <button className='template_button col-12'>
                        <div className='template_content col-12'>
                            <div className='template_content_header row'>
                                <div className='template_content_title col-10'>
                                    <p className="row text-left">Strong 5X5 -Workout A</p>
                                </div>
                            </div>
                            <div className='template_content_time row text-left'>
                                Last performed: 4 days ago
                            </div>
                            <div className='template_content_exer row'>
                                <p className="row text-left">5 X Squat (Barbell)</p>
                                <p className="row text-left">5 X Bench Press (Barbell)</p>
                                <p className="row text-left">5 X Bent Over Row (Barbell)</p>
                            </div>
                        </div>
                    </button>
                    <button className='template_button col-12'>
                        <div className='template_content col-12'>
                            <div className='template_content_header row'>
                                <div className='template_content_title col-10'>
                                    <p className="row text-left">Strong 5X5 -Workout B</p>
                                </div>
                            </div>
                            <div className='template_content_time row text-left'>
                                Last performed: 4 days ago
                            </div>
                            <div className='template_content_exer row'>
                                <p className="row text-left">5 X Squat (Barbell)</p>
                                <p className="row text-left">5 X Overhead Press (Barbell)</p>
                                <p className="row text-left">1 X Deadlift (Barbell)</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Workout;