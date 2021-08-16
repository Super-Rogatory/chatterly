import React from 'react'
import { connect } from 'react-redux';

class Chat extends React.Component {
    render() {
        return (
            <div>
                <div class="ui feed">
                </div>
            </div>
        )
    }
}
const mapState = (state) => ({
    name: state.name,
    room: state.room
})
export default connect(mapState, null)(Chat);