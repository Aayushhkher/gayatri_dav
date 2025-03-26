import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

# Set page config
st.set_page_config(
    page_title="Student Performance Dashboard",
    page_icon="📊",
    layout="wide"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        padding: 2rem;
    }
    .stPlotlyChart {
        background-color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    </style>
""", unsafe_allow_html=True)

def load_data():
    """Load and preprocess the data"""
    try:
        df = pd.read_csv('./data/Student_Performance.csv')
        return df
    except FileNotFoundError:
        st.error("Please run the download_student_data.py script first to download the dataset.")
        return None

def normalize_data(df):
    """Normalize the numerical columns"""
    scaler = MinMaxScaler()
    numerical_cols = df.select_dtypes(include=[np.number]).columns
    df_normalized = df.copy()
    df_normalized[numerical_cols] = scaler.fit_transform(df[numerical_cols])
    return df_normalized

def main():
    st.title("📊 Student Performance Dashboard")
    
    # Load data
    df = load_data()
    if df is None:
        return
    
    # Sidebar
    st.sidebar.header("Dashboard Controls")
    view_type = st.sidebar.selectbox(
        "Select View",
        ["Overview", "Correlation Analysis", "Performance Distribution", "Feature Analysis"]
    )
    
    # Normalize data
    df_normalized = normalize_data(df)
    
    if view_type == "Overview":
        st.header("Dataset Overview")
        
        # Basic statistics
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Total Students", len(df))
        with col2:
            st.metric("Average Performance", f"{df['Performance Index'].mean():.2f}")
        with col3:
            st.metric("Features", len(df.columns))
        
        # Data preview
        st.subheader("Data Preview")
        st.dataframe(df.head())
        
        # Feature distributions
        st.subheader("Feature Distributions")
        selected_feature = st.selectbox("Select Feature", df.select_dtypes(include=[np.number]).columns)
        fig = px.histogram(df, x=selected_feature, title=f"Distribution of {selected_feature}")
        st.plotly_chart(fig, use_container_width=True)
    
    elif view_type == "Correlation Analysis":
        st.header("Correlation Analysis")
        
        # Correlation heatmap
        st.subheader("Correlation Heatmap")
        fig = px.imshow(df.corr(), 
                       title="Correlation Matrix",
                       color_continuous_scale="RdBu")
        st.plotly_chart(fig, use_container_width=True)
        
        # Scatter plot
        st.subheader("Feature Relationship")
        col1, col2 = st.columns(2)
        with col1:
            x_feature = st.selectbox("Select X Feature", df.select_dtypes(include=[np.number]).columns)
        with col2:
            y_feature = st.selectbox("Select Y Feature", df.select_dtypes(include=[np.number]).columns)
        
        fig = px.scatter(df, x=x_feature, y=y_feature, 
                        title=f"{x_feature} vs {y_feature}")
        st.plotly_chart(fig, use_container_width=True)
    
    elif view_type == "Performance Distribution":
        st.header("Performance Distribution Analysis")
        
        # Performance distribution
        fig = px.histogram(df, x="Performance Index",
                          title="Distribution of Performance Index",
                          nbins=30)
        st.plotly_chart(fig, use_container_width=True)
        
        # Box plots for features vs performance
        st.subheader("Feature Impact on Performance")
        selected_feature = st.selectbox("Select Feature to Compare", 
                                      df.select_dtypes(include=[np.number]).columns)
        fig = px.box(df, y="Performance Index", x=selected_feature,
                    title=f"Performance Distribution by {selected_feature}")
        st.plotly_chart(fig, use_container_width=True)
    
    elif view_type == "Feature Analysis":
        st.header("Feature Analysis")
        
        # Normalized vs Original Data Comparison
        st.subheader("Normalized vs Original Data")
        feature = st.selectbox("Select Feature to Compare", 
                             df.select_dtypes(include=[np.number]).columns)
        
        fig = go.Figure()
        fig.add_trace(go.Histogram(x=df[feature], name="Original"))
        fig.add_trace(go.Histogram(x=df_normalized[feature], name="Normalized"))
        fig.update_layout(title=f"Distribution Comparison for {feature}")
        st.plotly_chart(fig, use_container_width=True)
        
        # Feature statistics
        st.subheader("Feature Statistics")
        stats_df = df.describe()
        st.dataframe(stats_df)

if __name__ == "__main__":
    main() 