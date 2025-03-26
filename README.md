# Student Performance Analysis Dashboard

This project includes a data downloader and an interactive dashboard for analyzing student performance data.

## Prerequisites

1. Python 3.7 or higher
2. Kaggle API credentials

## Setup Instructions

1. Install the required packages:
```bash
pip install -r requirements.txt
```

2. Set up your Kaggle API credentials:
   - Go to your Kaggle account settings (https://www.kaggle.com/settings)
   - Scroll to the "API" section
   - Click "Create New API Token"
   - This will download a `kaggle.json` file
   - Create a directory at `~/.kaggle/` and place the `kaggle.json` file there
   - Set the appropriate permissions:
     ```bash
     mkdir -p ~/.kaggle
     mv kaggle.json ~/.kaggle/
     chmod 600 ~/.kaggle/kaggle.json
     ```

## Usage

1. First, download the dataset:
```bash
python download_student_data.py
```

2. Launch the dashboard:
```bash
streamlit run dashboard.py
```

The dashboard will open in your default web browser.

## Dashboard Features

The dashboard provides several views for analyzing the student performance data:

1. **Overview**
   - Basic statistics about the dataset
   - Data preview
   - Feature distribution visualization

2. **Correlation Analysis**
   - Correlation heatmap
   - Interactive scatter plots between features

3. **Performance Distribution**
   - Distribution of performance index
   - Box plots showing feature impact on performance

4. **Feature Analysis**
   - Comparison of normalized vs original data
   - Detailed feature statistics

## Dataset Information

The downloaded dataset contains information about student performance, including:
- Hours studied
- Previous scores
- Sleep hours
- Sample question papers practiced
- And more

The data is saved in two formats:
- Original dataset: `./data/Student_Performance.csv`
- Clean dataset: `./data/student_performance_clean.csv` 