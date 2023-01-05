import React from 'react';
import './NewTemplate.css';
import { Link } from 'react-router-dom';

function NewTemplate() {
    return (
        <div className='newtemplate container'>
            <div className='newtemplate_header row'>
                <div className='newtemplate_header_x col-2'>
                    <Link to='/workout'>
                        <button className="x_button"><i className="fa-solid fa-xmark fa-2x"></i></button></Link>
                </div>
                <div className='newtemplate_content_title col-8'>
                    <p className='temp_header_text'>New workout template</p>
                </div>
                <div className='newtemplate_content_save col-2'>
                    <button className="save_button"><i className="fa-solid fa-floppy-disk fa-2x"></i></button>
                </div>
            </div>
            <div className='newtemplate_content row'>
                <div className='newtemplate_content_form row'>
                    <div className='newtemplate_content_header row'>
                        <div className='newtemplate_content_name col-8'>
                            <input className="form-control newtemplate_name_input" type="text" placeholder="Enter Workout Name" />
                        </div>
                    </div>
                    <div className='newtemplate_content_add row'>
                        <div className='newtemplate_content_add_button row'>
                            <button className='newtemplate_add_button col-6'>ADD EXERCISE</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default NewTemplate; 