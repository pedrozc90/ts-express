export interface IPing {
    env: string;
    timezone: string;
    timestamp: Date;
    timestamp_locale: string;
    app: {
        name: string;
        version: string;
    }
}
