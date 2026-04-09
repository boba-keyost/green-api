import Observer, {type Subscriber} from "~/features/Observer";

export const COMPONENT_EVENT_RENDERED = Symbol("component-event-rendered")
export const COMPONENT_EVENT_UPDATED = Symbol("component-event-updated")

export type ComponentEvent = typeof COMPONENT_EVENT_UPDATED | typeof COMPONENT_EVENT_RENDERED

export type ComponentSubscriber = Subscriber<ComponentEvent>

export default class ComponentObserver extends Observer<ComponentEvent> {
}