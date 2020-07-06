from time import time
from hashlib import sha256
from cloudant.client import CouchDB

client = None
db = None
DBNAME = 'classpack'

def connect():

    global client, db, DBNAME

    client = CouchDB('classpack_user', 'classpack_123',
                     url='http://127.0.0.2:5984', connect=True)

    db = client[DBNAME]

    print(db.database_name)

def disconnect():

    global client

    client.disconnect()

def sort_obs(obstacles):

    print(obstacles)

    for i in range(0, len(obstacles) - 1):

        pmin = i
        vmin = obstacles[i]

        for j in range(i + 1, len(obstacles)):

            jobs = obstacles[j]

            if vmin[0] > jobs[0] or \
               (vmin[0] == jobs[0] and vmin[1] > jobs[1]):

                pmin = j
                vmin = obstacles[j]

        if pmin is not i:

            tmp = obstacles[i]
            obstacles[i] = vmin
            obstacles[pmin] = tmp

def gen_id(width, height, min_dist, ch_width, ch_height,
           obstacles, ptype='chairs'):

    sort_obs(obstacles)
    
    id = ptype + ':' + ':'.join(
        str(i) for i in [width, height, ch_width, ch_height, min_dist] +
        list(k for ob in obstacles for k in ob)
    )

    print(id)

    return id

def get_chairs(width, height, min_dist, ch_width, ch_height,
               obstacles=[]):

    global db

    id = gen_id(width, height, min_dist, ch_width, ch_height,
                obstacles)
    
    if id in db:

        doc = db[id]

        pdf_filename = doc['pdf_filename']

        with open(pdf_filename + '.pdf', 'wb') as fp:

            doc.get_attachment(pdf_filename, write_to=fp)

        return doc['solution'], pdf_filename

    return None

def save_or_update_chairs(width, height, min_dist, ch_width, ch_height,
                          solution, pdf_filename, obstacles=[]):

    global db

    id = gen_id(width, height, min_dist, ch_width, ch_height,
               obstacles)

    if id in db:

        olddoc = db[id]

        if solution['min_distance'] < olddoc['solution']['min_distance']:

            id['solution'] = solution
            olddoc.save()

            with open(pdf_filename, 'rb') as fp:

                olddoc.put_attachment(id['pdf_filename'], 'application/pdf',
                                      fp.read())
            print('Updated cache')

    else:

        rand_pdf_filename = sha256(str(time()).encode('latin')).hexdigest()
        
        document = {
            '_id': id,
            'min_dist': min_dist,
            'room_width': width,
            'room_height': height,
            'chair_width': ch_width,
            'chair_height': ch_height,
            'obstacles': obstacles,
            'pdf_filename': rand_pdf_filename,
            'solution': solution
        }

        doc = db.create_document(document)

        with open(pdf_filename, 'rb') as fp:
    
            doc.put_attachment(rand_pdf_filename,
                               'application/pdf',
                               fp.read())

        print("Added to cache")
