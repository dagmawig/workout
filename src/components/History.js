import React, { useEffect } from 'react';
import './History.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateLoading, updateUserData } from './workoutSlice';
import axios from 'axios';

function History() {
    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();
    let userWorkObj = stateSelector.userData.workoutObj;
    //     let userWorkObj = {
    //     "2023-01-21T19:44:17.452Z": {
    //         "tempName": "Dag",
    //         "workoutList": [
    //             {
    //                 "exerName": "straddle maltese",
    //                 "metric": "a",
    //                 "metric1": [
    //                     "1",
    //                     "3",
    //                     "4"
    //                 ]
    //             },
    //             {
    //                 "exerName": "sledge hammer",
    //                 "metric": "wr",
    //                 "metric1": [
    //                     "2"
    //                 ],
    //                 "metric2": [
    //                     "3"
    //                 ]
    //             }
    //         ]
    //     }
    // }

    function historyItem(workoutObj) {
        return Object.keys(workoutObj).sort((a, b) => new Date(b) - new Date(a)).map(key => {
            return (
                <div className='row history_content_item' key={key}>
                    <div className='row history_item_header'>
                        <div className='history_item_name col-7' align='left'>
                            {workoutObj[key].tempName}
                        </div>
                        <div className='history_item_date col-5' align='right'>
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

    function setList(metric1, metric2, exerName) {
        return metric1.map((val, i) => {
            return (
                <div className='history_set_content row' key={`${exerName}${i}`}>
                    <div className='history_value col-4' align='center'>
                        {i + 1}
                    </div>
                    <div className='history_value col-4' align='center'>
                        {`${val}${(exerName in stateSelector.userData.record && val==stateSelector.userData.record[exerName].pr1)?'*':''}`}
                    </div>
                    <div className='history_value col-4' align='center'>
                        {metric2 === undefined ? '' : metric2[i]}
                    </div>
                </div>
            )
        })
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