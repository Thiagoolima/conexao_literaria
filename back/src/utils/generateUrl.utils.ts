import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Inject } from '@nestjs/common';

export class GetUrl {
  constructor(@Inject(REQUEST) private request: Request) {}

  generateUrl(token: string, pathRoute: string): string {
    const protocol = this.request.protocol;
    const host = this.request.get('host');
    const url = `${protocol}://${host}${pathRoute}?token=${token}`;

    return url;
  }
}
