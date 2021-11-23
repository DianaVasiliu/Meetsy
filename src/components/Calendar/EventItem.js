import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import styled from 'styled-components';
import { AuthUserContext } from '../Session';
import { StyledTextArea, StyledInput, StyledButton } from '../../styles';
import {COLORS} from '../../constants/designConstants';

const Container = styled.div`
background: ${COLORS.bodyLight};
margin-top: 5%;
color: black;
padding: 1%;
min-height: 310px;
height: auto;
width: 100%;
border-radius: 8px;
display:flex;
flex-direction: column;

h2, h3, h4, p, span {
    color: ${COLORS.inputGrey};
}
`;

const INITIAL_STATE = {
    title: null,
    description: null,
    startDate: null,
    endDate: null,
    privateEvent: null,
    ownerId: null,
    ownerUsername: null,
    meetingLink: null,

    newTitle: null,
    newDescription: null,
    newStartDate: null,
    newEndDate: null,
    newStartTime: null,
    newEndTime: null,
    newSDset: false,
    newEDset: false,

    loading: true,

    editMode: false,
    stringStartDate: null,
    stringEndDate: null,
    stringStartTime: null,
    stringEndTime: null
}


class EventItem extends Component {
    constructor(props) {
        super(props);
        this.eventId = props.eventId;
        this.options = {
            weekday: 'short',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timeZoneName: 'short',
            hour: '2-digit',
            minute: '2-digit'
        };
        this.state = INITIAL_STATE;
        props.firebase.event(this.eventId)
            .get()
            .then(query => {
                this.props.firebase.user(query.data().userId)
                    .get()
                    .then(user => {
                        let owner = user.data().username;

                        let sd = query.data().startDate.toDate();
                        let ed = query.data().endDate.toDate();

                        console.log(this.dateToString(sd));


                        if (this.condition(user.data().userId)) {
                            owner = owner + " (Me)";
                        }

                        this.setState({
                            title: query.data().title,
                            newTitle: query.data().title,
                            description: query.data().description,
                            newDescription: query.data().description,
                            startDate: sd.toLocaleString('en-RO', this.options),
                            endDate: ed.toLocaleString('en-RO', this.options),
                            newStartDate: sd.toLocaleString('en-RO', this.options),
                            newEndDate: ed.toLocaleString('en-RO', this.options),
                            privateEvent: query.data().private.toString(),
                            meetingLink: query.data().meetingLink,
                            ownerUsername: owner,
                            ownerId: user.data().userId,
                            stringStartDate: this.dateToString(sd),
                            stringEndDate: this.dateToString(ed),
                            stringStartTime: this.dateToTimeString(sd),
                            stringEndTime: this.dateToTimeString(ed),
                            loading: false
                        })
                    });

            });
    }

    dismiss() {
        this.props.unmountMe();
    }

    dateToTimeString(date) {
        let hour = date.getHours();
        let minute = date.getMinutes();
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        return hour + ':' + minute;
    }

    dateToString(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        return year + '-' + month + '-' + day;

    }

    onChangeText = (event, field) => {
        if (field === 'title') {
            this.setState({ newTitle: event.target.value });
        }
        else if (field === 'description') {
            this.setState({ newDescription: event.target.value });
        }
    };

    onChangeDate = (event, field) => {
        var date = event.target.value.split("-");
        var year = date[0];
        var month = date[1] - 1;
        var day = date[2];
        var hours;
        var minutes

        if (field === 'startDate') {
            hours = new Date(this.state.startDate).getHours();
            minutes = new Date(this.state.startDate).getMinutes();
            date = new Date(year, month, day, hours, minutes).toLocaleString('en-RO', this.options);
            console.log(date);
            this.setState({ newStartDate: date, stringStartDate: event.target.value, newSDset: true });
        }
        else if (field === 'endDate') {
            hours = new Date(this.state.endDate).getHours();
            minutes = new Date(this.state.endDate).getMinutes();
            date = new Date(year, month, day, hours, minutes).toLocaleString('en-RO', this.options);
            this.setState({ newEndDate: date, stringEndDate: event.target.value, newEDset: true });
        }
    }

    onChangeTime = (event, field) => {
        var time = event.target.value.split(":");
        var hour = time[0];
        var minute = time[1];

        if (field === 'startTime') {
            const { newStartDate } = this.state;
            let sd = new Date(newStartDate);
            sd.setHours(hour);
            sd.setMinutes(minute);

            this.setState({ newStartDate: sd.toLocaleString('en-RO', this.options), stringStartTime: event.target.value });

            console.log(sd);

        }
        else if (field === 'endTime') {
            const { newEndDate } = this.state;
            let ed = new Date(newEndDate);
            ed.setHours(hour);
            ed.setMinutes(minute);

            this.setState({ newEndDate: ed.toLocaleString('en-RO', this.options), stringEndTime: event.target.value });
        }
    }

