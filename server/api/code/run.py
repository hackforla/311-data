import os

if __name__ == "__main__":
    import uvicorn
    import sys

    print(sys.path)

    uvicorn.run(
        "311_data_api.asgi:app",
        host=os.getenv("APP_HOST", "127.0.0.1"),
        port=int(os.getenv("APP_PORT", "5000")),
    )
