import ComponentObserver, {
    COMPONENT_EVENT_RENDERED,
    COMPONENT_EVENT_UPDATED,
    type ComponentEvent,
    type ComponentSubscriber
} from "~/features/ComponentObserver";

export type ComponentElement = Element | null

export interface CommonComponent<StateType extends CommonState = CommonState, ComponentType extends ComponentElement = ComponentElement> {
    isInitialized(): boolean
    init(): void
    render(container: HTMLElement): ComponentType
    renderElement(): ComponentType
    
    updateState(newState: Partial<StateType>): boolean
    
    update(updateKeys?: (keyof StateType)[]): void
    applyState(updateKeys?: (keyof StateType)[]): void
}

export interface CommonProps {
    [key: string]: unknown,
    className?: string
    classes?: Record<string, string>
}
export interface CommonState {
    [key: string]: unknown,
}

export default class Component<PropsType extends CommonProps = CommonProps, StateType extends CommonState = CommonState, ComponentType extends ComponentElement = ComponentElement> implements CommonComponent<StateType, ComponentType>{
    protected parentComponent: CommonComponent<StateType> | null
    protected props: PropsType
    protected state: StateType
    protected current?: ComponentType
    protected initialized: boolean = false
    
    protected observer?: ComponentObserver
    
    constructor(props: PropsType = {} as PropsType, state: StateType = {} as StateType, parentComponent: CommonComponent<StateType> | null = null) {
        this.parentComponent = parentComponent
        this.initialized = false
        this.props = props
        this.state = state
        this.observer = new ComponentObserver()
        this.init()
    }
    
    subscribe(subscriber: ComponentSubscriber): void{
        this.observer?.subscribe(subscriber)
    }
    
    notify(event: ComponentEvent, ...params: unknown[]): void{
        this.observer?.notifySubscribers(event, ...params)
    }
    
    isInitialized(): boolean {
        return this.initialized
    }
    
    init() {
        this.initialized = true
    }
    
    render(container?: HTMLElement): ComponentType {
        this.current = this.renderElement()
        this.applyState([])
        if (container && this.current) {
            container.appendChild(this.current)
        }
        this.notify(COMPONENT_EVENT_RENDERED)
        return this.current
    }
    
    renderElement(): ComponentType{
        return null as ComponentType
    }
    
    updateState(newState: Partial<StateType>): boolean{
        let shouldUpdate: boolean = false
        const updateKeys: (keyof StateType)[] = []
        for (const i in newState) {
            if (this.state[i] !== newState[i]) {
                this.state[i] = newState[i] as StateType[Extract<keyof StateType, string>]
                updateKeys.push(i)
                shouldUpdate = true
            }
        }
        if (shouldUpdate) {
            this.update(updateKeys)
        }
        
        return shouldUpdate
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    applyState(_updateKeys?: (keyof StateType)[]){}
    
    update(updateKeys?: (keyof StateType)[]){
        this.notify(COMPONENT_EVENT_UPDATED, updateKeys)
        this.applyState(updateKeys)
    }
}