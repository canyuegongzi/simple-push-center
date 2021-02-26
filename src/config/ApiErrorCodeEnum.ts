export enum ApiErrorCode {
    TIMEOUT = -1, // 系统繁忙
    SUCCESS = 0, // 成功
    TOKEN_FAIL = 30001,
    USER_ID_INVALID = 10001, // 用户id无效
    USER_NAME_HAVA = 10002, // 用户已经存在
    USER_NAME_NO = 10003, // 用户无效
    USER_NICKNAME_NO = 10004, // 用户昵称无效
    USER_EMAIL_NO = 10005, // 用户邮箱无效
    USER_PASSWORD_FALSE = 10006,
    // 用户模块
    USER_NAME_STRING = 15000,
    USER_AGE_NUMBER = 15001,
    USER_ADDRESS_ADDRESS = 15002,
    USER_EMAIL_EMAIL = 15003,
    USER_LIST_FILED = 15004,

    // 权限角色模块
    ROLE_ALERDY_HAVE = 15004, // 角色已经存在
    ROLE_AUTH_ERROR = 15005, // 权限错误

    // 角色
    ROLE_ALEDRY_HAVE = 15006,

    // 书籍
    BOOK_NAME_FAIL = 20001,  // 书籍名无效
    BOOK_PUBLISH_FAIL = 20002,  // 出版社无效
    BOOK_PRICE_FAIL = 20003, // 价格无效
    BOOK_DESC_FAIL = 20004, // 描述无效
    BOOK_VIEWS_COUNT = 20005, // 借阅次数

    // 聊天软件  错误枚举
    // 聊天用户的信息
    USER_NO_REGISTER, // 用户未注册
    USER_NO_LOGIN, // 用户未登陆
    USER_NO_MESSAGE, // 用户没有消息
    USER_INFO_NO_PERFECT, // 用户的信息不完善
    USER_lOGIN_PASSWORD_FAIL, // 用户登录密码错误
    USER_lOGIN_USERNAME_FAIL, // 用户登录用户名错误
    USER_SERVER_FAIL, // 链接服务器错误

    ROLE_LIST_FAILED,

    ORIZATION_CREATED_FILED = 20014,

    PARAMS_DELETIONl = 30000,

    ORIZATION_UPDATE_FILED = 30002,

    ORIZATION_UPDATE_USER_NOT = 30003,

    ORIZATION_DELETE_FILED = 30005,

    AUTHORITY_CREATED_FILED = 30006,
    AUTHORITY_UPDATE_FILED = 30007,
    AUTHORITY_DELETE_FILED = 30008,
    AUTHORITY_LIST_FILED = 30008,
    AUTHORITY_CODE_INFO_FILED = 30008,
}
