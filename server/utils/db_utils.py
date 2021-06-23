from __future__ import annotations

from ZODB import FileStorage, DB
from zc.zlibstorage import ZlibStorage
from persistent.mapping import PersistentMapping

from .global_utils import DATABASE_FILE
import transaction, sys


def load_db() -> (DB, PersistentMapping):
    # load from file
    storage= ZlibStorage(FileStorage.FileStorage(DATABASE_FILE))
    db= DB(storage)
    connection= db.open()
    root= connection.root()

    # ensure default filters / extractors
    set_root_defaults(root)

    return (db,root)

def set_root_defaults(root, force=False):
    from classes.database import DEFAULT_FILTERS, DEFAULT_EXTRACTORS

    dct= root.setdefault('filters',{})
    for x,y in DEFAULT_FILTERS.items():
        if x not in dct or force:
            print('adding filter:', x,y)
            dct[x]= (y)

    dct= root.setdefault('extractors',{})
    for x,y in DEFAULT_EXTRACTORS.items():
        if x not in dct or force:
            print('adding extractor:', x,y)
            dct[x]= y

    return root

def clear_root(root, logs=False, caches=False, to_defaults=False):
    from classes.database import Extractor, Filter

    if logs:
        keys= list(root.get('logs', {}).keys())
        print(f'clearing {len(keys)} logs...', file=sys.stderr)
        for x in keys:
            del root['logs'][x]
        transaction.commit()

    if caches:
        print(f'clearing cache for {len(root["filters"])} filters...', file=sys.stderr)
        Filter.clear_all_caches(root['filters'])
        print(f'clearing cache for {len(root["extractors"])} extractors...', file=sys.stderr)
        Extractor.clear_all_caches(root['extractors'])
        transaction.commit()

    if to_defaults:
       set_root_defaults(root, force=True)

    return root