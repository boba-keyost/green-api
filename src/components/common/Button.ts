import classNames from "classnames";
import type Form from "~/components/common/Form";
import type {InputState} from "~/components/common/Input";
import Component, {type CommonProps} from "~/components/Component";
import {FORM_EVENT_CHANGE} from "~/features/FormObserver";

import classes from "./Button.module.pcss"

export interface ButtonProps extends CommonProps{
    type?: HTMLButtonElement["type"]
    name?: string,
    text?: string,
    onClick?: (e: Event) => unknown,
    preventDefault?: boolean,
}

export default class Button extends Component<ButtonProps, InputState, HTMLButtonElement>{
    declare protected parentComponent: Form | null
    constructor(props: ButtonProps = {}, state: InputState = {}, parentComponent: Form | null = null) {
        if (!parentComponent) {
            throw new Error('Parent form not defined')
        }
        super(props, state, parentComponent);
    }
    
    renderElement(): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button')
        button.className = classNames(this.props.className, classes.button)
        button.type = this.props.type || "button"
        button.innerText = this.props.text || "ok"
        button.addEventListener("click", (e) => {
            if (this.props.preventDefault) {
                e.preventDefault()
            }
            if (this.props.onClick) {
                this.props.onClick(e)
            }
            if (this.parentComponent) {
                const target: HTMLInputElement = e.target as HTMLInputElement
                this.parentComponent.formNotify(FORM_EVENT_CHANGE, e, target.name, target.value)
            }
        })
        return button
    }
    
    applyState() {
        if (this.current) {
            this.current.disabled = Boolean(this.state.disabled)
        }
    }
}