import { InjectionToken } from "@angular/core";

export interface DownloadDocContext {
    setField : (fieldName: string, value: string) => void;
}

export const DOWNLOAD_DOC_CONTEXT = new InjectionToken<DownloadDocContext>('DOWNLOAD_DOC_CONTEXT');