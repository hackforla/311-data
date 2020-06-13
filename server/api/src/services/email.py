from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from settings import Sendgrid


API_KEY = Sendgrid.API_KEY
FROM_ADDRESS = '311-data@hackforla.org'


def response(first_name, issue_number, feedback):
    return f'''\
{first_name},

Thank you for contacting 311-data.org. A ticket has been created (#{issue_number}) and an email has been sent to our support team. Please be patient with our response time since we are all volunteers.

Below is the information that we received from you:
{feedback}

Thanks again for your interest and we look forward to working with you.

If you have any questions, feel free to contact us at 311-data@hackforla.org

'''.replace('\n', '<br/>')  # noqa: E501


async def respond_to_feedback(feedback, issue_number):
    first_name, _, email, *__ = feedback.split('\n')
    first_name = first_name.replace('First name: ', '')
    email = email.replace('Email: ', '')

    message = Mail(
        from_email=FROM_ADDRESS,
        to_emails=[email, FROM_ADDRESS],
        subject='Thanks for your feedback',
        html_content=response(first_name, issue_number, feedback))

    return SendGridAPIClient(API_KEY).send(message)
