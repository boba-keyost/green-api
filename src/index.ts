import App from "~/components/App";
import {classPrefix} from "~/lib";

const rootID = classPrefix("root");
const rootElement = document.getElementById(rootID);
if (rootElement) {
    const app = new App(rootElement)
    app.render()
} else {
    console.error(`Root element with id #${rootID} is missing`);
}
