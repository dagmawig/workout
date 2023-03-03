import React from 'react';
import './Loading.css';
import { useSelector } from 'react-redux';

// page loading component
function Loading() {
    const stateSelector = useSelector((state) => state.workout);
    let loading = stateSelector.loading;
    return (
        <div className="loading" style={{ display: loading ? 'block' : 'none' }}>
            <div className="loading_row row">
                <div className="d-flex justify-content-center" >
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Loading;