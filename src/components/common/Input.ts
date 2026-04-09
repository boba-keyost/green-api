import classNames from "classnames";
import Form, {type FormValues} from "~/components/common/Form";
import Component, {type CommonProps, type CommonState} from "~/components/Component";
import {FORM_EVENT_CHANGE} from "~/features/FormObserver";

import classes from "./Input.module.pcss"

export interface InputState<ValuesType extends FormValues = FormValues, NameType extends keyof ValuesType = keyof ValuesType> extends CommonState{
    disabled?: boolean,
    value?: ValuesType[NameType],
}

export interface InputPropsCommon<ValuesType extends FormValues = FormValues, NameType extends keyof ValuesType = keyof ValuesType> extends CommonProps{
    name?: NameType,
    placeholder?: string,
    onChange?: (e: Event) => unknown,
    preventDefault?: boolean,
    required?: boolean
}

export interface InputProps<ValuesType extends FormValues = FormValues, NameType extends keyof ValuesType = keyof ValuesType> extends InputPropsCommon<ValuesType, NameType>, CommonProps{
    type?: HTMLInputElement["type"]
}

export default class Input<ValuesType extends FormValues = FormValues, NameType extends keyof ValuesType = keyof ValuesType> extends Component<InputProps<ValuesType, NameType>, InputState<ValuesType, NameType>, HTMLInputElement>{
    declare protected parentComponent: Form | null
    constructor(props: InputProps<ValuesType, NameType> = {}, state: InputState<ValuesType, NameType> = {}, parentComponent: Form | null = null) {
        if (!parentComponent) {
            throw new Error('Parent form not defined')
        }
        super(props, state, parentComponent);
    }
    
    renderElement(): HTMLInputElement {
        const input: HTMLInputElement = document.createElement('input')
        input.className = classNames(this.props.className, classes.input)
        input.name = this.props.name ? String(this.props.name) : "input"
        input.type = this.props.type || "text"
        input.required = Boolean(this.props.required)
        input.placeholder = this.props.placeholder || ""
        input.addEventListener("change", (e) => {
            if (this.props.preventDefault) {
                e.preventDefault()
            }
            if (this.props.onChange) {
                this.props.onChange(e)
            }
            const target: HTMLInputElement = e.target as HTMLInputElement
            this.updateState({value: target.value as ValuesType[NameType]})
            if (this.parentComponent) {
                this.parentComponent.formNotify(FORM_EVENT_CHANGE, e, target.name, target.value)
            }
        })
        return input
    }
    
    applyState() {
        if (this.current) {
            this.current.disabled = Boolean(this.state.disabled)
            this.current.value = this.state.value ? String(this.state.value) : ""
        }
    }
}