-- Migration: add_telegram_chat_id_to_tracked_wallets
-- Created at: 1762960860

ALTER TABLE tracked_wallets ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;;