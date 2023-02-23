import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poll-render',
  templateUrl: './poll-render.component.html',
  styleUrls: ['./poll-render.component.scss']
})
export class PollRenderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let streamURL = decodeURIComponent(window.location.search);
    streamURL = streamURL.slice(1, streamURL.length - 1);
    const newPollURL = streamURL + "?channel=polls"
    const newPollAnswerURL = streamURL + "?channel=poll-answers"

    const newPollSource = new EventSource(newPollURL);
    const newPollAnswerSource = new EventSource(newPollAnswerURL);

    newPollSource.addEventListener('publish', (event) => {
      /*
        {
          "title": "This is a sample poll",
          "options": [
              "Sample text",
              "123",
              "another option",
              "these are options"
          ]
        }
       */
      let data = JSON.parse(event.data);
      console.log(data);
    }, false);

    newPollAnswerSource.addEventListener('publish', (event) => {
      /*
        {
           "userID": 12938123,
           "optionNumber": 1,
           "userRoleIDs": [123, 823, 231, 293]
        }
       */
      let data = JSON.parse(event.data);
      console.log(data);
    }, false);




    // ----------------------------------------------------
    // ERRORS AND INITIAL CONNECTIONS
    newPollSource.addEventListener('open', (e) => {
      console.log("The connection has been established.");
    });
    newPollAnswerSource.addEventListener('open', (e) => {
      console.log("The connection has been established.");
    });
    newPollSource.addEventListener('error', function (event) {
      console.log(event)
    }, false);
    newPollAnswerSource.addEventListener('error', function (event) {
      console.log(event)
    }, false);
  }

}
