# Candidate Takehome Exercise
This is a simple backend engineer take-home test to help assess candidate skills and practices.  We appreciate your interest in Voodoo and have created this exercise as a tool to learn more about how you practice your craft in a realistic environment.  This is a test of your coding ability, but more importantly it is also a test of your overall practices.

If you are a seasoned Node.js developer, the coding portion of this exercise should take no more than 1-2 hours to complete.  Depending on your level of familiarity with Node.js, Express, and Sequelize, it may not be possible to finish in 2 hours, but you should not spend more than 2 hours.  

We value your time, and you should too.  If you reach the 2 hour mark, save your progress and we can discuss what you were able to accomplish. 

The theory portions of this test are more open-ended.  It is up to you how much time you spend addressing these questions.  We recommend spending less than 1 hour.  


For the record, we are not testing to see how much free time you have, so there will be no extra credit for monumental time investments.  We are looking for concise, clear answers that demonstrate domain expertise.

# Project Overview
This project is a simple game database and consists of 2 components.  

The first component is a VueJS UI that communicates with an API and renders data in a simple browser-based UI.

The second component is an Express-based API server that queries and delivers data from an SQLite data source, using the Sequelize ORM.

This code is not necessarily representative of what you would find in a Voodoo production-ready codebase.  However, this type of stack is in regular use at Voodoo.

# Project Setup
You will need to have Node.js, NPM, and git installed locally.  You should not need anything else.

To get started, initialize a local git repo by going into the root of this project and running `git init`.  Then run `git add .` to add all of the relevant files.  Then `git commit` to complete the repo setup.  You will send us this repo as your final product.
  
Next, in a terminal, run `npm install` from the project root to initialize your dependencies.

Finally, to start the application, navigate to the project root in a terminal window and execute `npm start`

You should now be able to navigate to http://localhost:3000 and view the UI.

You should also be able to communicate with the API at http://localhost:3000/api/games

If you get an error like this when trying to build the project: `ERROR: Please install sqlite3 package manually` you should run `npm rebuild` from the project root.

# Practical Assignments
Pretend for a moment that you have been hired to work at Voodoo.  You have grabbed your first tickets to work on an internal game database application. 

#### FEATURE A: Add Search to Game Database
The main users of the Game Database have requested that we add a search feature that will allow them to search by name and/or by platform.  The front end team has already created UI for these features and all that remains is for the API to implement the expected interface.  The new UI can be seen at `/search.html`

The new UI sends 2 parameters via POST to a non-existent path on the API, `/api/games/search`

The parameters that are sent are `name` and `platform` and the expected behavior is to return results that match the platform and match or partially match the name string.  If no search has been specified, then the results should include everything (just like it does now).

Once the new API method is in place, we can move `search.html` to `index.html` and remove `search.html` from the repo.

#### FEATURE B: Populate your database with the top 100 apps
Add a populate button that calls a new route `/api/games/populate`. This route should populate your database with the top 100 games in the App Store and Google Play Store.
To do this, our data team have put in place 2 files at your disposal in an S3 bucket in JSON format:

- https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json
- https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json

CANDIDATE NOTE:
I'm taking this as to add only the endpoint on the api side without implementing the button on the front side.

# Theory Assignments
You should complete these only after you have completed the practical assignments.

The business goal of the game database is to provide an internal service to get data for all apps from all app stores.  
Many other applications at Voodoo will use consume this API.

#### Question 1:
We are planning to put this project in production. According to you, what are the missing pieces to make this project production ready? 
Please elaborate an action plan.

## Answer 1:

- P0 IOS and Google PLay store api integration (if available)
- P0 Rights (tokens verification for our api clients)
- P0 Game Interface
- P0 Managed DB
- P1 Logger template and context
- P1 API Versioning
- P2 Typescript
- P2 Input validation/sanitizing

The first mandatory steps are the rights management, the Applestore/Playstore api integration and the confirmation of the game interface. For the rights we will declare it as middleware auth guards in order to make theses endpoints privates and not public. For the API integration it will be a new Service/Repository
So that we can expose in real time the correct data (if this data is available on the Applestore/Playstore APIs) privately inside our voodoo ecosystem. Of course we must as well confirm the correct interface of the game objects with the data team and forward this interface to others consuming-api teams.
Then we can progressively release the others key points, implementing the company's logging template with correct context and levels as well as API versionning.
Adding typescriot in order to make the code more clear and maintainable as well.


#### Question 2:
Let's pretend our data team is now delivering new files every day into the S3 bucket, and our service needs to ingest those files
every day through the populate API. Could you describe a suitable solution to automate this? Feel free to propose architectural changes.

## Answer 1:
I can see multiple solutions depending on your needs and available time/resources

S3 bucket event listening https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html

Before going to these solution we need to confirm with the data team the format of theirs changes, a game per file, or an aggregated file for a list of games.

A) S3 events will trigger a lambda function which will call this api's /api/games/populate endpoint

B) Polling the s3 bucket from this api every X minutes and looking for a tag (file version) changement on the file/files
In order to do that we must as well add a new table into our db which will track the last readed tag of the s3 file/files


Message Queues solution (without S3)

A) The data team can automaticly push their "release" of data into a message queue service
like KAFKA which are going to be consumed by a new application service (consumer), and this consumer will call our api.


# PS
- axios script raw url doesn't work anymore
