#!/usr/bin/env python3
"""
fraudshield-ml/mlservice.py

Simple rule-based risk scorer that:
 - accepts a transaction JSON on stdin
 - outputs {"riskScore": float} to stdout

No external libraries required.
"""

import sys
import json
from datetime import datetime
import math

def safe_get(d, *keys, default=None):
    for k in keys:
        if k in d:
            return d[k]
    return default

def to_float(x, default=0.0):
    try:
        return float(x)
    except Exception:
        return default

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def merchant_risk_score(cat):
    if not cat:
        return 0.0
    cat = str(cat).lower()
    high = {"jewelry", "luxury", "electronics", "gambling", "crypto", "adult"}
    medium = {"travel", "airline", "entertainment", "gaming"}
    if any(h in cat for h in high):
        return 1.0
    if any(m in cat for m in medium):
        return 0.6
    return 0.2

def hour_risk_score(ts):
    # Accepts ISO timestamp string or integer epoch seconds
    if ts is None:
        return 0.0
    # Try to parse ISO
    try:
        if isinstance(ts, (int, float)):
            dt = datetime.fromtimestamp(int(ts))
        else:
            dt = datetime.fromisoformat(str(ts))
        h = dt.hour
    except Exception:
        # fallback: if contains hour like "13:45"
        try:
            part = str(ts).split("T")[-1].split(":")[0]
            h = int(part)
        except Exception:
            return 0.0
    # Late night (00-05) is slightly higher risk
    if 0 <= h <= 5:
        return 0.8
    if 6 <= h <= 10:
        return 0.2
    if 11 <= h <= 17:
        return 0.1
    return 0.4

def build_features(tx):
    amount = to_float(safe_get(tx, "amount", "transactionAmount", "amt"), 0.0)
    # normalize amount (cap at 10000)
    amount_norm = min(amount, 10000.0) / 10000.0

    is_international = bool(safe_get(tx, "isInternational", "international", default=False))
    card_present = safe_get(tx, "cardPresent", "card_present", default=None)
    # If card_present provided, treat False as higher risk
    if card_present is None:
        card_present_flag = 0.0
    else:
        card_present_flag = 1.0 if bool(card_present) else 0.0

    merchant_cat = safe_get(tx, "merchantCategory", "merchant_category", "mcc", default="")
    m_risk = merchant_risk_score(merchant_cat)

    recent = to_float(safe_get(tx, "recentTxnCount", "recent_txn_count", default=0), 0.0)
    recent_factor = min(recent/10.0, 1.0)  # saturates at 1 for 10+ txns

    timestamp = safe_get(tx, "timestamp", "time", "createdAt", default=None)
    time_factor = hour_risk_score(timestamp)

    # Some boolean flags that often exist
    billing_shipping_diff = bool(safe_get(tx, "billingShippingDifferent", "billing_shipping_different", default=False))
    card_blacklisted = bool(safe_get(tx, "cardBlacklisted", "card_blacklisted", default=False))

    return {
        "amount_norm": amount_norm,
        "is_international": 1.0 if is_international else 0.0,
        "card_present": card_present_flag,
        "merchant_risk": m_risk,
        "recent_factor": recent_factor,
        "time_factor": time_factor,
        "billing_shipping_diff": 1.0 if billing_shipping_diff else 0.0,
        "card_blacklisted": 1.0 if card_blacklisted else 0.0
    }

def score_from_features(f):
    """
    Compose a simple linear combination and squash with sigmoid to produce risk in (0,1).
    Weights chosen to give reasonable behavior out of the box.
    """
    # Weights (you can tune these later)
    w = {
        "amount_norm": 2.0,
        "is_international": 1.5,
        "card_present": -1.0,            # card present reduces risk
        "merchant_risk": 1.8,
        "recent_factor": 1.2,
        "time_factor": 0.9,
        "billing_shipping_diff": 1.0,
        "card_blacklisted": 3.0
    }
    bias = -1.0  # baseline bias (lower -> lower risk)

    linear = bias
    for k, weight in w.items():
        linear += weight * f.get(k, 0.0)

    # squash
    return sigmoid(linear)

def predict(transaction):
    f = build_features(transaction)
    raw_score = score_from_features(f)
    # final risk score between 0 and 1
    return {"riskScore": round(float(raw_score), 4)}

def main():
    raw = sys.stdin.read()
    try:
        transaction = json.loads(raw)
    except Exception as e:
        # If not valid json, return error to caller
        out = {"error": "invalid json input: " + str(e)}
        print(json.dumps(out))
        sys.stdout.flush()
        sys.exit(1)

    try:
        result = predict(transaction)
        print(json.dumps(result))
        sys.stdout.flush()
    except Exception as e:
        out = {"error": "prediction failed: " + str(e)}
        print(json.dumps(out))
        sys.stdout.flush()
        sys.exit(1)

if __name__ == "__main__":
    main()
