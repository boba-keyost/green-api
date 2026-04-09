import {type ParsedQs} from "qs";
import {type UrlWithStringQuery} from "url";

export type NonUndefined<T> = T extends undefined ? never : T

export interface URLScheme extends  Omit<UrlWithStringQuery, "query"> {
    query?: ParsedQs | BodyInit | string | null
}
export type RetURLParam = boolean | string | ((toScheme: Partial<URLScheme>, locationScheme: Partial<URLScheme> | false, dryRun?: boolean) => boolean | string)