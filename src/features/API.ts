import {APIBase} from "~/features/APIBase";

export type GetSettingsRequest = void
export type GetSettingsResponse = {
    wid: string,
    countryInstance: string,
    typeAccount: string,
    webhookUrl: string,
    webhookUrlToken: string,
    delaySendMessagesMilliseconds: number,
    markIncomingMessagesReaded: string,
    markIncomingMessagesReadedOnReply: string,
    sharedSession: string,
    outgoingWebhook: string,
    outgoingMessageWebhook: string,
    outgoingAPIMessageWebhook: string,
    incomingWebhook: string,
    deviceWebhook: string,
    statusInstanceWebhook: string,
    stateWebhook: string,
    enableMessagesHistory: string,
    keepOnlineStatus: string,
    pollMessageWebhook: string,
    incomingBlockWebhook: string,
    incomingCallWebhook: string,
    editedMessageWebhook: string,
    deletedMessageWebhook: string
}


export type GetStateInstanceRequest = void
export type GetStateInstanceResponse = {
    stateInstance: string,
}

export type SendMessageRequest = {
    chatId: string,
    message: string,
    quotedMessageId?: string,
    linkPreview?: boolean,
    typePreview?: string,
    customPreview?: {
        title: string,
        description?: string,
        link?: string,
        urlFile?: string,
        jpegThumbnail?: string,
    },
    typingTime?: number,
}
export type SendMessageResponse = {
    idMessage: string
}

export type SendFileByUrlRequest = {
    chatId: string,
    urlFile: string,
    fileName: string,
    caption?: string,
    quotedMessageId?: string,
    typingTime?: number,
    typingType?: string,
}
export type SendFileByUrlResponse = {
    idMessage: string
}

export class API extends APIBase{
    async getSettings(body: GetSettingsRequest): Promise<GetSettingsResponse>{
        return this.execAndParse<GetSettingsResponse>("", {url: "getSettings", body} )
    }
    async getStateInstance(body: GetStateInstanceRequest): Promise<GetStateInstanceResponse>{
        return this.execAndParse<GetStateInstanceResponse>("", {url: "getStateInstance", body})
    }
    async sendMessage(body: SendMessageRequest): Promise<SendMessageResponse>{
        return this.execAndParse<SendMessageResponse>("", {url: "sendMessage", method: "post", body})
    }
    async sendFileByUrl(body: SendFileByUrlRequest): Promise<SendFileByUrlResponse>{
        return this.execAndParse<SendFileByUrlResponse>("", {url: "sendFileByUrl", method: "post", body})
    }
}