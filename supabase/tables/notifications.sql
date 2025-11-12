CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    wallet_address TEXT NOT NULL,
    activity_id UUID,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);