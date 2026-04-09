import App from "~/components/templates/App";
import {classPrefix} from "~/lib";

const rootID = classPrefix("root");
const rootElement = document.getElementById(rootID);

if (!rootElement) {
    throw new Error(`Root element with id #${rootID} is missing`)
}
const url = new URL(window.location.href)
const app = new App(
    {},
    {
        idInstance: url.searchParams.has("id-instance") ? String(url.searchParams.get("id-instance")) : "",
        apiTokenInstance: url.searchParams.has("api-token-instance") ? String(url.searchParams.get("api-token-instance")) : "",
    }
)
app.render(rootElement)