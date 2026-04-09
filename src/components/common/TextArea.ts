import classNames from "classnames";
import Form, {type FormValues} from "~/components/common/Form";
import type {InputPropsCommon, InputState} from "~/components/common/Input";
import Component, {type CommonProps} from "~/components/Component";
import {FORM_EVENT_CHANGE} from "~/features/FormObserver";
import inputClasses from "./Input.module.pcss"

import classes from "./TextArea.module.pcss"

export type TextAreaState<ValuesType extends FormValues = FormValues, NameType extends keyof ValuesType = keyof ValuesType> = InputState<ValuesType, NameType>

export interface TextAreaProps<ValuesType extends FormValues = FormValues, NameType extends keyof ValuesType = keyof ValuesType> extends InputPropsCommon<ValuesType, NameType>, CommonProps{
    asDiv?: boolean,
}

export default class TextArea<ValuesType extends FormValues = FormValues, NameType extends keyof ValuesType = keyof ValuesType> extends Component<TextAreaProps<ValuesType, NameType>, TextAreaState<ValuesType, NameType>, HTMLTextAreaElement | HTMLDivElement>{
    declare protected parentComponent: Form | null
    constructor(props: TextAreaProps<ValuesType, NameType> = {}, state: TextAreaState<ValuesType, NameType> = {}, parentComponent: Form | null = null) {
        if (!parentComponent) {
            throw new Error('Parent form not defined')
        }
        super(props, state, parentComponent);
    }
    
    renderElement(): HTMLTextAreaElement | HTMLDivElement {
        const asDiv = Boolean(this.props.asDiv)
        let element: HTMLTextAreaElement | HTMLDivElement
        const name = this.props.name ? String(this.props.name) : "textarea"
        const placeholder = this.props.placeholder || ""
        if (asDiv) {
            const div = document.createElement('div')
            div.setAttribute("data-name", name)
            div.setAttribute("data-placeholder", placeholder)
            element = div
        } else {
            const textarea = document.createElement('textarea')
            textarea.name = name
            textarea.placeholder = this.props.placeholder || ""
            textarea.required = Boolean(this.props.required)
            element = textarea
        }
        
        element.className = classNames(this.props.className, classes.textarea, inputClasses.input)
        element.addEventListener("change", (e) => {
            if (this.props.preventDefault) {
                e.preventDefault()
            }
            if (this.props.onChange) {
                this.props.onChange(e)
            }
            if (this.parentComponent) {
                let targetName: string, targetValue: string
                if (asDiv) {
                    const target = e.target as HTMLDivElement
                    targetName = name
                    targetValue = target.innerText
                } else {
                    const target = e.target as HTMLTextAreaElement
                    targetName = target.name
                    targetValue = target.value
                }
                this.parentComponent.formNotify(FORM_EVENT_CHANGE, e, targetName, targetValue)
            }
        })
        return element
    }
    
    applyState() {
        if (this.current) {
            if (this.props.asDiv) {
                const div = this.current as HTMLDivElement
                if (this.state.disabled) {
                    div.setAttribute("disabled", "disabled")
                } else {
                    div.removeAttribute("disabled")
                }
                div.contentEditable = !this.state.disabled ? "plaintext-only" : "false"
                div.innerText = this.state.value ? String(this.state.value) : ""
            } else {
                const textarea = this.current as HTMLTextAreaElement
                textarea.disabled = Boolean(this.state.disabled)
                textarea.innerText = this.state.value ? String(this.state.value) : ""
            }
        }
    }
}