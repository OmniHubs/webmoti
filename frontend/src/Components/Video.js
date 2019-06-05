import React from 'react'

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    render() {
        return (
            <video width="1280" height="720" controls>
                        Your browser does not support the video tag.
            </video>
    );
    }
}