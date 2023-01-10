import React, { useState } from 'react';
import './ShowTemp.css';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateTemp } from './workoutSlice';

function ShowTemp() {

    const stateSelector = useSelector(state => state.workout);
    const { state } = useLocation();
    console.log(state)
    let template = (state.user) ? stateSelector.templateArr[state.index] : stateSelector.fixTempArr[state.index];

    function exerEle() {
        return template.exerList.map((item, i) => {
            return (
                <div className="row text-left" key={i + template.name}>
                    <div className='showtemp_exer_name col-10'>
                        {item.sets} X {item.name}
                    </div>
                    <div className='showtemp_exer_gif col-2' align='right'>
                        <button className="gif_button" ><i className="fa-solid fa-question fa"></i></button>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className='showtemp container'>
            <div className='showtemp_header row' style={{'justifyContent': (state.user)? 'space-between' : 'left' }}>
                <div className='showtemp_header_back col-2'>
                    <Link to='/workout'>
                        <button className="back_button"><i className="fa-solid fa-arrow-left fa-2x"></i></button></Link>
                </div>
                {(state.user)?(<><div className='showtemp_content_edit col-2 align-self-center' align='right'>
                    <button className="edit_button" ><i className="fa-solid fa-pen-to-square fa-2x"></i></button>
                </div>
                <div className='showtemp_content_delete col-2 align-self-center' align='right'>
                    <button className="edit_button" ><i className="fa-solid fa-trash fa-2x"></i></button>
                </div></>) : null}
            </div>
            <div className='showtemp_content row'>
                <div className='showtemp_content_form row'>
                    <div className='showtemp_content_title col-12'>
                        <p className='row showtemp_header_text text-right'>Template 1</p>
                    </div>
                    <div className='showtemp_content_time col-12'>
                        <p className='row showtemp_header_last text-left'>Last performed: 2 days ago</p>
                    </div>
                    <div className='showtemp_content_exer col-12'>
                        {exerEle()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowTemp;