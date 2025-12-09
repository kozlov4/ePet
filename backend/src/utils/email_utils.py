import os
import base64
from dotenv import load_dotenv
from fastapi import HTTPException
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Mail, ReplyTo, HtmlContent, Attachment, 
    FileContent, FileName, FileType, Disposition
)

load_dotenv()

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "no-reply@upcity.live")
REPLY_TO_EMAIL = os.getenv("REPLY_TO_EMAIL", "serge.kozlov.dev@gmail.com")

async def send_reset_email(to_email: str, reset_link: str):
    html_content = f"""
    <html><body>
        <p>Привіт,</p>
        <p>Ми отримали запит на скидання пароля. Натисніть кнопку нижче:</p>
        <a href="{reset_link}" 
           style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
           Скинути пароль
        </a>
        <p>Посилання дійсне 1 годину. Якщо це були не ви, проігноруйте цей лист.</p>
    </body></html>
    """

    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to_email,
        subject="Скидання пароля",
        html_content=HtmlContent(html_content)
    )
    message.reply_to = ReplyTo(REPLY_TO_EMAIL, "Підтримка")

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        if response.status_code >= 400:
            print(f"SendGrid error body: {response.body}")
            raise HTTPException(status_code=500, detail="Failed to send email via SendGrid")
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"SendGrid error: {str(e)}")
    

async def send_report_email(to_email: str, pdf_bytes: bytes, filename: str):

    encoded_file = base64.b64encode(pdf_bytes).decode()

    html_content = """
    <html><body>
        <h3>Ваш документ готовий!</h3>
        <p>Витяг про ідентифікаційні дані сформовано.</p>
        <p>PDF-файл знаходиться у вкладенні до цього листа.</p>
    </body></html>
    """

    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to_email,
        subject=f"Ваш документ: {filename}",
        html_content=HtmlContent(html_content)
    )
    
    attachment = Attachment()
    attachment.file_content = FileContent(encoded_file)
    attachment.file_type = FileType('application/pdf')
    attachment.file_name = FileName(filename)
    attachment.disposition = Disposition('attachment')
    
    message.attachment = attachment
    message.reply_to = ReplyTo(REPLY_TO_EMAIL, "Підтримка")

    _send_via_sendgrid(message)


def _send_via_sendgrid(message):
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        sg.send(message)
    except Exception as e:
        print(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail="Не вдалося відправити email.")