# Social-Net

Social-Net is a social media web application that allows users to post articles or websites they find interesting. Other users will be able to view these posts and will also be able to leave likes and comments. To ensure a personalized experience, users will also be able to edit their profile pages to their liking. This project is made with NodeJS, and uses MongoDB to store data.

Members:
Marco Luis Gonzalez
Carlos Antonio Guanzon
Winnie Silva He

## To run locally
1. Make sure that mongod is open
2. Open the terminal
3. In the terminal, go to the directory where the project is placed
4. In the terminal, type "npm i". This will install all the required dependencies. *NOTE - We have included the packages in the file. This is to make sure that all dependencies are up to date with the specified packages.*
5. Go to the 'model' directory in your terminal
6. In the terminal, type "node loadpost.js". Wait for the console to say that it was a success. Press Ctrl + C to exit.
7. In the terminal again, type "node loadUser.js". Wait for the console to say that it was a success. Press Ctrl + C to exit.

*Numbers 6 and 7 will initialize the pre-existing data*

8. Go back to the main directory of the project.
9. In the terminal, type "node index.js", this will start the server. Wait for the console to say that the server is open.
10. Once the server is open, open a browser and type "localhost:3000".
11. You will be able to view our website already.
