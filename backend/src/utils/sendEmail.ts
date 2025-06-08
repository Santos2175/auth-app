import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import handlebars from 'handlebars';

import { transporter } from '../config/mail.config';
import type { Email } from '../types/types';

// Resolving file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Send Mail utility handler
export const sendEmail = async ({ to, subject, type, context }: Email) => {
  try {
    const defaultConfig: Record<string, { templateFile: string }> = {
      emailVerification: {
        templateFile: 'verificationEmailTemplate.hbs',
      },
      passwordResetRequest: {
        templateFile: 'passwordResetRequestTemplate.hbs',
      },
      passwordResetSuccess: {
        templateFile: 'passwordResetSuccessTemplate.hbs',
      },
    };

    const config = defaultConfig[type];

    if (!config) {
      throw new Error(`Invalid type`);
    }

    // Handlebar html template
    const templatePath = join(__dirname, '../templates', config.templateFile);
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    const htmlContent = template(context);

    const emailOptions = {
      from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_ADDRESS}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(emailOptions);
  } catch (error: any) {
    console.error('Error sending mail', error.message);
    throw new Error('Error sending mail');
  }
};
