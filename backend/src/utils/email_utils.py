import os
from dotenv import load_dotenv
from fastapi import HTTPException
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, ReplyTo, HtmlContent


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