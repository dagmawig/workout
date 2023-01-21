import React, { useState } from 'react';
import './History.css';
import { useSelector, useDispatch } from 'react-redux';


function History() {
    const stateSelector = useSelector(state => state.workout);
    // let userWorkObj = stateSelector.workoutObj;
    let userWorkObj = {
        "2023-01-21T19:04:02.868Z": {
            "tempName": "Strong 5X5 - Workout B",
            "workoutList": [
                {
                    "exerName": "barbell full squat",
                    "metric": "wr",
                    "metric1": [
                        "1"
                    ],
                    "metric2": [
                        "11"
                    ]
                }
            ]
        },
        "2023-01-21T19:04:02.869Z": {
            "tempName": "Strong 5X5 - Workout B",
            "workoutList": [
                {
                    "exerName": "barbell full squat",
                    "metric": "wr",
                    "metric1": [
                        "1"
                    ],
                    "metric2": [
                        "11"
                    ]
                },
                {
                    "exerName": "barbell full squat",
                    "metric": "wr",
                    "metric1": [
                        "1"
                    ],
                    "metric2": [
                        "11"
                    ]
                }
            ]
        }
    };
    console.log(userWorkObj)
    function historyItem(workoutObj) {
       return Object.keys(workoutObj).sort((a,b)=>new Date(b)-new Date(a)).map(key => {
            return (
                <div className='row history_content_item' key={key}>
                    <div className='row history_item_header'>
                        <div className='history_item_name col-8' align='left'>
                            {workoutObj[key].tempName}
                        </div>
                        <div className='history_item_date col-4' align='right'>
                            {key.substring(0, 10)}
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
    //historyItem(userWorkObj);

    function exerList(list, key) {
        return list.map((exer, i) => {
            return (
                <div className="accordion-item" key={`${key}${i}`}>
                    <h2 className="accordion-header" id={`heading-${key}${i}`}>
                        <button className="accordion-button btn" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${key}${i}`} aria-expanded="true" aria-controls={`collapse-${key}${i}`} style={{'fontWeight': 'bold', 'outline': 'none'}}>
                           {exer.metric1.length} X {exer.exerName}
                        </button>
                    </h2>
                    <div id={`collapse-${key}${i}`} className="accordion-collapse collapse show" aria-labelledby={`heading-${key}${i}`} data-bs-parent={`#accordionExample-${key}`}>
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

    function setList(metric1, metric2, exerName) {
        return metric1.map((val, i) => {
            return (
                <div className='history_set_content row' key={`${exerName}${i}`}>
                    <div className='history_value col-4' align='center'>
                        {i+1}
                    </div>
                    <div className='history_value col-4' align='center'>
                        {val}
                    </div>
                    <div className='history_value col-4' align='center'>
                        {metric2 === undefined ? '' : metric2[i]}
                    </div>
                </div>
            )
        })
    }
    return (
        <div className="history container">
            <div className='row history_header bg-success'>
                History
            </div>
            <div className='row history_content'>
                {historyItem(userWorkObj)}
                {/* <div className='row history_content_item'>
                    <div className='row history_item_header'>
                        <div className='history_item_name col-8' align='left'>
                            Dagggggg
                        </div>
                        <div className='history_item_date col-4' align='right'>
                            10/31/23
                        </div>
                    </div>
                    <div className='history_item_list row'>
                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        1 X barbell deadlift
                                    </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <div className='history_set_header row'>
                                            <div className='history_set col-4' align='center'>
                                                SET
                                            </div>
                                            <div className='history_set col-4' align='center'>
                                                LBS
                                            </div>
                                            <div className='history_set col-4' align='center'>
                                                REPS
                                            </div>
                                        </div>
                                        <div className='history_set_content row'>
                                            <div className='history_value col-4' align='center'>
                                                1
                                            </div>
                                            <div className='history_value col-4' align='center'>
                                                50
                                            </div>
                                            <div className='history_value col-4' align='center'>
                                                10
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default History;