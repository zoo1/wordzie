# wordzie

##Summary
A word lookup/remembering application. Powered by Wordnik API, which does basic word definition caching.

Created for introductory learning of:
* Angular.js
* Bootstrap
* Jade
![](http://oi57.tinypic.com/rsemu9.jpg)

##Configuration and Setup
Before running the server there are a few configuration options that need to be setup in order for the application to run. Most of this work is done through creating a config.js file.

1. Create a config.js file that exports an object with the following properties:
  * port : port where the app runs at
  * env  : environment the application runs in(used for debugging)
  * wordnikkey : wordnik api key
  * msqluser : mysql user name
  * msqlpass : mysql password
2. Create a database named 'wordzie'
3. Install dependencies
4. Run mysqlinit.js to setup the database
5. Start the application
