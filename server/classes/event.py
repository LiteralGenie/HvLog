import copy, re


# @todo: event time, round, action tags
# in general, each line in the battle log is considered an event
#   - events have at most one source event
#       - eg a "Spell X hits Monster Y for Z damage" has a source event of "You cast Spell X"
#       - player attacks / monster spawns / etc are considered events without a source event
class Event:
    def __init__(self, name=None, source=None, data=None, tags=None):
        self.source= source
        self.effects= []

        self.name= name
        self.tags= tags if isinstance(tags, list) else [tags]
        self.data= data

        self.turn_index= -1
        self.round_index= -1

    def __str__(self):
        t= self.tags[:3]
        t[-1]= "..." if len(self.tags) > 3 else t[-1]
        return f"{self.name} ({self.round_index}.{self.turn_index}) [{','.join(t)}]"
