export default class Common{
    protected container: HTMLElement
    protected initialised: boolean = false
    
    constructor(container: HTMLElement) {
        this.initialised = false
        this.container = container
        this.init()
    }
    
    init() {
        if (!this.container) {
            throw new Error('Container not defined')
        }
        this.initialised = true
    }
}