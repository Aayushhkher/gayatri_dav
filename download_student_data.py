import os
import kaggle
from kaggle.api.kaggle_api_extended import KaggleApi
import pandas as pd
import zipfile

def setup_kaggle_api():
    """Setup Kaggle API credentials"""
    # Make sure you have your kaggle.json in ~/.kaggle/kaggle.json
    api = KaggleApi()
    api.authenticate()
    return api

def download_student_dataset():
    """Download student performance dataset from Kaggle"""
    api = setup_kaggle_api()
    
    # Download the dataset
    dataset = 'whenamancodes/student-performance-multiple-linear-regression'
    api.dataset_download_files(dataset, path='./data', unzip=True)
    
    # Read the dataset
    df = pd.read_csv('./data/Student_Performance.csv')
    
    # Create a clean version of the dataset
    df.to_csv('./data/student_performance_clean.csv', index=False)
    
    print("Dataset downloaded and processed successfully!")
    print(f"Total number of records: {len(df)}")
    print("\nDataset columns:")
    print(df.columns.tolist())
    print("\nFirst few rows of the dataset:")
    print(df.head())

if __name__ == "__main__":
    # Create data directory if it doesn't exist
    os.makedirs('./data', exist_ok=True)
    
    try:
        download_student_dataset()
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print("\nPlease make sure you have:")
        print("1. Installed the required packages (pip install -r requirements.txt)")
        print("2. Set up your Kaggle API credentials in ~/.kaggle/kaggle.json") 