# <img src="public/favicon.ico" width="40"/> Chatterly

![GitHub repo size](https://img.shields.io/github/repo-size/Super-Rogatory/chatterly?style=plastic)
![GitHub language count](https://img.shields.io/github/languages/count/Super-Rogatory/chatterly?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/Super-Rogatory/chatterly?style=plastic)
![GitHub last commit](https://img.shields.io/github/last-commit/Super-Rogatory/chatterly?style=plastic)

## Introduction

**_Chatterly_** is a web socket based online chat room application where you can join and talk to your friends! You can sign in as a guest and send a quick message or sign up as a member and be granted with awesome user-specific privileges. The world is in the palm of your hand adventurer, now chat away!

### Checkout the Deployed App: https://wechatterly.com

## Libraries / Services Used in WeChatterly
- [React JS](https://reactjs.org/) (v.17.0.2)
- [Socket.IO](https://socket.io/) (v.4.1.3)
- [Express](https://expressjs.com/) (v.4.17.1)
- [Sequelize](https://sequelize.org/) (v.6.6.5)
- More in the package.json file.

## How to Run the App Locally (Linux)
1. Fork and clone this repo.
2. Install the dependencies with: `npm install`.
3. Create public and private key pair. `node generateKeys`
4. Install postgres if you don't have it already (`psql --version`) to check, then create chatterly db for postgres (`createdb chatterly`). 
5. Create new user with respect to current logged-in user. `sudo -u postgres createuser --superuser $USER`
6. Switch to newly created user, `sudo -i -u [name_of_user]`.
7. Open psql console (`psql`), run `\password [name_of_user]` and change the password. Remember this password!
8. Create .env file
    ```
    PORT=5000
    NODE_ENV=production
    SALT_ROUNDS=10
    DATABASE_URL=postgres://[name_of_user]:[password_of_user]@localhost:5432/chatterly
    ```
9. Start the build process and the application with: `npm run test`. Make sure to run from root directory.
10. Navigate to [localhost:5000](http://localhost:5000) to see the site in the browser.

