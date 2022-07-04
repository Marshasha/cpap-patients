import React from 'react';
import {TitleLabel} from './TitleLabel';


export const TitleList = props => {
    const titles = props.listLabels;
    const listTitles = titles?.map(e =>
        <TitleLabel key={e.id} titles={e.name}/>
        );
    return (
      <div> {listTitles}</div>
    )

}