# BILLiard #

A web app to calculate the bill of a group Billiard game.

# App Flow #

## Creating The Game ##

The creates a new game event.
He will input it's name.
He will add tables to the game. 
He will give each table a name.

The user will add an hourly rate for each table or for all of the tables.
*If a rate is added for a table, it will override the global rate.

The user then will add players to the game event.
Each player will have a name.

The user will add playing players to each table (optional)

The user will click the **Start** button.

## Making Changes During The Game ##

The user will be in the main screen where he will be able to see for each table:

* Who are the players playing
* How much time is the table played for
* How much time each player is playing
* How much money does the table cost by now

The user will be able to make actions:

* Remove a player from the table (when he stops playing)
* Add a player to the table
* Move table:
    Creates a new table With a new name, moves the players to the new table, stops the timer of the old table and starts a new one for the new table.
    The tables will be linked in a visual way and the user will be able to see how much total time had been spent on each table and on them both.
* Close the table

## Adding Misc Items To The Bill ##
Each player will be able to add misc. itmes to his bill like drinks and food.
In the player's screen you'll be able to do that.

# Screens #

## Welcome Screen ##

This screen will let the user create a new event and will direct him to the event creation screen.

## Event Creation Window #

This screen will let the user create a new event.

## Main Screen ##

This screen will contain an overview of the event.

### This screen will show:

* The currently active tables, the number of players and the table timer, The total price for the table.
    It will also contain a link to the table screen.
* The number of players currently playing.
* The total number of players.
* The total bill for now (Including misc)

## Player Screen ##

### This screen will show:

* The player's name
* A picture of the player (optional)
* The tables the player is currently playing on.
* The player's total play time
* The player's play time for each table he's been playing on.
* Misc. items that the player had ordered like food.
* The total bill for the player by now.
 
### This screen will let the user:

* Rename the user
* Add misc. items to the users bill
* Add tables the user is playing on.
* Remove tables the user is playing on.

## Table Screen ##

### This screen will show:

* The table's name
* The total time of the table 
* The total price of the table right now.
* The player's currently playing on the table and how much money each needs to pay for his time on the table

### This screen will let the user:

* Rename the table
* Remove a player from the table
* Add a player to the table
* Close the table
* Move the table