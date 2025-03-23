# Spotify API

This project is a serverless function that interacts with the Spotify Web API. It allows you to retrieve currently playing tracks and recently liked tracks from a user's Spotify account.

## Features

- Retrieve the currently playing track
- Retrieve recently liked tracks

## Installation

To deploy the function, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/nathanheinstein/spotify-api.git
    ```
2. Navigate to the project directory:
    ```bash
    cd spotify-api
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage

Here is a basic example of how to deploy and use the function:

1. Set up your environment variables:
    ```bash
    export SPOTIFY_CLIENT_ID='your-client-id'
    export SPOTIFY_CLIENT_SECRET='your-client-secret'
    export SPOTIFY_REFRESH_TOKEN='your-refresh-token'
    ```
2. Deploy the function to your serverless platform of choice.

3. Make requests to the deployed endpoints:
    - Retrieve currently playing track:
        ```bash
        curl -X GET https://your-deployment-url/spotify/currently-playing
        ```
    - Retrieve recently liked tracks:
        ```bash
        curl -X GET https://your-deployment-url/spotify/recently-liked
        ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.