/**
 * @typedef {Object} TrackerConfig
 *
 * @property {Array<Object>} eventsStack - Initial events.
 * @property {number} maxEventsStack - Maximum length of eventsStack.
 * @property {number} debounceMs - Time period in miliseconds of events submitting to backend.
 * @property {boolean} readyToSubmit - Does Tracker ready to submit immediately.
 */

class Tracker {
  /**
   * Inits new Tracker with initial configs .
   * @param {TrackerConfig} eventsStack - Tracked events.
   */
  constructor({ eventsStack, maxEventsStack, debounceMs, readyToSubmit }) {
    this.eventsStack = eventsStack;
    this.maxEventsStack = maxEventsStack;
    this.debounceMs = debounceMs;
    this.readyToSubmit = readyToSubmit;

    /** Send at intervals  events from stack */
    setInterval(this.#checkEvents.bind(this), debounceMs);
  }

  /** Adds event to stack */
  #addEvent(args) {
    const [event, ...tags] = args;
    const ts = new Date();
    const eventData = {
      event,
      tags,
      ts,
      id: ts.toISOString(), //not the best id, but it works
      url: document.URL,
      title: document.title,
    };

    this.eventsStack.push(eventData);

    if (this.eventsStack.length >= this.maxEventsStack) {
      this.readyToSubmit = true;
    }
  }

  /** sends POST http request to backend */
  #postTrackEvents() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8001/track"); // :(
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({ trackEvents: this.eventsStack }));
      xhr.onload = () => {
        const status = xhr.status;
        resolve(status);
      };
      xhr.onerror = () => {
        reject("Something went wrong");
      };
    });
  }

  /** submit events from stack to server, in case of success filters out them from stack*/
  #submitTrackEventsStack() {
    const eventsToSubmitIds = this.eventsStack.map(({ id }) => id);

    this.#postTrackEvents()
      .then(status => {
        if (status === 200) {
          this.eventsStack = this.eventsStack.filter(
            e => !eventsToSubmitIds.includes(e.id)
          );
        }
      })
      .catch(console.log);
  }

  /** if something has been added to the stack submit them */
  #checkEvents() {
    if (this.eventsStack.length > 0) {
      this.#submitTrackEventsStack();
    } else {
      this.readyToSubmit = true;
    }
  }

  /** tracks new event from user activity */
  track(...args) {
    this.#addEvent(args);

    if (this.readyToSubmit) {
      this.#submitTrackEventsStack();
      this.readyToSubmit = false;
    }
  }
}

let tracker = new Tracker({
  eventsStack: [],
  maxEventsStack: 3,
  debounceMs: 1000,
  readyToSubmit: true,
});

window.addEventListener("beforeunload", () => tracker.track("unload"), {
  once: true,
});
