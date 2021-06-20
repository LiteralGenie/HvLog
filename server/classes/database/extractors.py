from persistent import Persistent
from BTrees.IIBTree import IIBTree, BTree
from typing import Any, Dict, List, Callable
from ..log import BattleLog, Event


# maps each log to a value (possibly a list -- eg list of 'credits earned')
class Extractor(Persistent):
    def __init__(self, name):
        self.name= name
        self.values= IIBTree()  # results of map(log)

    def map(self, log):
        # type: (BattleLog) -> Any
        raise NotImplementedError

    def extract(self, log):
        index= log.start_time
        if not self.values.has_key(index):
            self.values[index]= self.map(log)
        return self.values[index]

# two-step extractor:
#   (1) filters Log.primary_events for events of interest
#   (2) applies a function to each event. the resulting list is returned
class SimpleExtractor(Extractor):
    def __init__(self, name, conds, value_fn):
        super().__init__(name=name)
        self.conds= conds
        self.value_fn= value_fn # extracts a value from each event

    def get_events(self, log):
        return log.search(**self.conds)

    def map(self, log):
        events= self.get_events(log)
        values= [self.value_fn(e) for e in events]
        values= [x for x in values if x is not None] # @todo: log the Nones
        return values

# for user-defined extractors
class CustomExtractor(SimpleExtractor):
    def __init__(self, name, conds, attrs):
        conds.setdefault('search_effects', True)
        super().__init__(name, conds, self.get_value_fn(attrs))

    # attrs should be a dict of lists,
    # where the inner lists contain attr names (ie the value to be extracted from each event)
    @classmethod
    def get_value_fn(cls, attrs): # type: (Dict[List[str]]) -> Callable
        def fn(e): # type: (Event) -> Any
            ret= e
            try:
                for x in attrs:
                    ret= ret[x]
                return ret
            except (AttributeError, KeyError):
                return None
        return fn



def _data_extr(extr_name, event_name, data_keys):
    if not isinstance(data_keys, dict):
        fn= lambda e: e.data[data_keys]
    else:
        fn= lambda e: { x: e.data[y] for x,y in data_keys }

    return SimpleExtractor(name=extr_name,
                           conds=dict(name=event_name),
                           value_fn=fn)

DEFAULT_EXTRACTORS= dict(
    credits= _data_extr('Credits', 'Credits', 'val'),
    exp= _data_extr('EXP', 'EXP Gain', 'val'),

    prof= _data_extr('Proficiency', 'Prof Gain',
                     dict(value='value', type='type')),
    monster= _data_extr('Monster Spawn', 'Monster Spawn',
                        dict(mid='mid', name='monster')),
)

def _equip_fn(event):
    quals= "Legendary Magnificent Exquisite Superior Peerless Average Fair Crude".split()
    if any(x in event.data['item'] for x in quals):
        return event.data['item']
    else:
        return None
DEFAULT_EXTRACTORS['equip']= SimpleExtractor('Equip Drop',
                                             '(?:Item Drop|Clear Bonus)',
                                             value_fn=_equip_fn),