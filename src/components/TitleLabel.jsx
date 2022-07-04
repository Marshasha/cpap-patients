import React from 'react';
import './Components.css';


export const TitleLabel = props => {
    <div className='label-card'>
        <h2> { props.label.id }</h2>
        <p>{props.label.name}</p>
    </div>
}