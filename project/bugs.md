# BUGS

1. Fix the fact that there are duplicates of the "same" objects but with different references.
    This is caused by the fact that the local object storer doesn't have a caching mechanism
    thus, creating a new instance every get request.
2. Fix an ExpressionChangedAfterItHasBeenCheckedError in the new GameEvent form when a player is added while another player's form is open in the accordion