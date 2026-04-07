export default class Common{
    protected container: HTMLElement
    protected initialised: boolean
    
    constructor(container: HTMLElement) {
        this.container = container
    }
    
    init() {
        if (!this.container) {
            throw new Error('Container not defined')
        }
        this.initialised = true
    }
    
    render() {
        this.init()
    }
}