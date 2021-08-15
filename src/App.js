import React from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

/* CSS */
import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

/* GLOBALS
 * @TODO: Use a separate config, env config or database for settings */
const API_URI = "https://api.example.com/"

class App extends React.Component {
  state = {
    events: []
  };

  sendToApi = ({ start, end, title }) => {
    /* construct content to send to api */
    const postBody = {
      event_start: start,
      event_end: end,
      event_title: title
    }
    console.log(start, end, title)
    console.log(postBody)

    /* construct request */
    const requestMetadata = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
    };

    /* request API */
    fetch(API_URI, requestMetadata)
      .then(res => res.json())
      .then(
        (result) => {
          console.log('Response OK from API.')
          console.log(result)
          return true
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow exceptions.
        (error) => {
          alert("Error from the API. Check console.")
          console.error(error)
          return false
        }
      )
  }

  handleSelect = ({ start, end }) => {
    const title = window.prompt('Objet du meeting ...')
    if (title)
      if (this.sendToApi({ start, end, title }) === true)
        this.setState({
          events: [
            ...this.state.events,
            {
              start,
              end,
              title,
            },
          ],
        })
  }

  render() {
    const localizer = momentLocalizer(moment)
    return (
      <>
        <Calendar
          selectable
          localizer={localizer}
          events={this.state.events}
          defaultView={Views.WEEK}  // choose WEEK view
          defaultDate={new Date()}  // start on today
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={this.handleSelect}
        />
      </>
    )
  }
}

export default App;