import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createTransport } from 'nodemailer';
import * as fs from 'fs';

@Controller('postuler')
export class PostulerController {
  @Post('send')
  @UseInterceptors(FileInterceptor('attachement'))
  async send(
    @UploadedFile() attachement: Express.Multer.File,
    @Body('nom') nom: string,
    @Body('prenom') prenom: string,
    @Body('email') email: string,
    @Body('message') message: string,
  ) {
    console.log('attachment', attachement);
    console.log('nom', nom);
    console.log('prenom', prenom);
    console.log('email', email);
    console.log('message', message);

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'mosscmoi@gmail.com',
        pass: 'aiywtoueicetjzga',
      },
    });

    const attachments = [
      {
        filename: attachement.originalname,
        content: fs.createReadStream(attachement.path),
      },
    ];

    const mailOptions = {
      from: email as string,
      to: 'mosscmoi@gmail.com',
      subject: `${nom} ${prenom} : Postuler Santelys`,
      text: `Cher Santelys Equipe,
      je suis ${nom} ${prenom} et je vous contacte pour postuler chez Santleys.
      Voici mon CV et ma lettre de motivation.
      ${message}
      Merci de prendre en compte ma candidature.
      Cordialement,
      ${nom} ${prenom}`,

      attachments,
    };

    await transporter.sendMail(mailOptions);
  }
}
