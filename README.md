# Student Performance Dashboard

An interactive dashboard for analyzing student performance data, built with Streamlit and Plotly.

## Features

- 📊 Interactive visualizations
- 🔍 Filter data by gender and parental education
- 📈 Performance distribution analysis
- 📚 Subject-wise performance comparison
- 👥 Gender-based performance analysis
- 🔗 Feature correlation analysis
- 📋 Detailed data table view

## Live Demo

Visit the live dashboard at: [Student Performance Dashboard](https://student-performance-dashboard.streamlit.app)

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Aayushhkher/gayatri_dav.git
   cd gayatri_dav
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the dashboard:
   ```bash
   streamlit run app.py
   ```

5. Open your browser and navigate to http://localhost:8501

## Project Structure

```
gayatri_dav/
├── app.py                 # Main Streamlit application
├── data/                  # Data directory
│   └── Student_Performance.csv
├── requirements.txt       # Project dependencies
└── README.md             # Project documentation
```

## Data Description

The dataset includes:
- Student demographics (age, gender, race/ethnicity)
- Parental education level
- Lunch type
- Test preparation course status
- Performance scores in Math, Reading, and Writing
- Overall performance index

## Deployment

This dashboard is deployed on Streamlit Cloud. To deploy your own version:

1. Fork this repository
2. Go to [Streamlit Cloud](https://share.streamlit.io/)
3. Connect your GitHub account
4. Select your forked repository
5. Deploy!

## Contributing

Feel free to submit issues and enhancement requests! 