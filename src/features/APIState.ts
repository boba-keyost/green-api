export interface APIResult{
    name: string,
    success: boolean,
    startTime: Date,
    finishTime?: Date,
    request: Request,
    response?: Response,
    error?: unknown,
}

export default class APIState {
    protected history: APIResult[] = []
    
    getLastResult(name?: string): APIResult | undefined{
        return this.getLastResultWithFilter(name ? ((r: APIResult) => r.name === name) : undefined)
    }
    
    getLastResultWithFilter(filter?: (result: APIResult) => boolean): APIResult | undefined{
        for (let i = this.history.length; i >=0; i--) {
            if (filter === undefined || filter(this.history[i])) {
                return this.history[i]
            }
        }
        return undefined
    }
    
    addResult(result: APIResult): void{
        this.history.push(result)
    }
}