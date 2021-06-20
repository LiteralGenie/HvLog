from .global_utils import DATABASE_FILE
from ZODB import FileStorage, DB
from zc.zlibstorage import ZlibStorage
from persistent.mapping import PersistentMapping

def load_db() -> (DB, PersistentMapping):
    storage= ZlibStorage(FileStorage.FileStorage(DATABASE_FILE))
    db= DB(storage)
    connection= db.open()
    root= connection.root()
    return (db,root)