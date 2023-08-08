FROM python:3.11

RUN mkdir -p /app

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt
EXPOSE 8000
# ENTRYPOINT [ "python", "generate_code.py" ]
CMD ["uvicorn", "generate_code:app", "--host", "0.0.0.0", "--port", "8000"]