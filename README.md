## Home page

Visit [bitcoinhighschool.com](https://bitcoinhighschool.com).

## Installation

To setup the backend locally, follow these steps:

### Prerequisites

- Ensure you have **Golang 1.25** installed. You can download it from [go.dev/doc/install](https://go.dev/doc/install).
- Ensure you have **Postgresql** installed. You can download it from [postgresql.org/download](https://www.postgresql.org/download/).

- Ensure your computer system supports **Makefiles** . If you are on windows, follow this guide [Run Makefile on windows](https://medium.com/@samsorrahman/how-to-run-a-makefile-in-windows-b4d115d7c516).

### Steps

1. **Clone the repository**:

   ```sh
   https://github.com/Tibz-Dankan/BiTE.git

   cd bite/server
   ```

1. **Install packages**:

   ```sh
   make install

   ```

1. **Set up environmental variables**:

| Variable        | Type   | Description                             |
| --------------- | ------ | --------------------------------------- |
| `BiTE_DEV_DSN`  | string | DSN pointing to test postgres db        |
| `BiTE_PROD_DSN` | string | DSN pointing to development postgres db |
| `JWT_SECRET`    | string | key used to sign JWT tokens             |

create .env file in the root project directory and add all these variables

_Example_

```sh

BiTE_DEV_DSN="host=localhost user=postgres password=<db password> dbname=<db name> port=<db port> sslmode=disable"

```

4. **Start the application**:

   ```sh

   make run
   ```

> Note: The application server port number is **5000**
