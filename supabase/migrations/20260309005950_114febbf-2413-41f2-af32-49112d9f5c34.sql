-- Add support_needs column to store accommodations/assistance required
ALTER TABLE public.credentials 
ADD COLUMN support_needs text[] DEFAULT '{}';

-- Add a brief summary field for quick display
ALTER TABLE public.credentials 
ADD COLUMN support_summary text;