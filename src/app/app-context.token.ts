import { InjectionToken } from "@angular/core";

export interface AppContext {
    registerSection: (ID: string, initialValues : number[], initialLabels: { [key: string]: string }) => void;
    setValue: (ID: string, values : number[], labels: { [key: string]: string }) => void;
    unregisterSection: (ID: string) => void;
    requestDocument: (projectName: string, location: string, developer: string, projector: string) => void;
}

export const APP_CONTEXT = new InjectionToken<AppContext>('APP_CONTEXT');