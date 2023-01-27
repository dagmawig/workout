import React, { useState, useEffect } from 'react';
import './LogWorkout.css';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateLoading, updateUserData, updateRecord } from './workoutSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

var bodyParts = require('../exerBody.json');
var exercisesLocal = require('../exercisesLocal.json');

function LogWorkout() {

    const { state } = useLocation();
    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // let template = (state.user) ? stateSelector.userData.templateArr[state.index] : stateSelector.userData.fixTempArr[state.index];
    let userWorkObj = stateSelector.userData.workoutObj;
    // let exerciseArr = template.exerList;


    const [filterArr, updateFilter] = useState(exercisesLocal);
    const [exerciseList, updateExerList] = useState([]);
    const [selectedExer, updateSelExer] = useState('3/4 sit-up');
    const [seconds, setSeconds] = useState(0);
    const [inputState, updateInputState] = useState([]);
    const [currentTemp, updateTemp] = useState(null);

    function updateInput(i, j, k, val) {
        inputState[i][j][k] = (val === '') ? undefined : val;
    }

    function checkInput(arr) {
        for (let exer of arr) {
            for (let metric of exer) {
                for (let set of metric) {
                    if (set === undefined) return false
                }
            }
        }

        return true;
    }

    async function saveWorkout(workoutObj, user, updatedTempArr, record) {
        let updateURI = process.env.REACT_APP_API_URI + 'updateWorkoutObj';
        let res = await axios.post(updateURI, { userID: localStorage.getItem("workout_userID"), workoutObj: workoutObj, user: user, updatedTempArr: updatedTempArr, record: record }).catch(err => console.log(err));

        return res;
    }

    function saveWork() {
        if (!checkInput(inputState)) alert('Some exercise sets are not complete. Either complete the sets or remove incomplete sets. If doing weightless exercise, put 0 in the LBS box.')
        else {
            let record = JSON.parse(JSON.stringify(stateSelector.userData.record));
            let timeStamp = new Date().toISOString();
            let workObj = {};
            workObj.tempName = currentTemp.name;
            let workoutList = [];
            for (let i = 0; i < inputState.length; i++) {
                let inputStateExer = inputState[i];
                let exer = currentTemp.exerList[i]
                let exercise = {};
                exercise.exerName = exer.name;
                exercise.metric = exer.metric;
                exercise.metric1 = inputStateExer[0];
                if (exer.metric === 'wr' || exer.metric === 'dt') exercise.metric2 = inputStateExer[1];
                workoutList.push(exercise);

                let maxVal = Math.max(...inputStateExer[0]);
                let maxIndex = inputStateExer[0].indexOf(maxVal.toString());

                if (exer.name in record) {
                    let exerRecord = record[exer.name];
                    exerRecord.metric = exer.metric;

                    exerRecord.prev1 = inputStateExer[0][inputStateExer[0].length - 1];
                    if (exer.metric === 'wr' || exer.metric === 'dt') {
                        exerRecord.prev2 = inputStateExer[1][inputStateExer[0].length - 1];
                    }

                    if (maxVal > exerRecord.pr1) {
                        exerRecord.pr1 = maxVal;
                        if (exer.metric === 'wr' || exer.metric === 'dt') {
                            exerRecord.pr2 = inputStateExer[1][maxIndex];
                        }
                    }
                }
                else {
                    let exerRecord = {};
                    exerRecord.metric = exer.metric;

                    exerRecord.prev1 = inputStateExer[0][inputStateExer[0].length - 1];
                    exerRecord.pr1 = maxVal;
                    if (exer.metric === 'wr' || exer.metric === 'dt') {
                        exerRecord.prev2 = inputStateExer[1][inputStateExer[0].length - 1];
                        exerRecord.pr2 = inputStateExer[1][maxIndex];
                    }

                    record[exer.name] = exerRecord;
                }

            }

            workObj.workoutList = workoutList;
            let tempUserObj = JSON.parse(JSON.stringify(userWorkObj))
            tempUserObj[timeStamp] = workObj;

            let newTemplateArr = JSON.parse(JSON.stringify(state.user ? stateSelector.userData.templateArr : stateSelector.userData.fixTempArr));
            newTemplateArr[state.index].workoutTimeArr.push(new Date().toISOString());

            dispatch(updateLoading(false));
            saveWorkout(tempUserObj, state.user, newTemplateArr, record).then(res => {
                let data = res.data;
                if (data.success) {
                    dispatch(updateUserData(data.data));
                    navigate('/workout', { replace: true })
                    alert(`Workout under template "${newTemplateArr[state.index].name}" saved successfully!`);
                    window.$('#saveWModal').modal('hide');
                    dispatch(updateLoading(false));
                } else {
                    dispatch(updateLoading(false));
                    alert(`${data.err}`)
                }
            })
        }
    }

    function openSaveModal() {
        window.$('#saveWModal').modal('show');
    }

    setTimeout(() => {
        setSeconds(seconds + 1);
    }, 1000);


    function openExercise() {
        window.$('#exerWModal').modal('show');
    }

    function cancelWork() {
        navigate('/workout', { replace: true });
        window.$('#cancelWModal').modal('hide');
    }

    function handleChange(value) {
        document.getElementById('exer-log-list').selectedIndex = 0;
        let tempArr = (value === 'empty') ? exercisesLocal : exercisesLocal.filter(ele => ele.bodyPart === value)
        updateFilter(tempArr);
        updateSelExer(tempArr[0].name);
    }

    function handleSel(value) {
        updateSelExer(value);
    }

    function addExer() {
        if (selectedExer === 'empty') alert('please select exercise');
        else if (exerciseList.filter(ele => ele.name === selectedExer).length !== 0) alert(`${selectedExer} already exists in template. Pick a different exercise.`);
        else {
            let exer = JSON.parse(JSON.stringify(exercisesLocal.filter(ele => ele.name === selectedExer)[0]));
            exer.sets = 4;
            let tempList = JSON.parse(JSON.stringify(exerciseList));
            tempList.push(exer);
            updateExerList(tempList);
            let tempArr;
            if (exer.metric === 'wr' || exer.metric === 'dt') tempArr = new Array(2).fill().map(() => new Array(4))
            else tempArr = new Array(1).fill().map(() => new Array(4));
            inputState.push(tempArr);
            window.$('#exerWModal').modal('hide');
        }
    }

    function removeExer(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        tempList.splice(index, 1);
        updateExerList(tempList);
        inputState.splice(index, 1);
    }

    function addSet(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        tempList[index].sets++;
        updateExerList(tempList);
        let tempArr = inputState[index];
        tempArr.map(ar => {
            ar.push(undefined);
            return null;
        })
    }

    function removeSet(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        if (tempList[index].sets > 1) tempList[index].sets--;
        updateExerList(tempList);
        let tempArr = inputState[index];
        tempArr.map(ar => {
            ar.pop();
            return null;
        })
    }

    function exerListEle() {
        return exerciseList.map((item, i) => {
            return (
                <div className='newtemplate_exer_ele row' key={i + 'exerListEle'}>
                    <div className='newtemplate_exer_ele_header row'>
                        <div className='newtemplate_exer_name col-10'>
                            <b>{item.name}</b>
                        </div>
                        <div className='newtemplate_exer_remove col-2' align='right'>
                            <button className="remove_button fa-solid fa-x" value={i} onClick={e => removeExer(e.target.value)}></button>
                        </div>
                    </div>
                    <div className='newtemplate_exer_ele_content row'>
                        <div className='newtemplate_exer_set_header row'>
                            <div className='newtemplate_set col-2'>
                                <div className='newtemplate_set_text row'>
                                    <p className='col-12 text-center'>SET</p>
                                </div>
                            </div>
                            <div className='newtemplate_prev col-4'>
                                <div className='newtemplate_prev_text row'>
                                    <p className='col-12 text-center'>PREV</p>
                                </div>
                            </div>
                            <div className='newtemplate_lbs col-3'>
                                <div className='newtemplate_lbs_text row'>
                                    <p className='col-12 text-center'>{(item.metric === 'wr') ? 'LBS' : (item.metric === 'dt' ? 'MILES' : 'SECONDS')}</p>
                                </div>
                            </div>
                            <div className='newtemplate_reps col-3'>
                                <div className='newtemplate_reps_text row'>
                                    <p className='col-12 text-center'>{item.metric === 'wr' ? 'REPS' : item.metric === 'dt' ? 'MIN' : ''}</p>
                                </div>
                            </div>
                            {/* <div className='newtemplate_reps_remove col-2'>
                                <div className='newtemplate_reps_space row'>
                                    <p className='col-12 text-center'></p>
                                </div>
                            </div> */}
                        </div>
                        {setList(item, i)}
                    </div>
                    <div className='newtemplate_reps_add_set row'>
                        <div className='newtemplate_rep_add_button row'>
                            <div className='newtemplate_prev col-4'>
                            </div>
                            {item.sets > 1 ? <button className='newtemplate_add_button col-3' align='center' value={i} onClick={() => removeSet(i)} >- SET</button> : null}
                            <button className='newtemplate_add_button col-3' value={i} onClick={e => addSet(e.target.value)} >+ SET</button>
                            <div className='newtemplate_prev col-2'>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    function setList(exer, index) {
        let tempArr = [...Array(exer.sets).keys()];
        return tempArr.map(item => {
            return (
                <div className='newtemplate_exer_set_content row' key={item + exer.name + 'setList'}>
                    <div className='newtemplate_set col-2'>
                        <div className='newtemplate_set_val row'>
                            <p className='col-12 text-center'>{item + 1}</p>
                        </div>
                    </div>
                    <div className='newtemplate_prev col-4'>
                        <div className='newtemplate_prev_val row'>
                            <p className='col-12 text-center'>-</p>
                        </div>
                    </div>
                    <div className='newtemplate_lbs col-3'>
                        <div className='newtemplate_lbs_val row'>
                            <input className='lbs_input' type={'number'} onChange={(e) => updateInput(index, 0, item, e.target.value)}></input>
                        </div>
                    </div>
                    <div className='newtemplate_reps col-3'>
                        <div className='newtemplate_reps_val row'>
                            {exer.metric === 'wr' || exer.metric === 'dt' ? <input className='reps_input' type={'number'} onChange={(e) => updateInput(index, 1, item, e.target.value)}></input> : null}
                        </div>
                    </div>
                    {/* <div className='newtemplate_reps_remove col-2'>
                        <div className='newtemplate_reps_button row'>
                            <button className="reps_remove_button fa-solid fa-check" value={index} onClick={e => logSet(e.target.value)}></button>
                        </div>
                    </div> */}
                </div>
            )
        })
    }

    function optionsList() {
        return filterArr.map((item, i) => {
            return (
                <option value={item.name} className='small' key={i + 'option'} style={{ 'fontWeight': 'bold' }}>{item.name}</option>
            )
        })
    }

    function filterList() {
        return bodyParts.map((item, i) => {
            return (
                <option value={item} className='small' key={i + 'option'} style={{ 'fontWeight': 'bold' }}>{item}</option>
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
                    let template = (state.user) ? data.data.templateArr[state.index] : data.data.fixTempArr[state.index];
                    updateExerList(template.exerList);
                    let inputArr = [];
                    template.exerList.map((exer, i) => {
                        let arr;
                        let totSets = exer.sets;
                        if (exer.metric === 'wr' || exer.metric === 'dt') arr = new Array(2).fill().map(() => new Array(totSets))
                        else arr = new Array(1).fill().map(() => new Array(totSets));
                        inputArr.push(arr);
                        return null;
                    });
                    updateInputState(inputArr);
                    updateTemp(template);
                    dispatch(updateLoading(false));
                } else {
                    dispatch(updateLoading(false));
                    alert(`${data.err}`)
                }
            })
    }, [])

    return (
        <div className='newtemplate container'>
            <div className='newtemplate_header row'>
                <div className='newtemplate_header_x col-2'>
                    <button className="x_button" onClick={() => { window.$('#cancelWModal').modal('show') }}><i className="fa-solid fa-xmark fa-2x" ></i></button>
                </div>
                <div className='newtemplate_content_title col-8'>
                    <div className='logworkout_content_title_top'>
                        <p className='temp_header_text' style={{ 'textAlign': 'center', 'fontSize': '12pt' }}>{(currentTemp === null) ? 'none' : currentTemp.name}</p>
                    </div>
                    <div className='logworkout_content_title_top'>
                        <p className='temp_header_text' style={{ 'textAlign': 'center' }}>{new Date(seconds * 1000).toISOString().substr(11, 8)}</p>
                    </div>
                </div>
                <div className='newtemplate_content_save col-2' align='right'>
                    <button className="save_button" onClick={openSaveModal}><i className="fa-solid fa-floppy-disk fa-2x"></i></button>
                </div>
            </div>
            <div className='newtemplate_content row'>
                <div className='newtemplate_content_form row'>
                    {/* <div className='newtemplate_content_header row'>
                        <div className='newtemplate_content_name col-8'>
                            <input className="form-control newtemplate_name_input" type="text" placeholder="Enter Workout Name" defaultValue={tempName} onChange={e => updateName(e.target.value)} />
                        </div>
                    </div> */}
                    <div className='newtemplate_exer_list row'>
                        {exerListEle()}
                    </div>
                    <div className='newtemplate_content_add row'>
                        <div className='newtemplate_content_add_button row'>
                            <button className='newtemplate_add_button col-6' onClick={openExercise}>ADD EXERCISE</button>
                        </div>
                        <div className='newtemplate_content_add_button row' style={{ 'marginTop': '10px', 'marginBottom': '10px' }}>
                            <button className='newtemplate_add_button col-6' style={{ 'fontSize': '16pt' }} onClick={openSaveModal}>FINISH WORKOUT</button>
                        </div>
                        <div className='newtemplate_content_add_button row'>
                            <button className='newtemplate_add_button col-6' style={{ 'color': 'darkred' }} onClick={() => { window.$('#cancelWModal').modal('show') }}>CANCEL WORKOUT</button>
                        </div>
                    </div>
                    <div className="modal" id='exerWModal' tabIndex="-1" aria-hidden={true}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-success">
                                    <h5 className="modal-title"><b>Add Exercise</b></h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                        <b style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>Filter by:</b>
                                    </div>
                                    <div className='newtemplate_filter_select'>
                                        <select className='select form-select select_filter' aria-label='Default select' id='filter' style={{ 'fontWeight': 'bold', 'backgroundColor': 'rgb(125, 149, 90)' }} onChange={e => handleChange(e.target.value)}>
                                            <option defaultValue={true} className='small' value='empty' style={{ 'fontWeight': 'bold' }}>Select (All)</option>
                                            {filterList()}
                                        </select>
                                    </div>
                                    <div className='select_exer_title' style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>
                                        {filterArr.length} Total Exercises
                                    </div>
                                    <select className="select select_exer form-select" id='exer-log-list' size={10} onChange={e => handleSel(e.target.value)} defaultValue={filterArr[0].name}>
                                        {optionsList()}
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>Close</b></button>
                                    <button type="button" className="btn btn-primary" onClick={addExer}><b>Add</b></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id='cancelWModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-success">
                            <h5 className="modal-title"><b>Cancel Workout?</b></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                <b style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>Do you want to cancel workout?</b>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>No</b></button>
                            <button type="button" className="btn btn-primary" onClick={cancelWork}><b>Yes</b></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id='saveWModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-success">
                            <h5 className="modal-title"><b>Finish Workout?</b></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                <b style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>Do you want to finish workout?</b>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>No</b></button>
                            <button type="button" className="btn btn-primary" onClick={saveWork}><b>Yes</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogWorkout;