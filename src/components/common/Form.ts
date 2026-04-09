import classNames from "classnames";
import Component, {type CommonComponent, type CommonProps, type CommonState} from "~/components/Component";
import FormObserver, {FORM_EVENT_SUBMIT, type FormEvent, type FormSubscriber} from "~/features/FormObserver";

import classes from "./Form.module.pcss"

export type FormValues = Record<string, unknown>

export interface FormProps<ValuesType extends FormValues = FormValues> extends CommonProps{
    name?: string,
    method?: string,
    onSubmit?: (e: SubmitEvent) => unknown,
    preventDefault?: boolean,
    initialValues?: ValuesType,
}

export interface FormState extends CommonState{
    disabled?: boolean,
}

export default class Form<ValuesType extends FormValues = FormValues> extends Component<FormProps<ValuesType>, FormState>{
    public formObserver?: FormObserver
    declare current: HTMLFormElement
    
    constructor(props: FormProps = {}, state: CommonState = {}, parentComponent: CommonComponent | null = null) {
        super({
            method: "get",
            preventDefault: true,
            ...props
        } as FormProps<ValuesType>, state, parentComponent)
        this.formObserver = new FormObserver()
    }
    
    formSubscribe(subscriber: FormSubscriber): void{
        this.formObserver?.subscribe(subscriber)
    }
    
    formNotify(event: FormEvent, ...params: unknown[]): void{
        this.formObserver?.notifySubscribers(event, ...params)
    }
    
    isDisabled(): boolean{
        return Boolean(this.state.disabled)
    }
    
    renderElement(): HTMLFormElement {
        const form = document.createElement('form')
        form.method = this.props.method || "get"
        form.name = this.props.name || "form"
        form.className = classNames(this.props.className, classes.form)
        form.addEventListener("submit", (e) => {
            if (this.props.preventDefault) {
                e.preventDefault()
            }
            if (this.props.onSubmit) {
                this.props.onSubmit(e)
            }
            this.formNotify(FORM_EVENT_SUBMIT, e)
        })
        return form
    }
}