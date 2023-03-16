import { Body, Controller, Post } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Controller('devis-mailer')
export class DevisMailerController {
  @Post('send')
  async send(@Body() formData: any) {
    console.log(formData);

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'mosscmoi@gmail.com',
        pass: 'xgjkhdrzugqmabrd',
      },
    });

    const services = (formData['services'] as string[]).join(', ');

    const mailOptions = {
      from: formData['email'] as string,
      to: 'mosscmoi@gmail.com',
      subject: `${formData['nom']} ${formData['prenom']} : Devis Santleys`,
      text: `Dear Mosscmoi Team,

I am writing to get a quote for the following services: ${services}

Frequency: ${formData['frequency'] as string}

Name: ${formData['nom'] as string}
First Name: ${formData['prenom'] as string}
Email: ${formData['email'] as string}
Postal Code: ${formData['codePostal'] as string}

Best regards,
`,
    };

    await transporter.sendMail(mailOptions);
  }
}
