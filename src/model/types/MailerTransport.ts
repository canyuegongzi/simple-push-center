export interface AuthTransport {
     user?: string;
     pass?: string;
}
export interface TlsTransport {
    ciphers?: string;
}
export interface MailerTransport {
    auth: AuthTransport;
    tls?: TlsTransport;
    port?: number;
    host?: string;
    service?: string;
    secureConnection?: any;
    sendMail?: (...args: any[]) => Promise<any>;
    // sendMail(mailOptions: any, callback: any): any;
}
