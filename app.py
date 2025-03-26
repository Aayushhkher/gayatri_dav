import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
from pathlib import Path

# Set page config
st.set_page_config(
    page_title="Student Performance Dashboard",
    page_icon="📊",
    layout="wide"
)

# Load data
@st.cache_data
def load_data():
    df = pd.read_csv('data/Student_Performance.csv')
    return df

# Main app
def main():
    st.title("📊 Student Performance Dashboard")
    
    # Load data
    df = load_data()
    
    # Sidebar filters
    st.sidebar.header("Filters")
    gender_filter = st.sidebar.multiselect(
        "Select Gender",
        options=df['Gender'].unique(),
        default=df['Gender'].unique()
    )
    
    education_filter = st.sidebar.multiselect(
        "Select Parental Education",
        options=df['Parental Level of Education'].unique(),
        default=df['Parental Level of Education'].unique()
    )
    
    # Apply filters
    filtered_df = df[
        (df['Gender'].isin(gender_filter)) &
        (df['Parental Level of Education'].isin(education_filter))
    ]
    
    # Overview Statistics
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Students", len(filtered_df))
    with col2:
        st.metric("Average Performance", f"{filtered_df['Performance Index'].mean():.2f}")
    with col3:
        st.metric("Performance Range", f"{filtered_df['Performance Index'].min():.1f} - {filtered_df['Performance Index'].max():.1f}")
    
    # Performance Distribution
    st.subheader("Performance Distribution")
    fig_perf = px.histogram(
        filtered_df,
        x='Performance Index',
        nbins=20,
        title="Distribution of Student Performance"
    )
    st.plotly_chart(fig_perf, use_container_width=True)
    
    # Subject-wise Performance
    st.subheader("Subject-wise Performance")
    subjects = ['Math Score', 'Reading Score', 'Writing Score']
    fig_subjects = go.Figure()
    for subject in subjects:
        fig_subjects.add_trace(go.Box(
            y=filtered_df[subject],
            name=subject
        ))
    fig_subjects.update_layout(title="Subject-wise Performance Distribution")
    st.plotly_chart(fig_subjects, use_container_width=True)
    
    # Performance by Parental Education
    st.subheader("Performance by Parental Education")
    fig_edu = px.box(
        filtered_df,
        x='Parental Level of Education',
        y='Performance Index',
        title="Performance Distribution by Parental Education"
    )
    st.plotly_chart(fig_edu, use_container_width=True)
    
    # Gender Performance Comparison
    st.subheader("Gender Performance Comparison")
    fig_gender = px.box(
        filtered_df,
        x='Gender',
        y='Performance Index',
        title="Performance Distribution by Gender"
    )
    st.plotly_chart(fig_gender, use_container_width=True)
    
    # Correlation Heatmap
    st.subheader("Feature Correlation")
    numeric_cols = filtered_df.select_dtypes(include=[np.number]).columns
    corr_matrix = filtered_df[numeric_cols].corr()
    fig_corr = px.imshow(
        corr_matrix,
        title="Correlation Heatmap",
        aspect="auto"
    )
    st.plotly_chart(fig_corr, use_container_width=True)
    
    # Detailed Data Table
    st.subheader("Detailed Data")
    st.dataframe(filtered_df, use_container_width=True)

if __name__ == "__main__":
    main() 