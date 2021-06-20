from utils.shortcuts import load_db
from classes.database.filters import DEFAULT_FILTERS
import transaction


db,root= load_db()

lst= root.setdefault('filters',[])
for x in DEFAULT_FILTERS:
    if x not in lst:
        lst.append(x)
        print('adding', x)


transaction.commit()
db.pack()