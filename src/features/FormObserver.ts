import Observer, {type Subscriber} from "~/features/Observer";

export const FORM_EVENT_CHANGE = Symbol("form-event-change")
export const FORM_EVENT_SUBMIT = Symbol("form-event-submit")

export type FormEvent = typeof FORM_EVENT_CHANGE | typeof FORM_EVENT_SUBMIT

export type FormSubscriber = Subscriber<FormEvent>

export default class FormObserver extends Observer<FormEvent> {
}