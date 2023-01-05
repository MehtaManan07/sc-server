## Getting Started (Backend)

To get a local copy up and running follow these simple example steps.

### Installation
 
1. Clone the repo
```sh
git clone https://github.com/verse-labs/backend.git
```
2. Install NPM packages in the root folder
* (only use yarn)
```sh
yarn install 
```
3. Install NGROK.
* ngrok (for testing only)
```sh
npm i ngrok@latest -g

```



## Usage

To run the project locally, please follow the following steps.

1. To run the server, run the command
```sh
yarn dev
```
2. To run the ngrok instance, run the command
* By running the following command, you will get an HTTPS link,
paste that link in the api.ts file in react native project and make sure you are running all three terminals 
(One for the backend server, another for the ngrok server, and yet another for the react native metro server.)
```sh
ngrok http 5000
```