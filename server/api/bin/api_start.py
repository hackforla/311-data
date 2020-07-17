import sys
from os.path import join, dirname
sys.path.append(join(dirname(__file__), '../src'))


def update():
    from datetime import datetime
    import time
    import db
    import pb

    time.sleep(5)

    last_updated = db.info.last_updated()
    time_since_update = datetime.utcnow() - last_updated
    if time_since_update.days >= 1:
        db.requests.update()

    if pb.enabled:
        pb.populate()


if __name__ == '__main__':
    import app
    from multiprocessing import Process
    from settings import Server

    if Server.UPDATE_ON_START:
        Process(target=update).start()

    app.start()
