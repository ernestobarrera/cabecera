import json
import sqlite3

path = r"C:\Users\ebarr\.codex\logs_2.sqlite"
conn = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
queries = {
    "targets": """
        select target, count(*)
        from logs
        where lower(target) like '%hook%'
           or lower(coalesce(feedback_log_body, '')) like '%notify-done%'
           or lower(coalesce(feedback_log_body, '')) like '%pretooluse%'
           or lower(coalesce(feedback_log_body, '')) like '%pre_tool_use%'
           or lower(coalesce(feedback_log_body, '')) like '%stop hook%'
        group by target order by count(*) desc
    """,
    "rows": """
        select datetime(ts, 'unixepoch', 'localtime') as local_time,
               level, target,
               substr(replace(replace(coalesce(feedback_log_body, ''), char(10), ' '), char(13), ' '), 1, 500)
        from logs
        where lower(target) like '%hook%'
           or lower(coalesce(feedback_log_body, '')) like '%notify-done%'
           or lower(coalesce(feedback_log_body, '')) like '%pretooluse%'
           or lower(coalesce(feedback_log_body, '')) like '%pre_tool_use%'
           or lower(coalesce(feedback_log_body, '')) like '%stop hook%'
        order by ts desc limit 200
    """,
    "hook_runtime_full": """
        select datetime(ts, 'unixepoch', 'localtime') as local_time,
               level, target, feedback_log_body, module_path, file, line, thread_id, process_uuid
        from logs
        where target = 'codex_core::hook_runtime'
        order by ts desc
    """,
    "range": "select min(ts), max(ts), count(*) from logs",
}
for name, query in queries.items():
    print(f"=== {name} ===")
    print(json.dumps(conn.execute(query).fetchall(), indent=2, ensure_ascii=False))

wpn_path = r"C:\Users\ebarr\AppData\Local\Microsoft\Windows\Notifications\wpndatabase.db"
wpn = sqlite3.connect(f"file:{wpn_path}?mode=ro", uri=True)
print("=== wpn_schema ===")
print(json.dumps(wpn.execute(
    "select name, sql from sqlite_master where type='table' order by name"
).fetchall(), indent=2, ensure_ascii=False))

print("=== wpn_notify_done_matches ===")
matches = []
for row in wpn.execute("""
    select n.[Order], n.Id, n.ArrivalTime, h.PrimaryId, n.Payload
    from Notification n
    left join NotificationHandler h on h.RecordId = n.HandlerId
    order by n.[Order] desc
"""):
    payload = row[4]
    if isinstance(payload, bytes):
        decoded = None
        for encoding in ("utf-8", "utf-16-le", "utf-16-be"):
            try:
                candidate = payload.decode(encoding)
            except UnicodeDecodeError:
                continue
            if "Tarea finalizada" in candidate or "Claude Code" in candidate:
                decoded = candidate
                break
        if decoded is None:
            decoded = payload.decode("utf-8", errors="replace")
    else:
        decoded = str(payload)
    if "<text id=\"1\">Claude Code</text>" in decoded and "Tarea finalizada." in decoded:
        matches.append([*row[:4], decoded])
print(json.dumps(matches[:20], indent=2, ensure_ascii=False))
