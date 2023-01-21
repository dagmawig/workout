import React, { useState } from 'react';
import './History.css';
import { useSelector, useDispatch } from 'react-redux';


function History() {


    return (
        <div className="history container">
            <div className='row history_header bg-success'>
                History
            </div>
            <div className='row history_content'>
                <div className='row history_content_item'>
                    <div className='row history_item_header'>
                        <div className='history_item_name col-8' align='left'>
                            Dagggggg
                        </div>
                        <div className='history_item_date col-4' align='right'>
                            10/31/23
                        </div>
                    </div>
                    <div className='history_item_list row'>
                        <div className='row'>
                            1 X barbell deadlift
                        </div>
                        <div className='row'>
                            1 X barbell deadlift
                        </div>
                        <div className='row'>
                            1 X barbell deadlift
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default History;