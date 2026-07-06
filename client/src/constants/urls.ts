let SERVER_URL: string;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  SERVER_URL = "http://localhost:5000/api/v1";
} else {
  SERVER_URL = "https://api.bitcoinhighschool.com/api/v1";
  // SERVER_URL = "https://bite-a70i.onrender.com/api/v1";
}

const APK_DOWNLOAD_URL =
  "https://bite-sbucket.s3.eu-central-1.amazonaws.com/bitcoinhighschool.apk";

export { SERVER_URL, APK_DOWNLOAD_URL };
