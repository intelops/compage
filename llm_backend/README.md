## Requirements

To successfully run the program, make sure you have all the necessary dependencies installed. These dependencies are listed in the `requirements.txt` file. Before executing the program, follow these steps:

## Setting Up the Environment

1. Create a Python virtual environment using either pip or conda. You should use Python version 3.11.4.

2. Activate the newly created virtual environment. This step ensures that the required packages are isolated from your system-wide Python installation.

## Installing Dependencies

3. Install the required dependencies by running the following command in your terminal:

<pre>
<code >pip install -r requirements.txt</code>
</pre>

This command will read the `requirements.txt` file and install all the necessary packages into your virtual environment.

## Running the Code

4. Once the dependencies are installed, you can run the program using the following command:

<pre>
<code>uvicorn generate_code:app --reload</code>
</pre>

This command starts the Uvicorn server and launches the application. The `--reload` flag enables auto-reloading, which is useful during development.











