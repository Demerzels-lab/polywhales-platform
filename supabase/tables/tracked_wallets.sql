CREATE TABLE tracked_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    wallet_address TEXT NOT NULL,
    label TEXT,
    chain_id INTEGER DEFAULT 137,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);