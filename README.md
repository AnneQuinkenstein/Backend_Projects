# Backend for Project Website


## Public REST Endpoints

You can access the public [REST endpoint](https://backend-projects-8pai.onrender.com)
or the
[Postman-Collection](https://documenter.getpostman.com/view/13617236/2sA35A8kXu)

Visit [<public-backend>/init](https://backend-projects-8pai.onrender.com/init) to fill the database.


## Development Environment

### Prerequisites
- Node.js ^18.13.0 || ^20.9.0
- PostgreSQL 13.4-Database

1. Download this [repository](https://github.com/AnneQuinkenstein/Backend_Projects/archive/refs/heads/main.zip).
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the required node-modules specified in `package.json`. Used Libaries see [package.json](./package.json) dependencies.

### Usage

1. Navigate to the `backend` folder.
2. To store the enviroment-Varibales create a `.env` file in the root directory of the backend folder.
3. Add the following variables to the `.env` file:
    ```env
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=your_db_host
    DB_PORT=your_db_port
    DB_DATABASE=your_db_name
    ```
4. Start the backend server by running `npm run start`.
5. The server will be deployed on `localhost:4000`.



