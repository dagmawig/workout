import React, { useEffect } from 'react';
import './History.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateLoading, updateUserData } from './workoutSlice';
import axios from 'axios';

function History() {
    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();
    let userWorkObj = stateSelector.userData.workoutObj;

    // returns workout history list component
    function historyItem(workoutObj) {
        return Object.keys(workoutObj).sort((a, b) => new Date(b) - new Date(a)).map(key => {
            return (
                <div className='row history_content_item' key={key}>
                    <div className='row history_item_header'>
                        <div className='history_item_name col-7' align='left'>
                            {workoutObj[key].tempName}
                        </div>
                        <div className='history_item_date col-5' align='right'>
                            <div className='history_item_time row'>
                                <div className='col-12'>
                                    <i className="fa-solid fa-calendar-days fa-2xs" style={{ color: 'rgb(67, 12, 12)' }}>{`  ${key.substring(0, 10)}`}</i>
                                </div>
                                {(workoutObj[key].duration) ? <div className='duration col-12'>
                                    <i className="fa-solid fa-hourglass-end fa-2xs" style={{ color: 'rgb(67, 12, 12)' }}> {`  ${new Date(workoutObj[key].duration * 1000).toISOString().substr(11, 8)}`}</i>
                                </div> : null}
                            </div>
                        </div>
                    </div>
                    <div className='history_item_list row'>
                        <div className="accordion" id={`accordionExample-${key}`}>
                            {exerList(workoutObj[key].workoutList, key)}
                        </div>
                    </div>
                </div>
            )

        })
    }

    // returns exercise list component for a given workout session
    function exerList(list, key) {
        return list.map((exer, i) => {
            return (
                <div className="accordion-item" key={`${key}${i}`}>
                    <h2 className="accordion-header" id={`heading-${key}${i}`}>
                        <button className="accordion-button btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${key}${i}`} aria-expanded="true" aria-controls={`collapse-${key}${i}`} style={{ 'fontWeight': 'bold', 'outline': 'none' }}>
                            {exer.metric1.length} X {exer.exerName}
                        </button>
                    </h2>
                    <div id={`collapse-${key}${i}`} className="accordion-collapse collapse" aria-labelledby={`heading-${key}${i}`} data-bs-parent={`#accordionExample-${key}`}>
                        <div className="accordion-body">
                            <div className='history_set_header row'>
                                <div className='history_set col-4' align='center'>
                                    SET
                                </div>
                                <div className='history_set col-4' align='center'>
                                    {exer.metric === 'wr' ? 'LBS' : exer.metric === 'dt' ? 'MILES' : 'SECONDS'}
                                </div>
                                <div className='history_set col-4' align='center'>
                                    {exer.metric === 'wr' ? 'REPS' : exer.metric === 'dt' ? 'MIN' : ''}
                                </div>
                            </div>
                            {setList(exer.metric1, exer.metric2, exer.exerName)}
                        </div>
                    </div>
                </div>
            )
        })
    }

    // returns set list component for a given exercise 
    function setList(metric1, metric2, exerName) {
        return metric1.map((val, i) => {
            return (
                <div className='history_set_content row' key={`${exerName}${i}`}>
                    <div className='history_value col-4' align='center'>
                        {i + 1}
                    </div>
                    <div className='history_value col-4' align='center'>
                        {`${val}${(exerName in stateSelector.userData.record && val == stateSelector.userData.record[exerName].pr1 && val != 0) ? '*' : ''}`}
                    </div>
                    <div className='history_value col-4' align='center'>
                        {metric2 === undefined ? '' : `${metric2[i]}${(stateSelector.userData.record[exerName].pr1 == 0 && metric2[i] == stateSelector.userData.record[exerName].pr2) ? '*' : ''}`}
                    </div>
                </div>
            )
        })
    }

    // loads data from database
    useEffect(() => {
        async function loadData() {
            let loadURI = process.env.REACT_APP_API_URI + 'loadData';
            let res = await axios.post(loadURI, { userID: localStorage.getItem("workout_userID"), email: localStorage.getItem("workout_email") });

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
        <div className="history container">
            <div className='row history_header'>
                History
            </div>
            <div className='row history_content'>
                {historyItem(userWorkObj)}
            </div>
        </div>
    )
}

export default History;