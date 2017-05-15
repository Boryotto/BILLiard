# TODO

1. Add a warning before removing an item from the player page.
2. Add a modal to select a table from the active tables.
3. Create a common service to contain common game related calculations.
4. Add totals views to the event and player pages

# BUGS

1. Fix the fact that there are duplicates of the "same" objects but with different references.
    This is caused by the fact that the local object storer doesn't have a caching mechanism
    thus, creating a new instance every get request.