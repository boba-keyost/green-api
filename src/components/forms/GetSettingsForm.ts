import classNames from "classnames";
import Button from "~/components/common/Button";
import Form, {type FormProps, type FormState} from "~/components/common/Form";
import {type CommonComponent} from "~/components/Component";

import classes from './GetSettingsForm.module.pcss'

export default class GetSettingsForm extends Form{
    protected button?: Button
    constructor(props: FormProps = {}, state: FormState = {}, parentComponent: CommonComponent | null = null) {
        super({
            name: "get-settings-form",
            className: classes.getSettingsForm,
            ...props,
        }, state, parentComponent);
    }
    
    renderElement(): HTMLFormElement {
        const form = super.renderElement()
        
        const row = document.createElement('div')
        row.className = classNames(classes.row, this.props.classes?.row)
        this.button = new Button(
            {text: "getSettings", type: "submit"},
            {disabled: this.state.disabled},
            this
        )
        this.button.render(row)
        form.appendChild(row)
        
        return form
    }
    
    update() {
        this.button?.updateState({disabled: this.state.disabled})
    }
}