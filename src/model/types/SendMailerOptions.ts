export interface SendMailerOptions {
    to?: string;   // 多个收件人 用逗号隔开
    from?: string;
    subject?: string;
    text?: string;
    html?: string;
}
