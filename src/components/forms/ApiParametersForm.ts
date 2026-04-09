import classNames from "classnames";
import Form, {type FormProps, type FormState} from "~/components/common/Form";
import Input, {type InputProps} from "~/components/common/Input";
import {type CommonComponent} from "~/components/Component";

import classes from './ApiParametersForm.module.pcss'

export type ApiParametersFormValues = {
    "id-instance"?: string,
    "api-token-instance"?: string,
}

export default class ApiParametersForm extends Form<ApiParametersFormValues>{
    constructor(props: FormProps<ApiParametersFormValues> = {}, state: FormState = {}, parentComponent: CommonComponent | null = null) {
        super({
            name: "api-parameters-form",
            className: classes.apiParametersForm,
            ...props,
        }, state, parentComponent);
    }
    
    renderElement(): HTMLFormElement {
        const form = super.renderElement()
        
        const fields: InputProps<ApiParametersFormValues>[] = [
            {name: "id-instance", placeholder: "idInstance"},
            {name: "api-token-instance", placeholder: "apiTokenInstance"},
        ]
        fields.forEach(inputProps => {
            const row = document.createElement('div')
            row.className = classNames(classes.row, this.props.classes?.row)
            const value = inputProps.name ? this.props?.initialValues?.[inputProps.name] : ""
            new Input(
                inputProps,
                {value},
                this
            ).render(row)
            form.appendChild(row)
        })
        
        return form
    }
}