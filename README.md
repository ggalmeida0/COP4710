# Database Project

## Steps to get it running:

1) Install Node and NPM (https://nodejs.org/en/download/)
2) Install python (https://www.python.org/downloads/)
3) Run `npm install` inside the repo directory
4) Run `npm start`
5) Go inside the graphql directory and run `pip install -r requirements.txt`
6) Start a postgres server on port 5432
7) Inside the graphql directory run `uvicorn --reload app:app`
7) Go in a web browser and type `http://localhost:3000/login`