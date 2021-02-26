import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './AppModule';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { HttpExceptionFilter } from './common/error/filters/HttpExceptionFilter';
import { ApiParamsValidationPipe } from './common/error/pipe/ApiParamsValidationPipe';
import { config } from './config/config.json';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: true, // 是否保存未初始化的会话
    cookie : {
      maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
  }));
  // 允许跨域
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public/' });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ApiParamsValidationPipe());
  app.setGlobalPrefix(config.globalPrefix);
  await app.listen(config.port);
}
bootstrap();

// pm2 start dist/main.js -i 1 -name pushapi
// docker cp /home/ubuntu/api/simple-notice-center/src e1b7eb2b0177:/server/simple-notice-center
