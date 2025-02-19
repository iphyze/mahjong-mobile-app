import React from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../components/common/ThemeProvider';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;


// Validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});


const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const { showToast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await api.post('/auth/login', values);
      const { token, id, ...userData } = response.data?.data;
      
      const loginSuccess = await login(String(token), String(id), userData);
      
      if (loginSuccess) {
        showToast(response.data?.message || 'Login successful', 'success');
      }

    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
      });
      showToast(
        error.response?.data?.message || 
        'Login failed', 
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}>
      <Formik initialValues={{ email: '', password: '' }} validationSchema={LoginSchema} onSubmit={handleLogin}>
        {({ 
          handleChange, 
          handleBlur, 
          handleSubmit, 
          values, 
          errors, 
          touched, 
          isSubmitting 
        }) => (
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: theme.text }]}>Login</Text>

            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, { backgroundColor: theme.surface, color: theme.text, 
              borderColor: (errors.email && touched.email) ? 'red' : theme.border }]}
                placeholder="Email"
                placeholderTextColor={theme.text + '80'}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && touched.email && (<Text style={styles.errorText}>{errors.email}</Text>)}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text,
                    borderColor: (errors.password && touched.password) ? 'red' : theme.border}]}
                placeholder="Password"
                placeholderTextColor={theme.text + '80'}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
              />
              {errors.password && touched.password && (<Text style={styles.errorText}>{errors.password}</Text>)}
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (<ActivityIndicator color={theme.background} /> ) : (
                <Text style={[styles.buttonText, { color: theme.background }]}>
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginScreen;