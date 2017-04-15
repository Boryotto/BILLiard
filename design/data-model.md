# The Data Model #

## GameEvent ##

The model that hold every entity together - the gaming event

* GUID Id
* Table[] tables
* Player[] Players
* Double hourlyRate
* TableMovement[] movements - The table movements that happened during the event
* DateTime start
* DateTime? end

## Player ##

* GUID - Id
* String name
* TableRecord[] records - The player's table playing records
* MiscItem[] miscItems - The items the player had ordered while playing.

## MiscItem ##

An item a player ordered while playing.

* GUID - Id
* GUID - playerId
* String name
* Double price
* DateTime orderedOn

## Table ##

* GUID Id
* String name
* Double hourlyRate
* DateTime start - The date that the table was rented
* DateTime? end
* TableRecord[] records - The table records of this table
* Boolean - isOpen
* TableMoveStatus - moveStatus

## Enum: TableMoveStatus ##

An enum of the table's move status

### Values:

* Null - The table was not a part of a table change
* Source
* Target

## TableRecord ##

A record of a player's usage on a table

* GUID - Id
* GUID tableId
* GUID playerId
* DateTime start
* DateTime? end

## TableMovement ##

A record of a moved table

* GUID - Id
* GUID - tableSource
* GUID - tableDestination
* DateTime - happenedOn
