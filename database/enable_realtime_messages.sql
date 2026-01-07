-- Enable Realtime for the messages table
-- This is required for instant message reception without page reloads.

BEGIN;

-- Check if publication exists, if not create it (standard Supabase setup usually has it)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END
$$;

-- Add messages table to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

COMMIT;
