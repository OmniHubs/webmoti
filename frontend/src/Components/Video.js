import React from 'react'


class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "eat it",
            video: null
        };
    }
    componentDidMount() {
        let constraints = { audio: true, video: true };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                /* use the stream */
                this.setState = {video: stream};
            })
            .catch(function(err) {
                /* handle the error */
            });
    }



    render() {
        return (
            <video width="1280" height="720" controls>
                        Your browser does not support the video tag.
            </video>
    );
    }
}
export default Video;