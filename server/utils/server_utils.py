from typing import List, Iterable
from ZODB import DB
import transaction, time


# @todo: logging


def get_extract(root, filters=None, extractors=None, age=-1):
    # type: (DB, List[str], List[str], int) -> dict
    from classes import BattleLog, Extractor

    from .misc_utils import Timestamp
    ts= Timestamp()

    # inits
    ret= dict()
    filters= filters or []
    extractors= extractors or []
    start= int(time.time() - age) if age >= 0 else 0

    filters= [root['filters'][code.lower()] for code in filters]
    extractors= { code: root['extractors'][code.lower()] for code in extractors}

    # filter by date
    logs= root['logs'].values(min=start) # type: Iterable[BattleLog]

    # apply other filters
    for f in filters:
        logs= f.filter_logs(logs)
    ret= { l.start_time : dict(log=l.as_dict(False)) for l in logs }

    # apply extractors
    for l in logs:
        res= dict()
        for code,extr in extractors.items(): # type: Extractor
            res[code]= extr.extract(l)

        ret[l.start_time]['extracts']= res

    # update caches and return
    transaction.commit()
    return ret
