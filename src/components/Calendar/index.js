import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { withAuthorization } from '../Session';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import { AuthUserContext } from '../Session';
import React, { Component } from 'react';
import EventItem from './EventItem';
import { form, StyledTextArea, StyledInput, StyledButton, StyledCheckbox, errorMsg, successMsg } from '../../styles';


moment.locale("en-GB", {
    week: {
        dow: 1,
    },
});

const localizer = momentLocalizer(moment);

class MyCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPrivate: false,
            title: '',
            description: '',
            events: [],

            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,

            startDateSet: false,
            endDateSet: false,
            startTimeSet: false,
            endTimeSet: false,

            error: null,
            success: null,

            eventColor: '#3174ad',
            selectedEvent: false,
            eventId: null
        };

        this.handleChildUnmount = this.handleChildUnmount.bind(this);

    }

    componentDidMount() {
        this.loadEvents();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    loadEvents = () => {
        this.unsubscribe = this.props.firebase
            .events()
            .onSnapshot(snapshot => {
                let events = [];

                snapshot.forEach(doc => {

                    if (doc.data().private && doc.data().userId !== this.props.firebase.authUser.userId) {
                        return
                    }
                    let id = doc.id;
                    let title = doc.data().title;
                    let start = doc.data().startDate;
                    let end = doc.data().endDate;
                    let description = doc.data().description;

                    let ev = {
                        'id': id,
                        'title': title,
                        'start': this.toDateTime(start.seconds),
                        'end': this.toDateTime(end.seconds),
                        'description': description
                    };

                    events.push(ev);
                }
                );

                this.setState({
                    events: events
                });
            });
    }

    toDateTime(secs) {
        var t = new Date(1970, 0, 1, 0, 0, 0);
        t.setTime(secs * 1000)
        return t;
    }

    onChangeCheckbox = () => {
        this.setState({ isPrivate: !this.state.isPrivate })
    }

    onChangeText = (event, field) => {
        if (field === 'title') {
            this.setState({ title: event.target.value });
        }
        else if (field === 'description') {
            this.setState({ description: event.target.value });
        }
    };

    onAddEvent = (event) => {
        event.preventDefault();
        const { events, title, startDate, endDate, startTimeSet, endTimeSet, startDateSet, endDateSet, description, isPrivate, startTime, endTime } = this.state;

        this.setState({
            success: null,
            error: null
        })

        if (!startTimeSet || !endTimeSet || !startDateSet || !endDateSet) {
            this.setState({
                error: "Date and time must be specified!"
            });
            return;
        }

        startDate.setSeconds(startTime / 1000);
        endDate.setSeconds(endTime / 1000);

        if (endDate <= startDate) {
            this.setState({
                error: "Invalid date or time!"
            });
            return;
        }

        try {
            const ev = {
                'title': title,
                'start': startDate,
                'end': endDate,
                'description': description
            };

            for (var i = 0; i < events.length; i++) {
                if (events[i].start.toString() === startDate.toString()
                    && events[i].end.toString() === endDate.toString()
                    && events[i].title === title) {
                    return
                }
            }

            events.push(ev);
            this.setState({ events: events });

            this.props.firebase.events().add({
                title: title,
                startDate: startDate,
                endDate: endDate,
                description: description,
                userId: this.props.firebase.authUser.userId,
                private: isPrivate
            });
            this.setState({
                success: "Event added successfully"
            })
        }
        catch (e) {
            this.setState({
                error: e.message
            })
        }
    }

    onChangeDate = (event, field) => {
        var date = event.target.value.split("-");
        var year = date[0];
        var month = date[1] - 1;
        var day = date[2];
        date = new Date(year, month, day)

        if (field === 'startDate') {
            this.setState({ startDate: date, startDateSet: true });
        }
        else if (field === 'endDate') {
            this.setState({ endDate: date, endDateSet: true });
        }
    }

    onChangeTime = (event, field) => {
        var time = event.target.value.split(":");
        var hours = time[0] * 3600 * 1000;
        var minutes = time[1] * 60 * 1000;

        if (field === 'startTime') {
            this.setState({ startTime: hours + minutes, startTimeSet: true });

        }
        else if (field === 'endTime') {
            this.setState({ endTime: hours + minutes, endTimeSet: true });
        }
    }

    eventStyleGetter = () => {
        var backgroundColor = this.state.eventColor;
        var style = {
            backgroundColor: backgroundColor
        };
        return {
            style: style
        };
    }

    onSelectEvent = (event) => {
        this.setState({
            selectedEvent: !this.state.selectedEvent,
            eventId: event.id
        });
    }

    handleChildUnmount = () => {
        this.setState({ selectedEvent: false })
    }

    render() {
        const { description, success, error, selectedEvent } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        <h1>Calendar</h1>
                        <Calendar
                            localizer={localizer}
                            events={this.state.events}
                            startAccessor="start"
                            endAccessor="end"
                            defaultDate={moment().toDate()}
                            eventPropGetter={(this.eventStyleGetter)}
                            onSelectEvent={this.onSelectEvent}
                        />

                        {selectedEvent && <EventItem
                            authUser={authUser}
                            eventId={this.state.eventId}
                            unmountMe={this.handleChildUnmount}
                        />
                        }

                        <br></br>
                        <form
                            onSubmit={event => this.onAddEvent(event)}
                            style={form}
                        >
                            <h3 style={{ 'marginBottom': '10px' }}>Add a new event</h3>
                            <br></br>
                            <h6 style={{ textAlign: 'center' }}>Start Date</h6>
                            <StyledInput
                                type="date"
                                id="eventStartDate"
                                onChange={(e) => this.onChangeDate(e, 'startDate')}
                                placeholder="Start date"
                            />
                            <h6 style={{ textAlign: 'center' }}>End Date</h6>
                            <StyledInput
                                type="date"
                                id="eventEndDate"
                                onChange={(e) => this.onChangeDate(e, 'endDate')}
                            />
                            <h6 style={{ textAlign: 'center' }}>Start Time</h6>
                            <StyledInput
                                type="time"
                                id="eventStartTime"
                                onChange={(e) => this.onChangeTime(e, 'startTime')}
                            />
                            <h6 style={{ textAlign: 'center' }}>End Time</h6>
                            <StyledInput
                                type="time"
                                id="eventEndTime"
                                onChange={(e) => this.onChangeTime(e, 'endTime')}
                            />
                            <h6 style={{ textAlign: 'center' }}>Event Title</h6>
                            <StyledInput
                                type="text"
                                id="eventTitle"
                                onChange={(e) => this.onChangeText(e, 'title')}
                            />
                            <h6 style={{ textAlign: 'center' }}>Event Description</h6>
                            <StyledTextArea
                                type="textarea"
                                id="eventDescription"
                                value={description}
                                onChange={(e) => this.onChangeText(e, 'description')}
                            />
                            <h6 style={{ textAlign: 'center' }}>Private Event</h6>
                            <StyledCheckbox
                                type="checkbox"
                                id="eventIsPrivate"
                                onChange={this.onChangeCheckbox}
                            />
                            <StyledButton type="submit">Add event</StyledButton>

                            {success !== null && <p style={successMsg}>{success}</p>}
                            {error !== null && <p style={errorMsg}>{error}</p>}
                        </form>
                    </div>
                )}
            </AuthUserContext.Consumer>
        )
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(MyCalendar);