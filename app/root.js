import React, { Component } from 'react'
import Header from './components/header'
import Progress from './components/progress'
let duration = null
class Root extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: 0
        }
    }
    componentDidMount() {
        $("#player").jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: "http://oj4t8z2d5.bkt.clouddn.com/%E9%AD%94%E9%AC%BC%E4%B8%AD%E7%9A%84%E5%A4%A9%E4%BD%BF.mp3"
                }).jPlayer('play');
            },
            supplied: "mp3",
            wmode: "window",
            useStateClassSkin: true
        });
        $("#player").bind($.jPlayer.event.timeupdate, (e) => {
            duration = e.jPlayer.status.duration;
            this.setState({
                progress: e.jPlayer.status.currentPercentAbsolute
            });
        });
    }
    componentWillUnmout() {
        $("#player").unbind($.jPlayer.event.timeupdate);
    }
    onProgressChange(progress) {
        console.log(progress)
        $('#player').jPlayer('play', duration * progress)
    }
    render() {
        return [
            <Header key="Header" />,
            <Progress
                key="Progress"
                progress={this.state.progress}
                barColor="red"
                onProgressChange={this.onProgressChange.bind(this)}
            />
        ]
    }
}
export default Root