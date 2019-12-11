from .sqlIngest import DataHandler

class ingress_service(object):
    def __init__(self, config=None):
        self.config = config


    async def ingest(self, from_dataset=None):
        loader = DataHandler(config=self.config)
        loader.loadData(fileName=from_dataset)
        loader.cleanData()
        loader.ingestData()
        return {'response':'ingest ok'}

    def update(self):
        return {'response':'update ok'}

    def delete(self):
        return {'response':'delete ok'}

    def hello_world(self):
        return {'response':'hello from frequency service'}

if __name__ == "__main__":
    from configparser import ConfigParser
    config = ConfigParser()
    config.read('../settings.cfg')
    worker = ingress_service(config = config)
    worker.ingest()
