import classNames from "classnames";
import Button from "~/components/common/Button";
import Form, {type FormProps, type FormState} from "~/components/common/Form";
import Input from "~/components/common/Input";
import TextArea from "~/components/common/TextArea";
import {type CommonComponent} from "~/components/Component";

import classes from './SendMessageForm.module.pcss'

export type  SendMessageFormValues = {
    "chat-id"?: string,
    "message"?: string,
}

export default class SendMessageForm extends Form<SendMessageFormValues>{
    protected fields: CommonComponent[] = []
    constructor(props: FormProps = {}, state: FormState = {}, parentComponent: CommonComponent | null = null) {
        super({
            name: "send-message-form",
            className: classes.sendMessageForm,
            ...props,
        }, state, parentComponent);
    }
    
    renderElement(): HTMLFormElement {
        const form = super.renderElement()
        
        this.fields = [
            new Input<SendMessageFormValues>({name: "chat-id", placeholder: "chatId", required: true}, {disabled: this.state.disabled}, this),
            new TextArea<SendMessageFormValues>({name: "message", placeholder: "Hello world!", asDiv: false, required: true}, {disabled: this.state.disabled}, this),
            new Button({name: "submit", type: "submit", text: "sendMessage"}, {disabled: this.state.disabled}, this),
        ]
        this.fields.forEach(component => {
            const row = document.createElement('div')
            row.className = classNames(classes.row, this.props.classes?.row)
            component.render(row)
            form.appendChild(row)
        })
        
        return form
    }
    
    update() {
        this.fields.forEach(component => component.updateState({disabled: this.state.disabled}))
    }
}