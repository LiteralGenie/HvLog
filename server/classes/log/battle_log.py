# @todo: all rounds have same max-round
# @todo: all turns have at least one player action
# @todo: battle_start as id
# @todo: serialize

from .parsers import EventParser
from .enumerator import Enumerator
from .linkers import EventLinker


class BattleLog:
    def __init__(self):
        self.primary_events= []
        self.start_time= None

    @classmethod
    def from_lines(cls, lines):
        lines= [x.strip() for x in lines if x.strip()]
        events= [EventParser.get_event(x) for x in lines]
        events= Enumerator.enumerate(events)
        events= EventLinker.set_links(events)

        primary_events= [x for x in events if x.source is None]
        return cls.from_primaries(primary_events)

    @classmethod
    def from_primaries(cls, primaries):
        ret= cls()
        ret.primary_events= primaries
        metadata= ret.validate()

        ret.round_end= metadata['round_end']
        ret.round_max= metadata['round_max']
        ret.battle_type= metadata['battle_type']

        return ret

    def validate(self):
        # check first event is round_init
        first= self.primary_events[0]
        assert first.name == "Round Start"
        assert first.data['current'] == 1

        # check other events
        round_max= first.data['max']
        battle_type= first.data['battle_type']

        round_ind= first.data['current']
        has_end= None
        has_action= False

        for x in self.primary_events[1:]:
            if x.name == "Round Start":
                assert has_end # all rounds have a victory message
                assert has_action # all rounds have a player action
                assert x.data['max'] == round_max # all round inits have same max
                assert x.data['current'] == round_ind + 1 # round counter increments by 1
                assert x.data['battle_type'] == battle_type

                # reset check vars
                round_ind+= 1
                has_end= False
                has_action= False

            elif x.name == "Round End":
                has_end= True
            elif "Player" in x.tags:
                has_action= True

        return dict(
            round_max=round_max,
            round_end=round_ind,
            battle_type=battle_type,
        )

    def __iter__(self):
        yield from self.primary_events