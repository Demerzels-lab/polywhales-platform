CREATE TABLE betting_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT NOT NULL,
    market_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    side TEXT,
    amount DECIMAL,
    price DECIMAL,
    outcome TEXT,
    status TEXT,
    tx_hash TEXT,
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);