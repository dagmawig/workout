# Workout App
This app is used log workout sessions. It allows users to created their own custome workout templates from a list of over a thousand exercises. It logs workout session exercises and their corresponding exercise data (such as weight, time and rep) under workout history page. The history pages also shows the date each session is performed and the time it took to complete the session. During the workout session the app gives the users the flexibility to modify the workout template by adding and removing exercises and sets. It also gives users the ability to edit and save workout templates if needed. 

The app also shows previous record and personal record for each exercise type. In addition, it has both visual (gif) and textual details of each exercise to help users perform the exercises properly. The exercise search component gives users the option to filter out exercises based on body part, target muscle group and exercise name.

# App is published at https://dagmawig.github.io/workout/

## Server side 
Server side is written in Javascript with Node framework and is located at https://github.com/dagmawig/workout-backend
It is hosted on Glitch platform.

### Services and Functions Used
I used reactJS to build the frontend.
I used Bootstrap CSS framework for styling.
I used firebase authentication to verify user email and authenticate using email and password. 
I used axios method to make https request to server side. 
I used MongoDB to store user data. 
I used Glitch.com to host server code.
I used Redux Toolkit to manage global app state. 
I used useState hook to manage local app state.