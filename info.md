1. List of Pre-Existing LLM's to fine-tune
----> BART (Facebook) - facebook/bart-large-cnn
----> T5 (Google) - t5-base/t5-small

2. Data Preprocessing Pipeline
----> Removing Leading/Trailing Whitespaces
----> Removing non-text garbage
----> Drop Empty Rows
----> Chunking : Only if the input is too long
----> Tokenization : To convert text into model understandable 
----> Padding: Adds pad tokens (0) in case different text inputs have different lengths

Algorithm for Preprocessing
1. Iterate through every csv file in the directory (read it as a dataframe)
2. Preserve only [Content, Summary]
3. Drop empty rows
4. Append the dataframe to a list
5. concatenate all the dataframes into a single dataframe
6. Clean the texts of each column (removing whitespaces, links, HTML tags, newline characters, etc)
7. We tokenize the input and check the token count for a row. If it is greater than 1000, then we create chunks.
8. Lastly, convert the cleaned combined DataFrame into a Hugging face dataset.
9. Create a train set and test set.
10. Save it in the disk.