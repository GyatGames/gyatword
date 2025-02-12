# Use an official OpenJDK runtime as a parent image
FROM python:3.12-slim

# Set environment variables to ensure non-interactive installations
ENV DEBIAN_FRONTEND=noninteractive 
#RUN mkdir -p /usr/share/man/man1 /usr/share/man/man2

RUN apt-get update && apt-get -y upgrade

RUN apt install -y openjdk-17-jre


RUN bash -o vi

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY main.py /app

COPY generator.jar /app

COPY requirements.txt /app

COPY generateGyatword.py /app

COPY client.py /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run main.py when the container launches
CMD ["python3", "main.py"]