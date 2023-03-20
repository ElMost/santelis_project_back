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
    // récuperer le fichier et les données du formulaire
    @UploadedFile() attachement: Express.Multer.File,
    @Body('nom') nom: string,
    @Body('prenom') prenom: string,
    @Body('email') email: string,
    @Body('message') message: string,
  ) {
    // créer un transporteur pour envoyer le mail
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'mosscmoi@gmail.com',
        pass: 'xgjkhdrzugqmabrd',
      },
    });

    // créer un tableau d'attachement
    const attachments = [
      {
        filename: attachement.originalname,
        content: fs.createReadStream(attachement.path),
      },
    ];

    const mailOptions = {
      // récuperer les données du formulaire
      //  et les données du fichier
      // et les envoyer dans le mail
      from: email as string,
      to: 'mosscmoi@gmail.com',
      subject: `${nom} ${prenom} : Postuler Santelys`,
      text: `Cher Santelys Equipe,
        je suis ${nom} ${prenom} et je vous contacte pour postuler chez Santélys.
        Voici mon CV.
        ${message}
        Merci de prendre en compte ma candidature.
        Cordialement,
        ${nom} ${prenom}`,

      attachments,
    };

    await transporter.sendMail(mailOptions);
  }
}

//   async send(
//     @UploadedFile() attachment: Express.Multer.File,
//     @Body('nom') nom: string,
//     @Body('prenom') prenom: string,
//     @Body('email') email: string,
//     @Body('message') message: string,
//   ) {
//     const transporter = createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'mosscmoi@gmail.com',
//         pass: 'xgjkhdrzugqmabrd',
//       },
//     });

//     let attachments = [];

//     if (attachment) {
//       attachments = [
//         {
//           filename: attachment.originalname,
//           content: fs.createReadStream(attachment.path),
//         },
//       ];
//     }

//     const mailOptions = {
//       from: email as string,
//       to: 'mosscmoi@gmail.com',
//       subject: `${nom} ${prenom} : Postuler Santelys`,
//       text: `Cher Santelys Equipe,
//     je suis ${nom} ${prenom} et je vous contacte pour postuler chez Santélys.
//     Voici mon CV.
//     ${message}
//     Merci de prendre en compte ma candidature.
//     Cordialement,
//     ${nom} ${prenom}`,
//       attachments,
//     };

//     await transporter.sendMail(mailOptions);
//   }
// }
