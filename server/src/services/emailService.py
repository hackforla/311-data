from sanic import Sanic
from sanic_mail import Sanic_Mail
# import aiofiles
# import base64
# from sanic_jinja2 import SanicJinja2
# from sanic.response import json


class EmailService(object):
    def __init__(self, config=None, app=None):
        self.config = config
        self.app = Sanic(__name__)
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

    async def send_mail(self, subject='test', content='email sent with Sanic'):
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


if __name__ == "__main__":
    from configparser import ConfigParser
    import asyncio
    config = ConfigParser()
    config.read("../settings.cfg")
    email = EmailService(config=config)
    email.app = Sanic(__name__)
    email.sender = config['Email']['SENDER_EMAIL']
    email.password = config['Email']['SENDER_PASSWORD']
    email.host = config['Email']['EMAIL_HOST']
    email.port = config['Email']['EMAIL_PORT']
    email.target = config['Email']['TARGET_EMAIL']
    loop = asyncio.get_event_loop()
    loop.run_until_complete(asyncio.wait(email.send_mail()))
