import classNames from "classnames";
import Component, {
    type CommonComponent,
    type CommonProps,
    type CommonState,
    type ComponentElement
} from "~/components/Component";

import "reset-css/reset.css"
import "~/styles/variables.pcss"
import "~/styles/main.pcss"
import ApiParametersForm from "~/components/forms/ApiParametersForm";
import GetSettingsForm from "~/components/forms/GetSettingsForm";
import GetStateInstanceForm from "~/components/forms/GetStateInstanceForm";
import SendFileByUrlForm from "~/components/forms/SendFileByUrlForm";
import SendMessageForm from "~/components/forms/SendMessageForm";
import Column, {type ColumnProps} from "~/components/templates/Column";
import Result from "~/components/templates/Result";
import {API, type SendFileByUrlRequest, type SendMessageRequest} from "~/features/API";
import {FORM_EVENT_CHANGE, type FormEvent} from "~/features/FormObserver";
import {queryStringify} from "~/lib";

import classes from "./App.module.pcss"

export interface AppState extends CommonState {
    idInstance?: string,
    apiTokenInstance?: string,
    loading?: boolean,
    lastError?: unknown,
}

export type AppProps = CommonProps

export default class App extends Component<AppProps, AppState>{
    protected api?: API
    protected apiParametersForm?: ApiParametersForm
    protected getSettingsForm?: GetSettingsForm
    protected getStateInstanceForm?: GetStateInstanceForm
    protected sendFileByUrlForm?: SendFileByUrlForm
    protected sendMessageForm?: SendMessageForm
    
    protected result?: Result
    
    constructor(props: AppProps = {}, state: AppState = {}, parentComponent: CommonComponent | null = null) {
        super(props, state, parentComponent)
        this.api = new API(
            "",
            (url: string, params: RequestInit): Request => {
                if (!this.state?.idInstance) {
                    throw new Error('idInstance not defined')
                }
                if (!this.state?.apiTokenInstance) {
                    throw new Error('apiTokenInstance not defined')
                }
                const repl = new RegExp("\\{\\{\\s*\\.(\\w+)\\s*}}", 'g')
                return new Request(
                    url.replace(repl, (_, param) => String(this.state["" + param] || "")),
                    params
                )
            }
        )
    }
    
    renderElement(): ComponentElement {
        const app = document.createElement('div')
        app.className = classNames(this.props.className, classes.app)
        
        const cols = document.createElement('div')
        cols.className = classNames(this.props.className, classes.columns)
        
        this.apiParametersForm = new ApiParametersForm({
            className: classes.apiParametersForm,
            classes,
            initialValues: {"id-instance": this.state.idInstance, "api-token-instance": this.state.apiTokenInstance}
        }, {}, this)
        this.apiParametersForm.formSubscribe((event: FormEvent, _e, name, value) => {
            if (event === FORM_EVENT_CHANGE && typeof name === "string" && typeof value === "string") {
                const newState: Partial<AppState> = {}
                switch(name) {
                    case "id-instance":
                        newState.idInstance = value.trim()
                        break;
                    case "api-token-instance":
                        newState.apiTokenInstance = value.trim()
                        break;
                }
                this.updateState(newState)
            }
        })
        
        this.getSettingsForm = new GetSettingsForm({
            className: classes.getSettingsForm,
            classes,
            onSubmit: (e) => this.getSettingsHandle(e)
        }, {}, this)
        
        this.getStateInstanceForm = new GetStateInstanceForm({
            className: classes.getStateInstanceForm,
            classes,
            onSubmit: (e) => this.getStateInstanceHandle(e)
        }, {}, this)
        
        this.sendMessageForm = new SendMessageForm({
            className: classes.sendMessageForm,
            classes,
            onSubmit: (e) => this.sendMessageHandle(e)
        }, {}, this)
        
        this.sendFileByUrlForm = new SendFileByUrlForm({
            className: classes.sendFileByUrlForm,
            classes,
            onSubmit: (e) => this.sendFileByUrlHandle(e)
        }, {}, this)
        
        this.result = new Result({
            className: classes.result,
            classes,
        }, {}, this)
        
        const columns: {props: ColumnProps, components: CommonComponent[]}[] = [
            {
                props: {className: classes.forms},
                components: [
                    this.apiParametersForm,
                    this.getSettingsForm,
                    this.getStateInstanceForm,
                    this.sendMessageForm,
                    this.sendFileByUrlForm,
                ]
            },
            {
                props: {className: classes.results, header: "Ответ"},
                components: [
                    this.result,
                ]
            },
        ]
        
        columns.forEach(column => {
            const col = new Column({
                ...column.props,
                className: classNames(classes.column, column.props.className)
            }).render(cols)
            
            column.components.forEach(component => {
                const section = document.createElement('section')
                section.className = classes.section
                component.render(section)
                col.appendChild(section)
            })
        })
        
        app.appendChild(cols)
        
        return app
    }
    
    applyState(updateKeys?: (keyof AppState)[]) {
        if (updateKeys && (updateKeys.includes("apiTokenInstance") || updateKeys.includes("idInstance"))) {
            const params = {
                "id-instance": this.state.idInstance || undefined,
                "api-token-instance": this.state.apiTokenInstance || undefined,
            }
            history.pushState(params, "", "./?" + queryStringify(params))
        }
        const disabled = this.state.loading || !(this.state.apiTokenInstance && this.state.idInstance)
        this.getSettingsForm?.updateState({disabled})
        this.getStateInstanceForm?.updateState({disabled})
        this.sendMessageForm?.updateState({disabled})
        this.sendFileByUrlForm?.updateState({disabled})
    }
    
    sendApiHandle(apiCall?: () => Promise<unknown>):void {
        if (apiCall) {
            (async () => {
                this.updateState({loading: true})
                let response: unknown = undefined
                let failed: boolean = false
                try {
                    response = await apiCall()
                } catch (err) {
                    failed = true
                    response = {error: err && typeof err === "object" ? err.toString() : (err || "something went wrong")}
                }
                this.result?.updateState({
                    response,
                    failed
                })
                this.updateState({loading: false})
            })()
        }
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSettingsHandle(_e: SubmitEvent) {
        this.sendApiHandle(async () => await this.api?.getSettings())
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getStateInstanceHandle(_e: SubmitEvent) {
        this.sendApiHandle(async () => await this.api?.getStateInstance())
    }
    
    sendMessageHandle(e: SubmitEvent) {
        if (e.target) {
            const data = new FormData(e.target as HTMLFormElement);
            const values: SendMessageRequest = {
                chatId: data.has("chat-id") ? String(data.get("chat-id")) : "",
                message: data.has("message") ? String(data.get("message")) : "",
            }
            this.sendApiHandle(async () => await this.api?.sendMessage(values))
        }
    }
    
    sendFileByUrlHandle(e: SubmitEvent) {
        if (e.target) {
            const data = new FormData(e.target as HTMLFormElement);
            const urlFile = data.has("url") ? String(data.get("url")) : "";
            const values: SendFileByUrlRequest = {
                chatId: data.has("chat-id") ? String(data.get("chat-id")) : "",
                urlFile,
                fileName: urlFile.split('/').reverse()[0],
            }
            this.sendApiHandle(async () => await this.api?.sendFileByUrl(values))
        }
    }
}