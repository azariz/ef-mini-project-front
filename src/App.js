/* Author : Amine Azariz
 * Licence
 * Version 
 * --------------------------------------------------------------------------- */

import React from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

/* CSS
 * --------------------------------------------------------------------------- */
import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

/* GLOBALS
 * @TODO: better use a proper way to define settings (file, env, db)
 * --------------------------------------------------------------------------- */
const API_URI = "http://127.0.0.1:5555/api/events/"


/* App Component
 * --------------------------------------------------------------------------- */
class App extends React.Component {
  state = {
    events: []
  };


  /* onApiSendSuccess
  * --
  * update interface */

  onApiSendSuccess = ({ start, end, duration, title }) => {
    alert("Meeting ajouté avec succès.")
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


  /* SendToApi
   * --
   * construct and send payload from calendar to backend API */

  sendToApi = ({ start, end, duration, title }) => {
    // construct content to send to api
    const postPayload = {
      event_start: start,
      event_duration: duration,
      event_title: title
    }

    // construct request
    const requestMetadata = {
        method: 'POST',
        headers: {  'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload)
    };

    // request API
    fetch(API_URI, requestMetadata)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
          this.onApiSendSuccess({ start, end, duration, title })
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow exceptions.
        (error) => {
          console.error(error)
          alert("Error from the API. Check console.")
          return false
        }
      )
  }


  /* HandleSelect
   * timeslot selectoion handler */

  handleSelect = ({ start, end }) => {
    const title = window.prompt('Objet du meeting ...')
    let duration = 0
    if (title)
      // construct content to send to api
      duration = (end-start)/(60*1000)  // duration in minutes
      this.sendToApi({ start, duration, title })
  }


  /* Render
   * component renderer */

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