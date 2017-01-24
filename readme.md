
## Production Defect Monitor ##

**Installation**
`npm install`

**Use**
`npm start`

**Routes**

- GET - /lastReset
	- Gets the number of days since the last time the counter was reset
- POST - /reset
	- Resets the counter to 0
- POST - /setDays
	- Sets the number of days
	- Example payload: `{days: 5}`


----------
Created by Nick Cacace