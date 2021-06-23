from persistent import Persistent
from BTrees.IOBTree import IOBTree, BTree
from typing import Any, Dict, List, Callable
from ..log import BattleLog, Event
import time


# maps each log to a value (possibly a list -- eg list of 'credits earned')
class Extractor(Persistent):
    def __init__(self, name=None):
        self.name= name or str(time.time()) # for debugging
        self.values= IOBTree()  # results of map(log)

    def map(self, log):
        # type: (BattleLog) -> Any
        raise NotImplementedError

    def extract(self, log):
        index= log.start_time
        if not self.values.has_key(index):
            self.values[index]= self.map(log)
        return self.values[index]

    def clear_cache(self):
        import transaction
        self.values= IOBTree()
        transaction.commit()

    @classmethod
    def clear_all_caches(cls, node):
        import transaction
        for name,extr in node.items():
            extr.clear_cache()
        transaction.commit()



# two-step extractor:
#   (1) filters Log.primary_events for events of interest
#   (2) extracts attributes from the filtered events
class AttrExtractor(Extractor):
    def __init__(self, name, conds, attrs):
        super().__init__(name=name)
        self.conds= conds

        # inner lists contain a "path of attr names"
        #   eg ['a', 'b', 'c'] would be used to extract event['a']['b']['c']
        self.attrs= attrs # type: dict[str, list[str]]

    def get_events(self, log):
        return log.search(**self.conds)

    def get_attr_vals(self, event):
        ret= {
            "meta": dict(
                round=event.round_index,
                turn=event.turn_index,
                id=event.event_index,
            )
        }
        for name,lst in self.attrs.items():
            tmp= event
            for attr in lst:
                try:
                    tmp= tmp[attr]
                except KeyError:
                    break # @todo: failed attr retrieval logging
                ret[name]= tmp
        return ret

    def map(self, log):
        events= self.get_events(log)
        values= [self.get_attr_vals(e) for e in events]
        values= [x for x in values if x is not None] # @todo: log the Nones
        return values


def _data_extr(extr_name, event_name, **attrs):
    for x,y in attrs.items():
        # assume string values are intended to target the data attribute
        if isinstance(y, str):
            attrs[x]= ['data', y]

    return AttrExtractor(name=extr_name,
                         conds=dict(name=event_name),
                         attrs=attrs)

DEFAULT_EXTRACTORS= dict(
    exp= _data_extr('EXP', 'EXP Gain',
                    value='value'),
    prof= _data_extr('Proficiency', 'Prof Gain',
                     value='value', type='type'),
    monster= _data_extr('Monster Spawn', 'Monster Spawn',
                        mid='mid', name='monster'),
    equips= _data_extr('Equip', 'Equip Drop',
                       equip='equip'),
    credits= _data_extr('Credits', 'Credit Drop',
                        value='value'),
)