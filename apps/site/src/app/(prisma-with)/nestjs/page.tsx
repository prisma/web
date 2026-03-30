import type { Metadata } from "next";
import * as data from "../../../data/prisma-with/nestjs.json";
import { PrismaWithLayout } from "../../../components/prisma-with/layout";

const codeExamples: Record<string, string> = {
  "basic-crud": `// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// src/users/users.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() data: { name: string; email: string }) {
    return this.usersService.create(data);
  }
}

// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async create(data: { name: string; email: string }) {
    return this.prisma.user.create({ data });
  }
}`,
  "authentication-guard": `// src/auth/jwt.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true }
      });
      if (!user) throw new UnauthorizedException();
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// src/users/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../decorators/user.decorator';

@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@User() user) {
    return user;
  }
}`,
  "transactions": `// src/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: { userId: number; items: any[] }) {
    const { userId, items } = data;
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: { userId, status: 'PENDING' }
      });
      const orderItems = await Promise.all(
        items.map(item => tx.orderItem.create({
          data: { orderId: order.id, productId: item.productId, quantity: item.quantity }
        }))
      );
      return { order, orderItems };
    });
  }
}

// src/orders/orders.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() data: { userId: number; items: any[] }) {
    return this.ordersService.createOrder(data);
  }
}`,
  "data-model-migrations": `model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}`,
};

export const metadata: Metadata = {
  title: "NestJS Database & Prisma | Type-safe ORM for SQL Databases",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build NestJS apps with MySQL, PostgreSQL & SQL Server databases.",
  alternates: {
    canonical: "https://www.prisma.io/nestjs",
  },
  openGraph: {
    title: "NestJS Database & Prisma | Type-safe ORM for SQL Databases",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build NestJS apps with MySQL, PostgreSQL & SQL Server databases.",
    url: "https://www.prisma.io/nestjs",
    images: [{ url: "/og/prisma-with/nestjs.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NestJS Database & Prisma | Type-safe ORM for SQL Databases",
    description:
      "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build NestJS apps with MySQL, PostgreSQL & SQL Server databases.",
    images: ["/og/prisma-with/nestjs.png"],
  },
};

export default async function NestJsPage() {
  return <PrismaWithLayout data={data} codeExamples={codeExamples} />;
}