    condition = uid => {
        return this.props.firebase.authUser.uid === uid;
    }

    onToggleEditMode = () => {
        this.setState({
            editMode: !this.state.editMode
        });
    };

    onSaveExit = () => {
        console.log(new Date(this.state.startDate));
        this.props.firebase.event(this.eventId).update({
            title: this.state.newTitle,
            description: this.state.newDescription,
            startDate: new Date(this.state.newStartDate),
            endDate: new Date(this.state.newEndDate)
        })
        this.setState({
            title: this.state.newTitle,
            description: this.state.newDescription,
            startDate: this.state.newStartDate,
            endDate: this.state.newEndDate
        })
        this.onToggleEditMode();
    }

    onDeleteEvent = () => {
        this.props.firebase.event(this.eventId).delete();
        this.setState(INITIAL_STATE);
        this.dismiss();
    }

    render() {
        const { editMode, title, description, startDate, endDate, privateEvent, ownerUsername, loading, meetingLink } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <Container id="eventContainer">
                        {loading && <p>Loading...</p>}

                        {!loading && <div>
                            <h2>{title}</h2>
                            <h4><strong>Description:</strong> {description}</h4>
                            <h4><strong>Start Date:</strong> {startDate}</h4>
                            <h4><strong>End Date:</strong> {endDate}</h4>
                            <h4><strong>Owner:</strong> {ownerUsername}</h4>
                            <h4><strong>Private:</strong> {privateEvent}</h4>
                            {meetingLink !== null && meetingLink !== undefined &&
                                <h4><strong>Meeting:</strong> <a target="_blank" rel="noreferrer" href={meetingLink}>{meetingLink}</a></h4>
                            }
                        </div>
                        }
                        {!loading && <div>
                            {this.condition(this.state.ownerId) && editMode
                                ? (
                                    <div>
                                        <div>
                                            <label for="title">Title</label>
                                            <StyledInput
                                                type="text"
                                                name="title"
                                                value={this.state.newTitle}
                                                onChange={(event) => this.onChangeText(event, 'title')}
                                            />
                                        </div>
                                        <div>
                                            <label for="description">Description</label>
                                            <StyledTextArea
                                                type="textarea"
                                                name="description"
                                                value={this.state.newDescription}
                                                onChange={(event) => this.onChangeText(event, 'description')}
                                            />
                                        </div>
                                        <div>
                                            <label for="startdate">Start Date</label>
                                            <StyledInput
                                                type="date"
                                                name="startdate"
                                                value={this.state.stringStartDate}
                                                onChange={(event) => this.onChangeDate(event, 'startDate')}
                                            />
                                            <StyledInput
                                                type="time"
                                                name="starttime"
                                                value={this.state.stringStartTime}
                                                disabled={!this.state.newSDset}
                                                onChange={(event) => this.onChangeTime(event, 'startTime')}
                                            />
                                        </div>
                                        <div>
                                            <label for="enddate">End Date</label>
                                            <StyledInput
                                                type="date"
                                                name="enddate"
                                                value={this.state.stringEndDate}
                                                onChange={(event) => this.onChangeDate(event, 'endDate')}
                                            />
                                            <StyledInput
                                                type="time"
                                                name="endtime"
                                                value={this.state.stringEndTime}
                                                disabled={!this.state.newEDset}
                                                onChange={(event) => this.onChangeTime(event, 'endTime')}
                                            />
                                        </div>
                                    </div>
                                )
                                : (
                                    <span>

                                    </span>
                                )}
                            <br></br>
                            {this.condition(this.state.ownerId) ?
                                (editMode
                                    ? (
                                        <span>
                                            <StyledButton type="submit" onClick={this.onSaveExit} style={{ marginRight: '10px' }}>Save</StyledButton>
                                            <StyledButton type="submit" onClick={this.onDeleteEvent} style={{ backgroundColor: COLORS.error }}>Delete Event</StyledButton>
                                            <span style={{ marginLeft: '1pc', color: COLORS.error }}>* If you delete this event, no one will be able to see it again.</span>
                                        </span>
                                    )
                                    : (
                                        <span>
                                            <StyledButton type="submit" onClick={this.onToggleEditMode}>Edit</StyledButton>
                                        </span>
                                    )
                                )
                                :
                                <span>You cannot edit this event</span>
                            }

                        </div>
                        }
                    </Container>
                )
                }
            </AuthUserContext.Consumer >

        )
    }
}

export default withFirebase(EventItem);