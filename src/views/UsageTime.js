import React from 'react';
import ChartWrapper from './ChartWrapper';
import Container from 'react-bootstrap/Container';


class UsageTime extends React.Component {



    render(){
        return <div className="Charts">
            <Container>
                <ChartWrapper/>
            </Container>

        </div>
    }


}

export default UsageTime;