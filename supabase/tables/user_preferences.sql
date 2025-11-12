CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    notification_enabled BOOLEAN DEFAULT true,
    alert_threshold DECIMAL DEFAULT 100,
    notification_channels JSONB DEFAULT '{"telegram": true,
    "email": false}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);