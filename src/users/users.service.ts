import { Injectable } from '@nestjs/common';
import { User } from './dto/create-user.dto';
import { Resend } from 'resend';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userData: User) {
    try {
      console.log(userData);
      const newUser = await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          number: userData.number ? userData.number : '',
          createdAt: new Date(),
        },
      });

      console.log(newUser);

      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: [userData.email],
          subject: 'TEST',
          html: '<strong>It works!</strong>',
        });

        if (error) {
          console.log(error);
        } else {
          console.log({ data });
        }
      } catch (e) {
        console.log('Email not sended');
        console.log(e);
      }

      return {
        status: 201,
        message: 'User created successfully',
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        message: 'Error creating user',
      };
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return {
        status: 200,
        message: 'Users fetched successfully',
        data: users,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        message: 'Error fetching users',
      };
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      return {
        status: 200,
        message: 'User fetched successfully',
        data: user,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        message: 'Error fetching user',
      };
    }
  }

  update(id: number, updatedUserData: User) {
    try {
      this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: updatedUserData.name,
          email: updatedUserData.email,
          number: updatedUserData.number ? updatedUserData.number : '',
        },
      });
      return {
        status: 200,
        message: 'User updated successfully',
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        message: 'Error updating user',
      };
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      return {
        status: 200,
        message: 'User deleted successfully',
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        message: 'Error deleting user',
      };
    }
  }

  async sendEmailToAll({
    subject,
    message,
  }: {
    subject: string;
    message: string;
  }) {
    try {
      const mails = (await this.prisma.user.findMany()).map(
        (user) => user.email,
      );
      console.log(mails);

      if(mails.length === 0){
        return {
          status: 200,
          message: 'No hay usuarios para enviar correos',
        };
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: mails,
        subject: subject,
        html: `<strong>${message}</strong>`,
      });

      if (error) {
        console.log(error);
        return {
          status: 500,
          message: 'Error enviando correos',
        };
      } else {
        console.log({ data });
      }

      return {
        status: 200,
        message: 'Se enviaron los correos correctamente',
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        message: 'Error enviando correos',
      };
    }
  }
}
