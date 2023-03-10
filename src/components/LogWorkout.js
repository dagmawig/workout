import React, { useState, useEffect } from 'react';
import './LogWorkout.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateLoading, updateUserData } from './workoutSlice';
import axios from 'axios';

var bodyParts = require('../exerBody.json');
var exercisesLocal = require('../exercisesLocal.json');

function LogWorkout() {

    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();

    let userWorkObj = stateSelector.userData.workoutObj;
    let workout_user = localStorage.getItem("workout_user");
    let workout_index = parseInt(localStorage.getItem("workout_index"));
    const [filterArr, updateFilter] = useState(exercisesLocal);
    const [exerciseList, updateExerList] = useState([]);
    const [selectedExer, updateSelExer] = useState('3/4 sit-up');
    const [seconds, setSeconds] = useState(0);
    const [inputState, updateInputState] = useState([]);
    const [currentTemp, updateTemp] = useState(null);
    const [exercise, updateExer] = useState('');

    // updates workout session data
    function updateInput(i, j, k, val) {
        inputState[i][j][k] = (val === '') ? undefined : val;
        updateInputState(JSON.parse(JSON.stringify(inputState)))
        localStorage.setItem("localInputState", JSON.stringify(inputState))
    }

    // checks if any of the workout input fields are empty
    function checkInput(arr) {
        for (let exer of arr) {
            for (let metric of exer) {
                for (let set of metric) {
                    if (set === undefined || set === null) return false
                }
            }
        }

        return true;
    }

    // updates database with user's workout session data
    async function saveWorkout(workoutObj, user, updatedTempArr, record) {
        let updateURI = process.env.REACT_APP_API_URI + 'updateWorkoutObj';
        let res = await axios.post(updateURI, { userID: localStorage.getItem("workout_userID"), workoutObj: workoutObj, user: user, updatedTempArr: updatedTempArr, record: record }).catch(err => console.log(err));

        return res;
    }

    // saves workout session
    function saveWork() {
        if (exerciseList.length === 0) {
            alert('Add at least one exercise.');
            window.$('#saveWModal').modal('hide');
        }
        else if (!checkInput(inputState)) {
            alert('Some exercise sets are not complete. Either complete the sets or remove incomplete sets. If doing weightless exercise, put 0 in the LBS box.');
            window.$('#saveWModal').modal('hide');
        }
        else {
            let record = JSON.parse(JSON.stringify(stateSelector.userData.record));
            let timeStamp = new Date().toISOString();
            let workObj = {};
            workObj.tempName = currentTemp.name;
            let workoutList = [];
            for (let i = 0; i < inputState.length; i++) {
                let inputStateExer = inputState[i];
                let exer = exerciseList[i]
                let exercise = {};
                exercise.exerName = exer.name;
                exercise.metric = exer.metric;
                exercise.metric1 = inputStateExer[0];
                if (exer.metric === 'wr' || exer.metric === 'dt') exercise.metric2 = inputStateExer[1];
                workoutList.push(exercise);

                let maxVal = Math.max(...inputStateExer[0]);
                let maxIndex = inputStateExer[0].indexOf(maxVal.toString());
                let maxRep;
                if (exer.metric === 'wr' && maxVal === 0) {
                    maxRep = Math.max(...inputStateExer[1]);
                    maxIndex = inputStateExer[1].indexOf(maxRep.toString());
                    console.log(maxRep, inputStateExer[1], maxIndex, maxVal)
                }

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
                            exerRecord.pr2 = parseInt(inputStateExer[1][maxIndex]);
                        }
                    }
                    else if (exer.metric === 'wr' && maxVal === 0 && exerRecord.pr1 === 0) {
                        if (maxRep > exerRecord.pr2) {
                            exerRecord.pr2 = maxRep;
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
                        exerRecord.pr2 = parseInt(inputStateExer[1][maxIndex]);
                        console.log(maxIndex, inputStateExer[1])
                    }

                    record[exer.name] = exerRecord;
                }

            }

            workObj.workoutList = workoutList;
            workObj.duration = seconds;
            let tempUserObj = JSON.parse(JSON.stringify(userWorkObj))
            tempUserObj[timeStamp] = workObj;

            let newTemplateArr = JSON.parse(JSON.stringify((workout_user === 'true') ? stateSelector.userData.templateArr : stateSelector.userData.fixTempArr));
            newTemplateArr[workout_index].workoutTimeArr.push(new Date().toISOString());

            dispatch(updateLoading(false));
            saveWorkout(tempUserObj, workout_user, newTemplateArr, record).then(res => {
                let data = res.data;
                if (data.success) {
                    dispatch(updateUserData(data.data));
                    localStorage.setItem("workout_comp", "workout");
                    window.location.reload();
                    alert(`Workout under template "${newTemplateArr[workout_index].name}" saved successfully!`);
                    window.$('#saveWModal').modal('hide');
                    dispatch(updateLoading(false));
                } else {
                    dispatch(updateLoading(false));
                    alert(`${data.err}`)
                }
            })
        }
    }

    // opens save session modal
    function openSaveModal() {
        window.$('#saveWModal').modal('show');
    }

    // updates secnods elapsed since workout session started
    setTimeout(() => {
        setSeconds(Math.floor(Date.now() / 1000) - parseInt(localStorage.getItem("workout_start")));
    }, 1000);

    // opens exercise modal
    function openExercise() {
        window.$('#exerWModal').modal('show');
    }

    // cancels workout session and reroutes user to workout page
    function cancelWork() {
        window.$('#cancelWModal').modal('hide');
        localStorage.setItem("workout_comp", "workout");
        window.location.reload();
    }

    // filters exercise list based on filter value
    function handleChange(value) {
        document.getElementById('exer-log-list').selectedIndex = 0;
        let tempArr = (value === 'empty') ? exercisesLocal : exercisesLocal.filter(ele => ele.bodyPart === value)
        updateFilter(tempArr);
        updateSelExer(tempArr[0].name);
    }

    // updates selceted exercise
    function handleSel(value) {
        updateSelExer(value);
    }

    // adds exercise to current workout session
    function addExer() {
        if (selectedExer === 'empty') alert('please select exercise');
        else if (exerciseList.filter(ele => ele.name === selectedExer).length !== 0) alert(`${selectedExer} already exists in template. Pick a different exercise.`);
        else {
            let exer = JSON.parse(JSON.stringify(exercisesLocal.filter(ele => ele.name === selectedExer)[0]));
            exer.sets = 4;
            let tempList = JSON.parse(JSON.stringify(exerciseList));
            tempList.push(exer);
            updateExerList(tempList);
            localStorage.setItem("eList", JSON.stringify(tempList))
            let tempArr;
            if (exer.metric === 'wr' || exer.metric === 'dt') tempArr = new Array(2).fill().map(() => new Array(4))
            else tempArr = new Array(1).fill().map(() => new Array(4));
            inputState.push(tempArr);
            localStorage.setItem("localInputState", JSON.stringify(inputState))
            window.$('#exerWModal').modal('hide');
        }
    }

    // removes exercise from current workout session
    function removeExer(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        tempList.splice(index, 1);
        updateExerList(tempList);
        localStorage.setItem("eList", JSON.stringify(tempList))
        inputState.splice(index, 1);
        localStorage.setItem("localInputState", JSON.stringify(inputState))
    }

    // adds set to a given exercise
    function addSet(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        tempList[index].sets++;
        updateExerList(tempList);
        localStorage.setItem("eList", JSON.stringify(tempList))
        let tempArr = inputState[index];
        tempArr.map(ar => {
            ar.push(undefined);
            return null;
        })
        localStorage.setItem("localInputState", JSON.stringify(inputState))
    }

    // removes set from a given exercise
    function removeSet(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        if (tempList[index].sets > 1) tempList[index].sets--;
        updateExerList(tempList);
        localStorage.setItem("eList", JSON.stringify(tempList))
        let tempArr = inputState[index];
        tempArr.map(ar => {
            ar.pop();
            return null;
        })
        localStorage.setItem("localInputState", JSON.stringify(inputState))
    }

    // returns personal record and previous record data for a given exercise
    function getRec(exer) {
        if (exer.name in stateSelector.userData.record) {
            let exerRecord = stateSelector.userData.record[exer.name];
            let ans = '';
            let ans2 = '';
            ans += exerRecord.prev1;
            ans2 += exerRecord.pr1;
            if (exerRecord.metric === 'wr') {
                ans += ` LBS|${exerRecord.prev2} REPS`;
                ans2 += ` LBS|${exerRecord.pr2} REPS`;
            }
            else if (exerRecord.metric === 'dt') {
                ans += ` MI | ${exerRecord.prev2} MIN`;
                ans2 += ` MI | ${exerRecord.pr2} MIN`;
            }
            else {
                ans += ' SEC';
                ans2 += ' SEC';
            }

            return [ans, ans2];
        }
        else return ['-', '-'];
    }

    // shows exercise detail modal
    function showDetail(exer) {
        updateExer(exer);
        window.$('#exerWDetModal').modal('show');
    }

    // updates exercise value to empty string when exercise detail modal is hidden
    window.$("#exerWDetModal").on("hidden.bs.modal", function () {
        updateExer('');
    });

    // returns current workout session exercise list component 
    function exerListEle() {
        return exerciseList.map((item, i) => {
            return (
                <div className='newtemplate_exer_ele row' key={i + 'exerListEle'}>
                    <div className='newtemplate_exer_ele_header row'>
                        <div className='newtemplate_exer_name col-10'>
                            <b>{item.name}</b><button className="gif_button" onClick={e => showDetail(item)} ><i className="fa-solid fa-circle-info fa"></i></button>
                        </div>
                        <div className='newtemplate_exer_remove col-2' align='right'>
                            <button className="remove_button fa-solid fa-x" value={i} onClick={e => removeExer(e.target.value)}></button>
                        </div>
                    </div>
                    <div className='newtemplate_exer_ele_content row'>
                        <div className='newtemplate_exer_set_header row'>
                            <div className='newtemplate_set col-2'>
                                <div className='newtemplate_set_text row'>
                                    <p className='col-12 text-center'><b>SET</b></p>
                                </div>
                            </div>
                            <div className='newtemplate_lbs col-3'>
                                <div className='newtemplate_lbs_text row'>
                                    <p className='col-12 text-center'><b>{(item.metric === 'wr') ? 'LBS' : (item.metric === 'dt' ? 'MILES' : 'SECONDS')}</b></p>
                                </div>
                            </div>
                            <div className='newtemplate_reps col-3'>
                                <div className='newtemplate_reps_text row'>
                                    <p className='col-12 text-center'><b>{item.metric === 'wr' ? 'REPS' : item.metric === 'dt' ? 'MIN' : ''}</b></p>
                                </div>
                            </div>
                        </div>
                        {setList(item, i)}
                        <div className='newtemplate_exer_prev row'>
                            <div className='newtemplate_exer_prev_tit col-3' align='right'>
                                <b>PREV:</b>
                            </div>
                            <div className='newtemplate_exer_prev_tit col-9' align='left'>
                                <b>{` ${getRec(item)[0]}`}</b>
                            </div>
                        </div>
                        <div className='newtemplate_exer_pr row'>
                            <div className='newtemplate_exer_pr_tit col-3' align='right'>
                                <b>PR:</b>
                            </div>
                            <div className='newtemplate_exer_pr_tit col-9' align='left'>
                                <b>{` ${getRec(item)[1]}`}</b>
                            </div>
                        </div>

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

    // returns set list component of a given exercise
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
                    <div className='newtemplate_lbs col-3'>
                        <div className='newtemplate_lbs_val row'>
                            <input className='lbs_input' type={'number'} value={inputState[index][0][item] ? inputState[index][0][item] : ''} onChange={(e) => updateInput(index, 0, item, e.target.value)}></input>
                        </div>
                    </div>
                    <div className='newtemplate_reps col-3'>
                        <div className='newtemplate_reps_val row'>
                            {exer.metric === 'wr' || exer.metric === 'dt' ? <input className='reps_input' type={'number'} value={inputState[index][1][item] ? inputState[index][1][item] : ''} onChange={(e) => updateInput(index, 1, item, e.target.value)}></input> : null}
                        </div>
                    </div>
                </div>
            )
        })
    }

    // returns exercise list component from a filtered exercise array
    function optionsList() {
        return filterArr.map((item, i) => {
            return (
                <option value={item.name} className='small' key={i + 'option'} style={{ 'fontWeight': 'bold' }}>{item.name}</option>
            )
        })
    }

    // returns body part list component from an array
    function filterList() {
        return bodyParts.map((item, i) => {
            return (
                <option value={item} className='small' key={i + 'option'} style={{ 'fontWeight': 'bold' }}>{item}</option>
            )
        })
    }

    // loads data from database and from local storage
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
                    let template = (workout_user === 'true') ? data.data.templateArr[workout_index] : data.data.fixTempArr[workout_index];
                    if (!JSON.parse(localStorage.getItem("eList"))) updateExerList(template.exerList);
                    else {
                        updateExerList(JSON.parse(localStorage.getItem("eList")));
                    }
                    let inputArr;
                    if (!JSON.parse(localStorage.getItem("localInputState"))) {
                        inputArr = [];
                        template.exerList.map((exer, i) => {
                            let arr;
                            let totSets = exer.sets;
                            if (exer.metric === 'wr' || exer.metric === 'dt') arr = new Array(2).fill().map(() => new Array(totSets))
                            else arr = new Array(1).fill().map(() => new Array(totSets));
                            inputArr.push(arr);
                            return null;
                        });
                    }
                    else {
                        inputArr = JSON.parse(localStorage.getItem("localInputState"));
                    }

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
                                <div className="modal-header">
                                    <h5 className="modal-title"><b>Add Exercise</b></h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                        <b style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>Filter by:</b>
                                    </div>
                                    <div className='newtemplate_filter_select'>
                                        <select className='select form-select select_filter' aria-label='Default select' id='filter' style={{ 'fontWeight': 'bold', 'backgroundColor': 'rgb(179, 165, 153)' }} onChange={e => handleChange(e.target.value)}>
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
                                    <button type="button" className="btn" onClick={addExer} style={{ backgroundColor: '#9e5f2f' }}><b>Add</b></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id='cancelWModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
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
                            <button type="button" className="btn" onClick={cancelWork} style={{ backgroundColor: '#9e5f2f' }}><b>Yes</b></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id='saveWModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
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
                            <button type="button" className="btn" onClick={saveWork} style={{ backgroundColor: '#9e5f2f' }}><b>Yes</b></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id='exerWDetModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" style={{ 'fontWeight': 'bold' }}>Exercise Detail</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='row exercise'>
                                <div className='col-7 search_text'>
                                    <div className='row text'>
                                        <div className='row first'>
                                            <div className='col-12 name'><b>Workout</b></div>
                                            <div className='col-12 name_value'>{exercise.name}</div>
                                        </div>
                                        <div className='row second'>
                                            <div className='col-12 body'><b>Body Part</b></div>
                                            <div className='col-12 body_value'>{exercise.bodyPart}</div>
                                        </div>
                                        <div className='row third'>
                                            <div className='col-12 equipment'><b>Equipment</b></div>
                                            <div className='col-12 equip_value'>{exercise.equipment}</div>
                                        </div>
                                        <div className='row fourth'>
                                            <div className='col-12 target'><b>Target</b></div>
                                            <div className='col-12 target_value'>{exercise.target}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-5 search_gif'>
                                    <img src={process.env.PUBLIC_URL + '/images/' + exercise.localUrl} style={{ backgroundColor: 'white' }} alt="my-gif" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>Close</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogWorkout;