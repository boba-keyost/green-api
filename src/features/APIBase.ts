import APIObserver, {
    API_EVENT_ERROR,
    API_EVENT_START,
    API_EVENT_SUCCESS,
    type APISubscriber
} from "~/features/APIObserver";
import APIState, {type APIResult} from "~/features/APIState";
import {capitalize, composeURLString, getAPIEndpoint} from "~/lib";
import type {URLScheme} from "~/misc.types";

export type APIRequestCreator = (url: string, params: RequestInit) => Request
export type APIResponseParser<ResponseType> = (response?: Response) => Promise<ResponseType>

export type APIRequestParams = {
    url: string,
    method?: string,
    body?: unknown
}

export class APIBase{
    protected state: APIState
    protected observer: APIObserver
    
    protected baseURL: string
    protected requestCreator?: APIRequestCreator
    protected defaultParser?: APIResponseParser<unknown>
    
    constructor(baseURL: string, requestCreator?: APIRequestCreator) {
        this.state = new APIState()
        this.observer = new APIObserver()
        this.baseURL = baseURL
        this.requestCreator = requestCreator
        this.defaultParser = async (response?: Response): Promise<unknown> => response && response.json()
    }
    
    subscribe(subscriber: APISubscriber): void{
        this.observer.subscribe(subscriber)
    }
    
    prepareRequest({url, method, body}: APIRequestParams): Request {
        method = method ? method.trim().toUpperCase() : "GET"
        const params: RequestInit = {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        const urlParams: Partial<URLScheme> = {
            host: getAPIEndpoint(""),
            pathname: `/waInstance{{.idInstance}}/${url}/{{.apiTokenInstance}}`
        }
        if (body) {
            const bodyInit = body as BodyInit
            if (method === "GET") {
                urlParams.query = bodyInit
            } else {
                params.body = JSON.stringify(bodyInit)
            }
        }
        url = composeURLString(urlParams)
        
        return this.requestCreator ? this.requestCreator(url, params) : new Request(url, params)
    }
    
    async execAndParse<ResponseType>(name: string, params: APIRequestParams, parser?: APIResponseParser<ResponseType>):Promise<ResponseType> {
        return this.exec(name, params).then((result: APIResult) => {
            if (result.error) {
                throw result.error
            }
            if (!parser) {
                parser = this.defaultParser as APIResponseParser<ResponseType>
            }
            if (!parser) {
                throw new Error('parser no defined')
            }
            return parser(result.response)
        })
    }
    
    async exec(name: string, params: APIRequestParams):Promise<APIResult> {
        const request = this.prepareRequest(params)
        if (name === "") {
            name = request.method + capitalize(params.url)
        }
        const result: APIResult = {
            name,
            request,
            success: false,
            startTime: new Date(),
        }
        return Promise.resolve(result)
            .then((result) => {
                this.observer.notifySubscribers(API_EVENT_START, name, result)
                
                return result
            })
            .then(async result => {
                const response  = await fetch(result.request)
                result.response = response
                result.success = response.ok
                result.finishTime = new Date()
                this.observer.notifySubscribers(response.ok ? API_EVENT_SUCCESS : API_EVENT_ERROR, name, result)
                return result
            })
            .catch((e: unknown) => {
                result.error = e
                result.success = false
                this.observer.notifySubscribers(API_EVENT_ERROR, name, result)
                return result
            })
    }
}