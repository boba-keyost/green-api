import classNames from "classnames";
import Component, {type CommonProps, type CommonState} from "~/components/Component";

import classes from "./Result.module.pcss"

export interface ResultState extends CommonState{
    failed?: boolean,
    response?: unknown,
}

export type ResultProps = CommonProps

export default class Result extends Component<ResultProps, ResultState, HTMLPreElement>{
    renderElement(): HTMLPreElement {
        return document.createElement('pre')
    }
    
    applyState() {
        if (this.current) {
            this.current.className = classNames(this.props.className, classes.result, this.state.failed ? classes.failed : classes.success)
            if (this.state.response) {
                this.current.innerText = JSON.stringify(this.state.response, null, '  ')
            }
        }
    }
}