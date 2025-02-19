import React from "react";
import {View, Text, StyleSheet} from 'react-native';

class ErrorBoundaryClass extends React.Component {
    state = {hasError: false, error: null};

    static getDerivedStateFromError(error){
        return {hasError: true, error};
    }

    componentDidCatch(error, errorInfo){
        console.log('=== App Error ===');
        console.log('Error:', error);
        console.log('Error Info:', errorInfo);
    }

    render() {
        if (this.state.hasError){
            return(
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>App Error: {this.state.error?.message}</Text>
                </View>
            );
        }
        return this.props.children;
    } 
}

const ErrorBoundary = ({ children }) => {
    return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>
}


const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    errorText: {
        color: 'red',
        textAlign: 'center'
    }
})

export default ErrorBoundary;