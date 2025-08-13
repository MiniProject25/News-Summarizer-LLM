# List of Pre-Existing LLM's to fine-tune
----> BART (Facebook) - facebook/bart-large-cnn
----> T5 (Google) - t5-base/t5-small

# Data Preprocessing Pipeline
----> Removing Leading/Trailing Whitespaces
----> Removing non-text garbage
----> Drop Empty Rows
----> Chunking : Only if the input is too long
----> Tokenization : To convert text into model understandable 
----> Padding: Adds pad tokens (0) in case different text inputs have different lengths

# Algorithm for Preprocessing
1. Iterate through every csv file in the directory (read it as a dataframe)
2. Preserve only [Content, Summary]
3. Drop empty rows
4. Append the dataframe to a list
5. concatenate all the dataframes into a single dataframe
6. Clean the texts of each column (removing whitespaces, links, HTML tags, newline characters, etc)
7. We tokenize the input (content column) and check the token count for a row. If it is greater than 512, then we create chunks.
8. Lastly, convert the cleaned combined DataFrame.
9. Create a train set and test set.
10. Save it in the disk.

Q. How is BART (Bi-directional and Auto-Regressive Transformer) different to ChatGPT?
A: BART is considered as a model that uses both the strengths of GPT (Decoder-only model) and BERT (Encoder-only model). Bart is also considered a Seq2Seq model that takes an input and generates an output. What is a Decoder-Only model you ask? It is a model that generates large piece of text from scratch. It is good for text-summarization, story-telling, etc. What about an Encoder-Only model? It is a model that is good at comprehension but doesn't generate long outputs word-by-word. It is used for Classification, sentiment analysis, embeddings, etc.

Footnote:
* GPT = Generative Pre-Trained Transformer
* BERT = Bi-directional Encoder Representations from Transformers

# Algorithm for Fine-Tuning
1. Import all the necessary libraries.
    (AutoTokenizer, AutoModelForSeq2Seq, Seq2SeqTrainingArguments, Seq2SeqTrainer)
    (Pandas)
    (rouge_score, bert_score)
    (dataset, evaluate)
2. Load it your preprocessed datasets as pandas dataframes. (df.read_csv())
3. Drop any empty rows (in case there are any)
4. Convert the pandas dataframe into a hugging face dataset objects.
5. Load the tokenizer from the pre-trained model.
6. Write a tokenizer function for input and reference texts.
7. Tokenize the inputs and the reference texts.
8. Load the pre-trained model from the class.
9. Set the training arguments for fine-tuning the model.
10. Load the evaluation metrics (ROUGE, BERTScore).
11. Define a function to compute ROUGE score & BERTScore.
12. Configure the trainer with parameters.
13. Start the training.
14. Start the evaluation.
15. Save the fine-tuned model.

# Footnote: 
* AutoTokenizer: It is a class that converts human-readable text into token IDs (numbers) that the model understands, and vice versa.
* AutoModelForSeq2SeqLM: Loads the actual pre-trained model for sequence-to-sequence tasks (e.g., summarization, translation)
* Seq2SeqTrainingArguments: A config object where you specify all your training settings in one place. Things like -> {learning_rate, batch_size, num_train_epochs, evaluation_strategy, save_strategy}
* Seq2SeqTrainer: This is the brains of the operation - it handles the entire training loop for sequence-to-sequence models.
* Sequence-to-Sequence model: It is a model that takes one sequence (like a sentence) as input and produces another sequence as output.
* Pandas: To read CSV files local to the PC.
* rouge_score: 