let SERVER_URL: string;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  SERVER_URL = "http://localhost:5000/api/v1";
} else {
  SERVER_URL = "https://api.bitcoinhighschool.com/api/v1";
}

export { SERVER_URL };
