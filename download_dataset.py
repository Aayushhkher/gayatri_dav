import os
import kaggle
from kaggle.api.kaggle_api_extended import KaggleApi

def download_dataset():
    # Initialize the Kaggle API
    api = KaggleApi()
    api.authenticate()
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Download the dataset
    api.dataset_download_files(
        'spscientist/students-performance-in-exams',
        path='data',
        unzip=True
    )
    
    print("Dataset downloaded successfully!")

if __name__ == "__main__":
    download_dataset() 