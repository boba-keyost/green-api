export type Subscriber<EventType extends symbol> = (event: EventType, ...params: unknown[]) => void

export default class Observer<EventType extends symbol> {
    protected subscribers: Subscriber<EventType>[] = []
    
    constructor() {
        this.subscribers = []
    }
    
    subscribe(subscriber: Subscriber<EventType>): void {
        this.subscribers.push(subscriber)
    }
    
    unsubscribe(subscriber: Subscriber<EventType>): void {
        this.subscribers = this.subscribers.filter(s => s !== subscriber)
    }
    
    notifySubscribers(event: EventType, ...params: unknown[]): void {
        this.subscribers.forEach(s => s(event, ...params))
    }
}