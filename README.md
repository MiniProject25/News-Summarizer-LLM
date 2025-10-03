# News Article Analysis and Summarization System

---

## Phase 1: Project Setup and Data Collection

### 1.1 Environment Setup
- [x] Configure Jupyter Notebook integration in VSCode  

### 1.2 Dataset Collection
- [x] Collect CNN/DailyMail dataset  
- [x] Collect XSum dataset  
- [ ] Scrape or download data from AllSides.com for political bias classification  
- [ ] Fetch recent news articles using News API  

### 1.3 Data Analysis and Cleaning
- [x] Explore dataset structure and key statistics (article and summary lengths)  
- [x] Remove duplicates, low-quality, or incomplete articles  
- [x] Filter out advertisements, metadata, and unrelated content  

---

## Phase 2: Model Selection and Fine-Tuning

### 2.1 Model Selection
- [x] Review candidate models from the report (e.g., BART-base-CNN, T5, etc)  

### 2.2 Data Preprocessing
- [x] Implement text cleaning and tokenization  
- [x] Remove samples exceeding the model’s maximum token length  
- [x] Split dataset into training and testing sets (70-30 split)  
- [x] Save processed datasets for reproducibility  

### 2.3 Fine-Tuning
- [x] Define training parameters  
- [x] Implement training with Hugging Face "Seq2SeqTrainer"
- [x] Integrate evaluation during training (ROUGE, BERTScore)  
- [ ] Save the fine-tuned model and tokenizer locally  

---

## Phase 3: Evaluation and Analysis

### 4.3 Testing and Optimization
- [ ] Perform end-to-end testing of the complete pipeline  
- [ ] Optimize inference speed and memory usage  
- [ ] Prepare final documentation for deployment and usage
