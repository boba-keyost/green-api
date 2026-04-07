import Common from "~/components/Common";

export default class App extends Common{
    render() {
        this.init()
        this.container.innerText = "rendered"
    }
}