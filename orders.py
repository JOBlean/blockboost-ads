"""Read or update BlockBoost ad orders from the terminal (this is how Claude sees them).

    python orders.py                      list every order
    python orders.py status 3 Delivered   change order 3's status

It uses the same admin key as the /admin page, read from ADMIN-KEY.txt.
Set ADS_URL to the live site address; it defaults to the local dev server (npm run dev).
"""
import json
import os
import sys
import urllib.request
from pathlib import Path

HERE = Path(__file__).parent
KEY = (HERE / "ADMIN-KEY.txt").read_text().strip()
BASE = os.environ.get("ADS_URL", "http://localhost:3000").rstrip("/")


def call(method, path, body=None):
    # Every request carries "Authorization: Bearer <key>"; without it the site answers 401.
    req = urllib.request.Request(
        BASE + path,
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as res:  # "with" closes the connection when done
        return json.load(res)


def main():
    if sys.argv[1:2] == ["status"]:
        _, order_id, *status = sys.argv[1:]
        print(call("PATCH", f"/api/admin/orders/{order_id}", {"status": " ".join(status)}))
        return
    orders = call("GET", "/api/admin/orders")["orders"]
    if not orders:
        print("No orders yet.")
    for o in orders:
        print(f"{o['order']}  [{o['status']}]  {o['package']}  from {o['robloxUser']} ({o['contact']})")
        print(f"    ad text: {o['headline']}")
        if o["gameLink"]:
            print(f"    game:    {o['gameLink']}")
        if o["deadline"]:
            print(f"    by:      {o['deadline']}")
        if o["details"]:
            print(f"    notes:   {o['details']}")


if __name__ == "__main__":
    main()
