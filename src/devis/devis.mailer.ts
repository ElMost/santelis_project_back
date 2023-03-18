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
      text: `Bonjour,

Je vous contacte pour un devis pour les services suivants : ${services}

Frequency: ${formData['frequency'] as string}

Nom: ${formData['nom'] as string}
Prénom: ${formData['prenom'] as string}
Email: ${formData['email'] as string}
Code Postal: ${formData['codePostal'] as string}

Merci de me recontacter au plus vite.
`,
    };

    await transporter.sendMail(mailOptions);
  }
}
