import React from 'react';
import './Workout.css';
import { Link } from 'react-router-dom';

function Workout() {
    return (
        <div className='workout container'>
            {/* <div className='workout_title row'>
                Workouts
            </div> */}
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
                    <button className='template_button col-12'>
                        <div className='template_content col-12'>
                            <div className='template_content_header row'>
                                <div className='template_content_title col-10'>
                                    <p className="row text-left">Template 1</p>
                                </div>
                            </div>
                            <div className='template_content_time row text-left'>
                                Last performed: 3 days ago
                            </div>
                            <div className='template_content_exer row'>
                                <p className="row text-left">3 X Squat (Barbell)</p>
                                <p className="row text-left">3 X Leg Extension (Machine)</p>
                                <p className="row text-left">3 Flat Leg Raise</p>
                            </div>
                        </div>
                    </button>
                    <button className='template_button col-12'>
                        <div className='template_content col-12'>
                            <div className='template_content_header row'>
                                <div className='template_content_title col-10'>
                                    <p className="row text-left">Template 1</p>
                                </div>
                            </div>
                            <div className='template_content_time row text-left'>
                                Last performed: 3 days ago
                            </div>
                            <div className='template_content_exer row'>
                                <p className="row text-left">3 X Squat (Barbell)</p>
                                <p className="row text-left">3 X Leg Extension (Machine)</p>
                                <p className="row text-left">3 Flat Leg Raise</p>
                            </div>
                        </div>
                    </button>
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