import os
import time
from datetime import datetime
from multiprocessing import Process

import db
import pb
import app
from settings import Server


def update():
    time.sleep(5)

    last_updated = db.info.last_updated()
    time_since_update = datetime.utcnow() - last_updated
    if time_since_update.days >= 1:
        db.requests.update()

    if pb.enabled:
        pb.populate()


if __name__ == '__main__':

    if Server.UPDATE_ON_START:
        Process(target=update).start()

    if Server.DEBUG:
        print(os.environ)

    app.start()
