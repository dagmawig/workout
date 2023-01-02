import React from 'react';
import './Workout.css';


function Workout() {
    return (
        <div className='workout container'>
            <div className='workout_title row'>
                Workouts
            </div>
            <div className='workout_content row'>
                <div className='workout_templates row'>
                    <div className='template_header col-12>'>
                        <div className='template_header_row row'>
                            <div className='template_title col-10'>
                                <p className="row text-left">MY TEMPLATES</p>
                            </div>
                            <div className='template_add d-flex col-2'>
                                <button className="template_button"><i className="fa fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                    <div className='template_content col-12'>
                        <div className='template_content_header row'>
                            <div className='template_content_title col-10'>
                                <p className="row text-left">Template 1</p>
                            </div>
                            <div className='template_edit d-flex col-2'>
                                <button className="template_button"><i className="fa fa-pencil"></i></button>
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
                    <div className='template_content col-12'>
                        <div className='template_content_header row'>
                            <div className='template_content_title col-10'>
                                <p className="row text-left">Template 1</p>
                            </div>
                            <div className='template_edit d-flex col-2'>
                                <button className="template_button"><i className="fa fa-pencil"></i></button>
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
                </div>
                <div className='workout_samples row'>

                </div>
            </div>

        </div>
    )
}

export default Workout;