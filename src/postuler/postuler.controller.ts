import { Controller, Post, Body } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Controller('postuler')
export class PostulerController {
  @Post('send')
  async send(@Body() formData: any) {
    console.log(formData);

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'mosscmoi@gmail.com',
        pass: 'gagwjpyihkiobfoa',
      },
    });

    const attachments = [];
    for (const key in formData) {
      if (key === 'attachment') {
        const buffer = Buffer.from(formData[key], 'base64');

        attachments.push({
          filename: 'Attachment.png',
          content: buffer,
          contentType: 'image/png',
          contentDisposition: 'attachment',
        });
      }
    }

    const mailOptions = {
      from: formData['email'] as string,
      to: 'mosscmoi@gmail.com',
      subject: `${formData['nom']} ${formData['prenom']} : Postuler Santleys`,
      text: formData['message'] as string,
      attachments,
    };

    await transporter.sendMail(mailOptions);
  }
}
