import React, { useState, useEffect } from 'react';
import './EditTemplate.css';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateTemp, updateLoading, updateUserData } from './workoutSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

var bodyParts = require('../exerBody.json');
var exercisesLocal = require('../exercisesLocal.json');

function EditTemplate() {
    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [tempName, updateName] = useState('');
    const [exerciseList, updateExerList] = useState([]);
    const [filterArr, updateFilter] = useState(exercisesLocal);
    const [selectedExer, updateSelExer] = useState('3/4 sit-up');

    function handleChange(value) {
        document.getElementById('exer-edit-list').selectedIndex = 0;
        let tempArr = (value === 'empty') ? exercisesLocal : exercisesLocal.filter(ele => ele.bodyPart === value)
        updateFilter(tempArr);
        updateSelExer(tempArr[0].name);
    }

    function handleSel(value) {
        updateSelExer(value);
    }

    async function saveTemplate(newTempArr) {
        let updateURI = process.env.REACT_APP_API_URI + 'updateTemp';
        let res = await axios.post(updateURI, { userID: localStorage.getItem("workout_userID"), templateArr: newTempArr }).catch(err => console.log(err));

        return res;
    }

    function saveTemp() {
        if (!tempName.split(' ').join('')) alert('enter wolrkout template name');
        else if (stateSelector.userData.templateArr.filter((ele, i) => ele.name === tempName && i !== state.index).length !== 0) alert('workout template name already exist. use a different template name.');
        else if (exerciseList.length === 0) alert('add at least one exercise')
        else {
            let workoutTemp = {
                name: tempName,
                exerList: JSON.parse(JSON.stringify(exerciseList)),
                workoutTimeArr: [...stateSelector.userData.templateArr[state.index].workoutTimeArr],
                tempID: stateSelector.userData.templateArr[state.index].tempID
            }
            let newTempArr = JSON.parse(JSON.stringify(stateSelector.userData.templateArr));
            newTempArr[state.index] = workoutTemp;



            dispatch(updateLoading(true));
            saveTemplate(newTempArr).then(res => {
                let data = res.data;
                if (data.success) {
                    dispatch(updateTemp(data.data.templateArr));
                    navigate('/workout', { replace: true })
                    alert(`Template ${tempName} updated successfully!`)
                    dispatch(updateLoading(false));
                } else {
                    dispatch(updateLoading(false));
                    alert(`${data.err}`)
                }
            })
        }
    }

    function saveTempModal() {
        if (!tempName.split(' ').join('')) alert('enter wolrkout template name');
        else if (stateSelector.userData.templateArr.filter((ele, i) => ele.name === tempName && i !== state.index).length !== 0) alert('workout template name already exist. use a different template name.');
        else if (exerciseList.length === 0) alert('add at least one exercise')
        else {
            let workoutTemp = {
                name: tempName,
                exerList: JSON.parse(JSON.stringify(exerciseList)),
                workoutTimeArr: [...stateSelector.userData.templateArr[state.index].workoutTimeArr],
                tempID: stateSelector.userData.templateArr[state.index].tempID
            }
            let newTempArr = JSON.parse(JSON.stringify(stateSelector.userData.templateArr));
            newTempArr[state.index] = workoutTemp;


            dispatch(updateLoading(true));
            saveTemplate(newTempArr).then(res => {
                let data = res.data;
                if (data.success) {
                    dispatch(updateTemp(data.data.templateArr));
                    window.$('#saveModal').modal('hide');
                    navigate('/workout', { replace: true });
                    alert(`Template ${tempName} updated successfully!`)
                    dispatch(updateLoading(false));
                } else {
                    dispatch(updateLoading(false));
                    alert(`${data.err}`)
                }
            })
            //dispatch(updateTemp(newTempArr));
        }
    }

    function noSaveModal() {
        window.$('#saveModal').modal('hide');
        navigate('/workout', { replace: true })
    }

    function openSaveModal() {
        window.$('#saveModal').modal('show');
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
            window.$('#exerModal').modal('hide');
        }
    }

    function removeExer(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        tempList.splice(index, 1);
        updateExerList(tempList);
    }

    function addSet(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        tempList[index].sets++;
        updateExerList(tempList);
    }

    function removeSet(index) {
        let tempList = JSON.parse(JSON.stringify(exerciseList));
        if (tempList[index].sets > 1) tempList[index].sets--;
        updateExerList(tempList);
    }

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

    function exerListEle(list) {
        return list.map((item, i) => {
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
                            <input className='lbs_input' disabled style={{ 'opacity': '.5' }}></input>
                        </div>
                    </div>
                    <div className='newtemplate_reps col-3'>
                        <div className='newtemplate_reps_val row'>
                            {exer.metric === 'wr' || exer.metric === 'dt' ? <input className='reps_input' disabled style={{ 'opacity': '.5' }}></input> : null}
                        </div>
                    </div>
                </div>
            )
        })
    }

    function openExercise() {
        window.$('#exerModal').modal('show');
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
            let res = await axios.post(loadURI, { userID: localStorage.getItem("workout_userID"), email: localStorage.getItem("workout_email")  });

            return res;
        }

        dispatch(updateLoading(true));
        loadData()
            .then(res => {
                let data = res.data;
                if (data.success) {
                    dispatch(updateUserData(data.data));
                    updateName(data.data.templateArr[state.index].name);
                    updateExerList(data.data.templateArr[state.index].exerList);
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
                    <button className="x_button"><i className="fa-solid fa-xmark fa-2x" onClick={() => openSaveModal()}></i></button>
                </div>
                <div className='newtemplate_content_title col-8'>
                    <p className='temp_header_text'>Edit template</p>
                </div>
                <div className='newtemplate_content_save col-2' align='right'>
                    <button className="save_button" onClick={saveTemp}><i className="fa-solid fa-floppy-disk fa-2x"></i></button>
                </div>
            </div>
            <div className='newtemplate_content row'>
                <div className='newtemplate_content_form row'>
                    <div className='newtemplate_content_header row'>
                        <div className='newtemplate_content_name col-8'>
                            <input className="form-control newtemplate_name_input" type="text" placeholder="Enter Workout Name" defaultValue={tempName} onChange={e => updateName(e.target.value)} />
                        </div>
                    </div>
                    <div className='newtemplate_exer_list row'>
                        {exerListEle(exerciseList)}
                    </div>
                    <div className='newtemplate_content_add row'>
                        <div className='newtemplate_content_add_button row'>
                            <button className='newtemplate_add_button col-6' onClick={openExercise}>ADD EXERCISE</button>
                        </div>
                    </div>
                    <div className="modal" id='exerModal' tabIndex="-1" aria-hidden={true}>
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
                                    <select className="select select_exer form-select" id='exer-edit-list' size={10} onChange={e => handleSel(e.target.value)} defaultValue={filterArr[0].name}>
                                        {optionsList()}
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><b>Close</b></button>
                                    <button type="button" className="btn" onClick={addExer} style={{backgroundColor: '#9e5f2f'}}><b>Add</b></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal" id='saveModal' tabIndex="-1" aria-hidden={true}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><b>Save Template?</b></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='newtemplate_filter_text' style={{ 'marginBottom': '5px' }}>
                                <b style={{ 'fontWeight': 'bold', 'fontSize': '15pt' }}>You may have made changes to template. Do you want to save them?</b>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={noSaveModal}><b>No</b></button>
                            <button type="button" className="btn" onClick={saveTempModal} style={{backgroundColor: '#9e5f2f'}}><b>Yes</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTemplate;