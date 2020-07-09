from time import time
from hashlib import sha256
from cloudant.client import CouchDB

DB_SOL_NAME = 'classpack'
DB_USR_NAME = 'users'
DB_PRB_NAME = 'problems'

def connect():
    """
    Conect to the CouchDB server.
    """

    client = None

    try:
        
        # TODO: remove username and password from the code
        client = CouchDB('classpack_user', 'classpack_123',
                         url='http://127.0.0.2:5984', connect=True)

    except e:

        pass

    return client

def disconnect(client):
    """
    Disconnect from the CouchDB server.
    """

    if client is None: return
    
    client.disconnect()

def _sort_obs(obstacles):
    """

    Sort the list of triples (given by lists) `obstacles`. The idea is to
    first sort by `x`, then by `y` and then by the `radius` of the
    obstacle.

    """

    for i in range(0, len(obstacles) - 1):

        pmin = i
        vmin = obstacles[i]

        for j in range(i + 1, len(obstacles)):

            jobs = obstacles[j]

            if vmin[0] > jobs[0] or \
               (vmin[0] == jobs[0] and vmin[1] > jobs[1]) or \
               (vmin[0] == jobs[0] and vmin[1] == jobs[1] and vmin[2] > jobs[2]):

                pmin = j
                vmin = obstacles[j]

        if pmin is not i:

            tmp = obstacles[i]
            obstacles[i] = vmin
            obstacles[pmin] = tmp

def add_and_return_user(client, email, name, institution):
    """Store the user and return the document.

    NOTE: the user is always stored, even if the email already
    exists. This solves the problem of wrong email addresses and
    different information. Also, avoids the need for passwords.

    """

    if client is None: return ''
    
    udb = client[DB_USR_NAME]

    uid = email + ':' + sha256(str(time()).encode('latin')).hexdigest()

    user_with_id = {
        '_id': uid,
        'email': email,
        'name': name,
        'institution': institution
    }

    udb.create_document(user_with_id)
    
    return uid
            
def gen_chair_id(width, height, min_dist, ch_width, ch_height,
                 obstacles):
    """Generate unique ids for saving the results of 'chairs' problems.

    """

    _sort_obs(obstacles)
    
    id = 'chairs:' + ':'.join(
        str(i) for i in [width, height, ch_width, ch_height, min_dist] +
        list(k for ob in obstacles for k in ob)
    )

    return id

def gen_row_id(width, height, min_dist, ch_width, ch_height,
               row_dist, col_dist):
    """Generate unique ids for saving the results of 'rows' problems.

    """

    id = 'rows:' + ':'.join(
        str(i) for i in [width, height, ch_width, ch_height, min_dist, row_dist, col_dist]
    )

    return id

def get_chairs(client, width, height, min_dist, ch_width, ch_height,
               obstacles=[]):

    if client is None: return None

    db = client[DB_SOL_NAME]

    id = gen_chair_id(width, height, min_dist, ch_width, ch_height,
                      obstacles)
    
    if id in db:

        doc = db[id]

        pdf_filename = doc['pdf_filename']

        with open(pdf_filename + '.pdf', 'wb') as fp:

            doc.get_attachment(pdf_filename, write_to=fp)

        return doc['solution'], pdf_filename

    return None

def save_or_update_chairs(client, width, height, min_dist, ch_width, ch_height,
                          solution, pdf_filename, obstacles=[]):

    if client is None: return
    
    db = client[DB_SOL_NAME]

    id = gen_chair_id(width, height, min_dist, ch_width, ch_height,
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
