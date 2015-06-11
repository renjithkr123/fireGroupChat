# fireGroupChat
This is a basic group chat widget that built with Firebase. It shows an example of how to build a simple chat application without any server side code.

## Setup
Setup a localhost server for running the index.html. If you don’t already have any server,  I would suggest you to install NodeJS http-server.

##Configure Firebase
* Go to [Firebase](www.firebase.com) and create a new account.
* Create a new app from your [firebase dashboard](https://www.firebase.com/account/).
* Edit `firegroupchat.js` and replace `<YOUR-FIREBASE-APP>` with your firebase app to point to your firebase.
 
##Configure Facebook Authentication
* Create a new [facebook application](https://developers.facebook.com/apps).
* Add `https://auth.firebase.com/v2/<YOUR-FIREBASE-APP>/auth/facebook/callback` to your `Valid OAuth redirect URIs` on the bottom of the **Advanced** tab ([more info](https://www.firebase.com/docs/web/guide/login/facebook.html)).
* Go to your firebase account, at `https://<YOUR-FIREBASE>.firebaseio.com`. Click **Login & Auth** in the left side menu. Select the **Facebook** tab and check the **Enable Facebook Authentication**.
* Paste your Facebook App Id and App Secret.
* Run the index.html with localhost



