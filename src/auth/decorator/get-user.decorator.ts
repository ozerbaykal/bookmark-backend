import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    //yapılan api isteği için request objesini alıyoruz
    const request = ctx.switchToHttp().getRequest();

    if (data) {
      return request.user[data];
    }

    //request objesinin içindeki user objesini döndürüyoruz
    return request.user;
  },
);
