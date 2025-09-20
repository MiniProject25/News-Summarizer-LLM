# List of Pre-Existing LLM's to fine-tune
----> BART (Facebook) - facebook/bart-base-cnn
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

Q. Bart Tokenizer. What is it?
A: Breaking text down into smaller units called tokens. They can be words, characters or subwords. BART uses byte-pair encoding (specifically RobertaTokenizer in the hood). 
BPE is a subword tokenizer:
- Rare/unseen words get broken into smaller, known subwords.
- Frequent words remain whole.

Footnote:
* GPT = Generative Pre-Trained Transformer
* BERT = Bi-directional Encoder Representations from Transformers

# Algorithm for Fine-Tuning
1. Import all the necessary libraries.
    (AutoTokenizer, AutoModelForSeq2Seq, Seq2SeqTrainingArguments, Seq2SeqTrainer)
    (Pandas)
    (dataset, evaluate)
2. Load your preprocessed datasets as pandas dataframes. (df.read_csv())
3. Drop any empty rows (in case there are any)
4. Convert the pandas dataframe into a hugging face dataset objects.
5. Load the tokenizer from the pre-trained model.
6. Write a tokenizer function for input and reference texts.
    - Tokenize the input text to a max length of 512.
    - Tokenize the reference text to a max length of 128.
    - set padding to off (because we will use data collation)
7. Tokenize the inputs and the reference texts.
8. Load the pre-trained model from the class.
    - Enable Gradient Checkpointing (Memory-Computation time trade-off)
9. Set the training arguments for fine-tuning the model.
10. Load the evaluation metrics (ROUGE). Load it from the evaluate library.
11. Define a function to compute ROUGE score.
    - load the prediction and the label.
    - replace -100 in the label with padding_tokens for the purposes of decoding token ID into text.
    - decode tokens into text (both prediction and label)
    - add \n in place of (.) because ROUGE demands it. Also, it helps avoid cases where 2 words have a full-stop between them which is a irrelevant matching in ROUGE-2.
    - Compute ROUGE Scores
    - Create a dictionary with all 3 ROUGE scores.
    - Return scores in percentage.
12. Configure the trainer with parameters.
    - [Model, args, train_dataset, eval_dataset, tokenizer, compute_metrics, data_collator]
13. Start the training.
14. Start the evaluation.
15. Save the fine-tuned model.

# Footnote: 
* **AutoTokenizer**: It is a class that converts human-readable text into token IDs (numbers) that the model understands, and vice versa.
* **AutoModelForSeq2SeqLM**: Loads the actual pre-trained model for sequence-to-sequence tasks (e.g., summarization, translation)
* **Seq2SeqTrainingArguments**: A config object where you specify all your training settings in one place. Things like -> {learning_rate, batch_size, num_train_epochs, evaluation_strategy, save_strategy}
* **Seq2SeqTrainer**: This is the brains of the operation - it handles the entire training loop for sequence-to-sequence models.
* **Sequence-to-Sequence model**: It is a model that takes one sequence (like a sentence) as input and produces another sequence as output.
* **Pandas**: To read CSV files local to the PC.
* **ROUGE** (Recall-Oriented Understudy for Gisting Evaluation):
    - Measures overlap between a generated summary and a reference (human-written) summary.
    - **ROUGE-1**: Measures Unigram Overlap between generated summary and referenced summary.
        - Unigrams are individual words in a statement.
        - Formula = (No. of overlapping unigrams) / (No. of unigrams in reference)
        - Interpretation: Measures content coverage at the word level.
    - **ROUGE-2**: Measures bigram overlap (two-word sequences) between generated and reference summaries.
        - Similar formula as prior but use 2 word sequences
        - penalizes summaries that just throw in the same words as the reference but in wrong order.
        - It captures word order and phrasing better than ROUGE-1.
    - **ROUGE-L**: Based on Longest Common Subsequence (LCS) between generated and reference.
        - Formula = (Length of the LCS) / (No. of words in the reference text)
        - LCS rewards fluency and longer matching sequences.
        - It is more forgiving than ROUGE-2 because it can skip words in between.
    - Important terms w.r.t ROUGE:
        - **Recall**: (No. of overlapping tokens) / (Total tokens in the reference text)
            - High recall → you covered most of the important content from the reference.
            - Low recall → you missed many important words from the reference.
        - **Precision**:(No. of overlapping tokens) / (Total tokens in the generated text)
            - High precision → most of what you generated is relevant.
            - Low precision → you generated a lot of words that weren’t in the reference summary (possible irrelevant or noisy content).
        - **F1 Score**: 2 * (Precision * Recall) / (Precision + Recall)
            - F1 punishes imbalance between precision and recall.
            - If you have high recall but low precision (you include all correct words but also a lot of irrelevant ones), or high precision but low recall (you’re accurate but miss key content), F1 will be low.
* **Gradient Checkpoint**: memory-computation trade-off technique
    - When you're training a model, it computes the activation value for each layer and stores them in memory so they can be used during the backward pass to compute the gradient. This is called **Forward Pass**.
    - During **Backward Pass**, the model uses those stored values to compute gradients for each parameter.

    - What gradient checkpoint does, is instead of keeping all those values in the memory, it forgets some of them and recomputes them on the fly during backpass. This way we're saving some GPU VRAM, but increasing the computation time, which is the trade-off in this case.   