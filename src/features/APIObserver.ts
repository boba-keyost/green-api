import Observer, {type Subscriber} from "~/features/Observer";

export const API_EVENT_START = Symbol("api-event-start")
export const API_EVENT_ERROR = Symbol("api-event-error")
export const API_EVENT_SUCCESS = Symbol("api-event-success")

export type APIEvent = typeof API_EVENT_START | typeof API_EVENT_ERROR | typeof API_EVENT_SUCCESS

export type APISubscriber = Subscriber<APIEvent>

export default class APIObserver extends Observer<APIEvent> {}