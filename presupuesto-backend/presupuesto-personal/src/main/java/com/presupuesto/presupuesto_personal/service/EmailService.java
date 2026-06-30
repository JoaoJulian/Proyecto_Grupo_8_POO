package com.presupuesto.presupuesto_personal.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCodigoRecuperacion(String to, String codigo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("🔑 Recuperación de contraseña - FinTrack");

            String htmlContent = "<html>"
                    + "<body style='background-color: #f8f9fa; font-family: \"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px 0;'>"
                    + "  <div style='max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e9ecef;'>"
                    + "    <div style='background: linear-gradient(135deg, #aa3bff 0%, #7c2bc4 100%); padding: 30px; text-align: center;'>"
                    + "      <h1 style='color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;'>FinTrack</h1>"
                    + "      <p style='color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;'>Gestión de presupuesto personal</p>"
                    + "    </div>"
                    + "    <div style='padding: 40px 30px; text-align: center; color: #495057;'>"
                    + "      <h2 style='color: #212529; margin-top: 0; font-size: 22px;'>Recupera tu contraseña</h2>"
                    + "      <p style='font-size: 15px; line-height: 1.6; color: #6c757d;'>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Ingresa el siguiente código en la aplicación:</p>"
                    + "      <div style='background-color: #f1f3f5; padding: 20px; border-radius: 10px; margin: 30px 0; border: 1px dashed #dee2e6;'>"
                    + "        <span style='display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #6c757d; margin-bottom: 5px; font-weight: bold;'>Tu código de recuperación</span>"
                    + "        <span style='font-size: 36px; font-weight: 700; color: #aa3bff; letter-spacing: 6px; font-family: monospace;'>" + codigo + "</span>"
                    + "      </div>"
                    + "      <p style='font-size: 13px; color: #dc3545; font-weight: 500;'>⚠️ Este código expirará en 15 minutos.</p>"
                    + "      <p style='font-size: 13px; color: #6c757d;'>Si no solicitaste este cambio, puedes ignorar este correo con total seguridad.</p>"
                    + "    </div>"
                    + "    <div style='background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;'>"
                    + "      <p style='font-size: 12px; color: #adb5bd; margin: 0;'>FinTrack · Sistema de gestión de presupuesto personal</p>"
                    + "    </div>"
                    + "  </div>"
                    + "</body>"
                    + "</html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo de recuperación", e);
        }
    }
}