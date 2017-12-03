import React, { Component } from 'react';
import { MUSIC_LIST } from '../config/config';
import ListItem from '../components/listitem';
class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            musicList: MUSIC_LIST
        }
    }
    componentDidMount() {
        PubSub.subscribe('DEL_MUSIC', (msg, item) => {
            this.setState({
                musicList: this.state.musicList.filter((music) => {
                    return music !== item;
                })
            });
        })
    }
    render() {
        let Items = this.state.musicList.map((item) => {
            return (
                <ListItem
                    key={item.id}
                    data={item}
                    focus={this.state.currentMusitItem === item}
                ></ListItem>
            );
        });
        return (
            <ul>
                {Items}
            </ul>
        );
    }
};

export default List;