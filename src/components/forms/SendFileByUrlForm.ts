import classNames from "classnames";
import Button from "~/components/common/Button";
import Form, {type FormProps, type FormState} from "~/components/common/Form";
import Input from "~/components/common/Input";
import {type CommonComponent} from "~/components/Component";

import classes from './SendFileByUrlForm.module.pcss'

export type  SendFileByUrlFormValues = {
    "chat-id"?: string,
    "url"?: string,
}

export default class SendFileByUrlForm extends Form<SendFileByUrlFormValues>{
    protected fields: CommonComponent[] = []
    constructor(props: FormProps = {}, state: FormState = {}, parentComponent: CommonComponent | null = null) {
        super({
            name: "send-file-by-url-form",
            className: classes.sendFileByUrlForm,
            ...props,
        }, state, parentComponent);
    }
    
    renderElement(): HTMLFormElement {
        const form = super.renderElement()
        
        this.fields = [
            new Input<SendFileByUrlFormValues>({name: "chat-id", placeholder: "chatId", required: true}, {disabled: this.state.disabled}, this),
            new Input<SendFileByUrlFormValues>({name: "url", placeholder: "https://image.url/pic.png", required: true}, {disabled: this.state.disabled}, this),
            new Button({name: "submit", type: "submit", text: "sendFileByUrl"}, {disabled: this.state.disabled}, this),
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