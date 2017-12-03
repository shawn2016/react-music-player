import React, { Component } from 'react'
import Progress from '../components/progress'
import './player.less'
import { Link } from 'react-router-dom';
import { MUSIC_LIST } from '../config/config';
let duration = null
class Player extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            progress: 0,
            volume: 0,
            isPlay: true,
            currentMusitItem: MUSIC_LIST[0],
            repeatType: 'cycle',
            musicList: MUSIC_LIST,
            leftTime: ''
        }
    }
    componentDidMount() {
        $("#player").jPlayer({
            supplied: "mp3",
            wmode: "window",
            useStateClassSkin: true
        });

        this.playMusic(this.state.musicList[0]);

        $("#player").bind($.jPlayer.event.ended, (e) => {
            this.playWhenEnd();
        });
        $("#player").bind($.jPlayer.event.timeupdate, (e) => {
            duration = e.jPlayer.status.duration;
            this.setState({
                progress: e.jPlayer.status.currentPercentAbsolute,
                volume: e.jPlayer.options.volume * 100,
                leftTime: this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
            });
        });
        PubSub.subscribe('PLAY_MUSIC', (msg, item) => {
            this.playMusic(item);
        });
        PubSub.subscribe('DEL_MUSIC', (msg, item) => {
            this.setState({
                musicList: this.state.musicList.filter((music) => {
                    return music !== item;
                })
            });
        });
        PubSub.subscribe('PLAY_NEXT', () => {
            this.playNext();
        });
        PubSub.subscribe('PLAY_PREV', () => {
            this.playNext('prev');
        });
        let repeatList = [
            'cycle',
            'once',
            'random'
        ];
        PubSub.subscribe('CHANAGE_REPEAT', () => {
            let index = repeatList.indexOf(this.state.repeatType);
            index = (index + 1) % repeatList.length;
            this.setState({
                repeatType: repeatList[index]
            });
        });
    }
    formatTime(time) {
        time = Math.floor(time);
        let miniute = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        return miniute + ':' + (seconds < 10 ? '0' + seconds : seconds);
    }
    playWhenEnd() {
        if (this.state.repeatType === 'random') {
            let index = this.findMusicIndex(this.state.currentMusitItem);
            let randomIndex = randomRange(0, this.state.musicList.length - 1);
            while (randomIndex === index) {
                randomIndex = randomRange(0, this.state.musicList.length - 1);
            }
            this.playMusic(this.state.musicList[randomIndex]);
        } else if (this.state.repeatType === 'once') {
            this.playMusic(this.state.currentMusitItem);
        } else {
            this.playNext();
        }
    }
    findMusicIndex(music) {
        let index = this.state.musicList.indexOf(music);
        return Math.max(0, index);
    }
    playNext(type = 'next') {
        let index = this.findMusicIndex(this.state.currentMusitItem);
        if (type === 'next') {
            index = (index + 1) % this.state.musicList.length;
        } else {
            index = (index + this.state.musicList.length - 1) % this.state.musicList.length;
        }
        let musicItem = this.state.musicList[index];
        this.setState({
            currentMusitItem: musicItem
        });
        this.playMusic(musicItem);
    }
    componentWillUnmout() {
        $("#player").unbind($.jPlayer.event.timeupdate);
        PubSub.unsubscribe('PLAY_MUSIC');
        PubSub.unsubscribe('DEL_MUSIC');
        PubSub.unsubscribe('CHANAGE_REPEAT');
        PubSub.unsubscribe('PLAY_NEXT');
        PubSub.unsubscribe('PLAY_PREV');
    }
    playMusic(item) {
        $("#player").jPlayer("setMedia", {
            mp3: item.file
        }).jPlayer('play');
        this.setState({
            currentMusitItem: item
        });
    }
    onProgressChange(progress) {
        $('#player').jPlayer('play', duration * progress)
    }
    changeVolumeHandler(progress) {
        $('#player').jPlayer('volume', progress)
    }
    changeRepeat() {
        PubSub.publish('CHANAGE_REPEAT');
    }
    play() {
        if (this.state.isPlay) {
            $("#player").jPlayer("pause");
        } else {
            $("#player").jPlayer("play");
        }
        this.setState({
            isPlay: !this.state.isPlay
        });
    }
    next() {
        PubSub.publish('PLAY_NEXT');
    }
    prev() {
        PubSub.publish('PLAY_PREV');
    }
    changeProgressHandler(progress) {
        $("#player").jPlayer("play", duration * progress);
        this.setState({
            isPlay: true
        });
    }
    render() {
        return (
            <div className="player-page">
                <h1 className="caption">
                    <Link to="/list">我的私人音乐坊 &gt;</Link>
                </h1>
                <div className="mt20 row">
                    <div className="controll-wrapper">
                        <h2 className="music-title">{this.state.currentMusitItem.title}</h2>
                        <h3 className="music-artist mt10">{this.state.currentMusitItem.artist}</h3>
                        <div className="row mt20">
                            <div className="left-time -col-auto">-{this.state.leftTime}</div>
                            <div className="volume-container">
                                <i className="icon-volume rt" style={{ top: 5, left: -5 }}></i>
                                <div className="volume-wrapper">
                                    <Progress
                                        progress={this.state.volume}
                                        onProgressChange={this.changeVolumeHandler.bind(this)}
                                        barColor='#aaa'
                                    >
                                    </Progress>
                                </div>
                            </div>
                        </div>
                        <div style={{ height: 10, lineHeight: '10px' }}>
                            <Progress
                                progress={this.state.progress}
                                onProgressChange={this.changeProgressHandler.bind(this)}
                            >
                            </Progress>
                        </div>
                        <div className="mt35 row">
                            <div>
                                <i className="icon prev" onClick={this.prev.bind(this)}></i>
                                <i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play.bind(this)}></i>
                                <i className="icon next ml20" onClick={this.next.bind(this)}></i>
                            </div>
                            <div className="-col-auto">
                                <i className={`icon repeat-${this.state.repeatType}`} onClick={this.changeRepeat.bind(this)}></i>
                            </div>
                        </div>
                    </div>
                    <div className="-col-auto cover">
                        <img src={this.state.currentMusitItem.cover} alt={this.state.currentMusitItem.title} />
                    </div>
                </div>
            </div>
        )
    }
}
export default Player;