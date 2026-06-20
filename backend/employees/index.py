"""Управление сотрудниками GreenTeam — CRUD операции"""
import json
import os
import psycopg2

SCHEMA = 't_p9625555_greenteam_app'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def row_to_emp(row):
    return {
        'id': row[0],
        'name': row[1],
        'role': row[2],
        'directorate': row[3],
        'isHead': row[4],
        'phone': row[5],
        'tg': row[6],
        'startDate': row[7],
        'birthday': row[8],
        'photo': row[9],
        'country': row[10],
        'city': row[11],
        'address': row[12],
    }

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    parts = [p for p in path.split('/') if p]

    conn = get_conn()
    cur = conn.cursor()

    try:
        # GET /  — список всех сотрудников
        if method == 'GET' and len(parts) <= 1:
            cur.execute(f'SELECT id, name, role, directorate, is_head, phone, tg, start_date, birthday, photo, country, city, address FROM {SCHEMA}.employees ORDER BY is_head DESC, name')
            rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps([row_to_emp(r) for r in rows], ensure_ascii=False),
            }

        # POST /  — создать сотрудника
        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            cur.execute(
                f'''INSERT INTO {SCHEMA}.employees
                    (name, role, directorate, is_head, phone, tg, start_date, birthday, photo, country, city, address)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    RETURNING id, name, role, directorate, is_head, phone, tg, start_date, birthday, photo, country, city, address''',
                (
                    body.get('name', ''), body.get('role', ''), body.get('directorate', ''),
                    body.get('isHead', False), body.get('phone', ''), body.get('tg', ''),
                    body.get('startDate', ''), body.get('birthday', ''), body.get('photo', ''),
                    body.get('country', ''), body.get('city', ''), body.get('address', ''),
                )
            )
            row = cur.fetchone()
            conn.commit()
            return {
                'statusCode': 201,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps(row_to_emp(row), ensure_ascii=False),
            }

        # PUT /{id}  — обновить сотрудника
        if method == 'PUT' and len(parts) >= 2:
            emp_id = int(parts[-1])
            body = json.loads(event.get('body') or '{}')
            cur.execute(
                f'''UPDATE {SCHEMA}.employees SET
                    name=%s, role=%s, directorate=%s, is_head=%s, phone=%s, tg=%s,
                    start_date=%s, birthday=%s, photo=%s, country=%s, city=%s, address=%s,
                    updated_at=NOW()
                    WHERE id=%s
                    RETURNING id, name, role, directorate, is_head, phone, tg, start_date, birthday, photo, country, city, address''',
                (
                    body.get('name', ''), body.get('role', ''), body.get('directorate', ''),
                    body.get('isHead', False), body.get('phone', ''), body.get('tg', ''),
                    body.get('startDate', ''), body.get('birthday', ''), body.get('photo', ''),
                    body.get('country', ''), body.get('city', ''), body.get('address', ''),
                    emp_id,
                )
            )
            row = cur.fetchone()
            conn.commit()
            if not row:
                return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}
            return {
                'statusCode': 200,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps(row_to_emp(row), ensure_ascii=False),
            }

        # DELETE /{id}  — удалить сотрудника
        if method == 'DELETE' and len(parts) >= 2:
            emp_id = int(parts[-1])
            cur.execute(f'DELETE FROM {SCHEMA}.employees WHERE id=%s', (emp_id,))
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}

    finally:
        cur.close()
        conn.close()
