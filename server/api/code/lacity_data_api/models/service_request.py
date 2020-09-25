import datetime
from typing import List

from sqlalchemy import and_

from . import db


class ServiceRequest(db.Model):
    __tablename__ = 'service_requests'

    request_id = db.Column(db.Integer, primary_key=True)
    created_date = db.Column(db.Date)
    closed_date = db.Column(db.Date)
    type_id = db.Column(db.SmallInteger, db.ForeignKey('request_types.type_id'))
    council_id = db.Column(db.SmallInteger)
    region_id = db.Column(db.SmallInteger)
    address = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)


async def get_open_requests() -> List[ServiceRequest]:
    '''Get a list of RequestTypes from their type_names'''
    result = await db.all(
        ServiceRequest.query.where(
            ServiceRequest.closed_date == None  # noqa
        )
    )
    return result


async def get_full_request(srnumber: str):
    # query the request table to get full record
    query = db.text("SELECT * FROM requests WHERE srnumber = :num")
    result = await db.first(query, num=srnumber)
    return result


async def get_filtered_requests(
        start_date: datetime.date,
        end_date: datetime.date,
        type_ids: List[int],
        council_ids: List[int]
):

    result = await (
        db.select(
            [
                ServiceRequest.request_id,
                ServiceRequest.type_id,
                ServiceRequest.latitude,
                ServiceRequest.longitude
            ]
        ).where(
            and_(
                ServiceRequest.created_date >= start_date,
                ServiceRequest.created_date <= end_date,
                ServiceRequest.type_id.in_(type_ids),
                ServiceRequest.council_id.in_(council_ids)
            )
        ).gino.all()
    )
    return result
