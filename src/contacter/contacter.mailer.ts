import { Body, Controller, Post } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Controller('contact')
export class ContacterMailerController {
  @Post()
  async send(@Body() formData: any) {
    console.log(formData);

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'mosscmoi@gmail.com',
        pass: 'xgjkhdrzugqmabrd',
      },
    });

    const mailOptions = {
      from: formData['email'] as string,
      to: 'mosscmoi@gmail.com',
      subject: `Contact Santelys Formulaire`,
      text: `Cher Santelys ,
     Ceci est le corps du formulaire de contact  par Monsieur/Madame ${formData['nom']} du l'email ${formData['email']}:
      ${formData['message']},
`,
    };

    await transporter.sendMail(mailOptions);
  }
}
