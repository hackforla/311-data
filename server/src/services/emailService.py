import aiofiles
import base64
from sanic_jinja2 import SanicJinja2
from sanic.response import json
from sanic_mail import Sanic_Mail


class EmailService(object):
    def __init__(self, config=None, app=None):
        self.config = config
        self.app = app
        self.sender = None if not self.config  \
            else self.config['Email']['SENDER_EMAIL']
        self.password = None if not self.config \
            else self.config['Email']['SENDER_PASSWORD']
        self.host = None if not self.config \
            else self.config['Email']['EMAIL_HOST']
        self.port = None if not self.config \
            else self.config['Email']['EMAIL_PORT']
        self.target = None if not self.config \
            else self.config['Email']['TARGET_EMAIL']
        pass

    async def send_email(self, subject, content):
        Sanic_Mail.SetConfig(
          self.app,
          MAIL_SENDER=self.sender,
          MAIL_SENDER_PASSWORD=self.password,
          MAIL_SEND_HOST=self.host,
          MAIL_SEND_PORT=self.port,
          MAIL_TLS=True,
        )
        send_worker = Sanic_Mail(self.app)

        await send_worker.send_email(
            targetlist=self.target,
            subject=subject,
            content=content,
        )
        print("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
        return {'result': 'email sent'}


# app = Sanic(__name__)
# jinja = SanicJinja2(app)
# Sanic_Mail.SetConfig(
#     app,
#     MAIL_SENDER=<your sender email address>,
#     MAIL_SENDER_PASSWORD=<your sender email password>,
#     MAIL_SEND_HOST=<your sender email's host>,
#     MAIL_SEND_PORT=<your sender email host's port>,
#     MAIL_TLS=<use TLS or not>
# )
# sender = Sanic_Mail(app)


# @app.get('/send')
# async def send(request):
#     attachments = {}
#     async with aiofiles.open("source/README.md", "rb") as f:
#         attachments["README.md"] = await f.read()
#     async with aiofiles.open('source/猫.jpg', "rb") as f:
#         attachments['猫.jpg'] = await f.read()
#     await app.send_email(
#         targetlist="hsz1273327@gmail.com",
#         subject="测试发送",
#         content="测试发送uu",
#         attachments=attachments
#     )
#     return json({"result": "ok"})


# @app.get('/send_html')
# async def send_html(request):
#     attachments = {}
#     msgimgs = {}
#     async with aiofiles.open("source/README.md", "rb") as f:
#         attachments["README.md"] = await f.read()
#     async with aiofiles.open('source/猫.jpg', "rb") as f:
#         attachments['猫.jpg'] = await f.read()
#         msgimgs['猫.jpg'] = attachments['猫.jpg']

#     content = jinja.env.get_template('default.html').render(
#         name='sanic!',pic1="猫"
#     )
#     await app.send_email(
#         targetlist="hsz1273327@gmail.com",
#         subject="测试发送",
#         content=content,
#         html=True,
#         msgimgs = msgimgs,
#         attachments=attachments
#     )
#     return json({"result": "ok"})

# if __name__ == "__main__":
#     app.run(host='127.0.0.1', port=5000, debug=True)
