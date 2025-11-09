// src/lib/emailService.ts

import * as nodemailer from 'nodemailer';

// Cria o transportador SMTP
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true para porta 465, false para outras
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface SendInviteParams {
    toEmail: string;
    inviteLink: string;
    userName: string;
}

export async function sendInviteEmail({ toEmail, inviteLink, userName }: SendInviteParams) {
    const fullLink = `${process.env.BASE_URL}${inviteLink}`;

    try {
        await transporter.sendMail({
            from: `"Painel Administrativo" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: '🥳 Sua solicitação foi APROVADA! Seu link de convite está pronto.',
            html: `
                <p>Olá, **${userName}**!</p>
                <p>Temos o prazer de informar que sua solicitação para participar da nossa plataforma foi **aprovada**.</p>
                <p>Clique no link abaixo para completar seu cadastro e acessar a rede:</p>
                <p><a href="${fullLink}" style="color: white; background-color: #10B981; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Acessar Convite
                </a></p>
                <p>O link expira em 24 horas. Link direto: ${fullLink}</p>
                <br>
                <p>Atenciosamente,<br>Equipe Administrativa</p>
            `,
        });
        console.log(`✉️ E-mail de convite enviado para: ${toEmail}`);
    } catch (error) {
        console.error(`🚨 Erro ao enviar e-mail para ${toEmail}:`, error);
        throw new Error("Falha ao enviar e-mail de convite.");
    }
}