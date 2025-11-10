"""
ALGORITHM:
    1. Normalize input text (reduce all whitespace to a single space).
    2. Initialize 'start' position to 0.
    3. LOOP while 'start' is within text bounds:
        a. Calculate the maximum chunk 'end' position (start + max_chars).
        b. IF the maximum 'end' is not the absolute end of text:
            i. Search backward from max 'end' to 'start' for the last sentence-ending period ('.').
            ii. IF a period is found far enough from 'start', set the 'end' position to include that period, ensuring sentence completion.
        c. Extract the chunk (text[start:end]) and append it to the results.
        d. Set the new 'start' position for the next iteration by subtracting the 'overlap' from the current 'end'.
        e. Clamp the new 'start' to 0 to prevent negative indices.
        f. BREAK if the 'end' position reached the true end of the text.
    4. RETURN the list of chunks.
"""

import re
from typing import List

def simpleChunk(text: str, max_chars: int = 1000, overlap: int = 200) -> List[str]:
    # Normalize whitespace (replace multiple spaces/newlines with single space) and remove leading/trailing space.
    text = re.sub(r"\s+", " ", text).strip()
    chunks = []  # List to store the resulting text chunks.

    start = 0
    while start < len(text):
        # Determine the maximum possible 'end' position based on max_chars.
        end = min(len(text), start + max_chars)

        # Check if we are not at the very end of the text.
        if end < len(text):
            # Find the last period (sentence end) before the max-char limit.
            last_period = text.rfind('.', start, end)

            # If a period is found reasonably far from the start (to avoid single-word chunks),
            # adjust 'end' to complete the sentence. (+1 includes the period).
            if last_period > start + 50:
                end = last_period + 1

        # Extract the chunk based on the determined 'start' and 'end' boundaries.
        chunk = text[start:end].strip()
        chunks.append(chunk)

        # Calculate the next 'start' position using the specified 'overlap'.
        start = end - overlap

        # Prevent 'start' from becoming negative (handles the initial/first chunk edge case).
        if start < 0:
            start = 0
        
        # Stop looping if the end boundary reached the end of the original text.
        if end == len(text):
            break
    
    return chunks

def prepared_chunks(article_id, title, category, date, text, max_chars = 1000, overlap = 200):
    raw_chunks = simpleChunk(text, max_chars, overlap)
    metadataList = []

    for idx, chunk in enumerate(raw_chunks):
        meta = {
            "article_id": article_id,
            "title": title,
            "category": category,
            "date": date,
            "chunk_id": idx,
            "full_text": text
        }
        metadataList.append(meta)

    return raw_chunks, metadataList