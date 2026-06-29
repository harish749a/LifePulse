import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../main.dart';
import 'home_shell.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();
  final _urlController = TextEditingController();

  bool _isLoginMode = true;
  bool _obscurePassword = true;
  bool _isLoading = false;
  bool _showSettings = false;

  String? _errorMessage;
  String? _successMessage;

  bool _isTestingConnection = false;
  bool? _isConnectionSuccess;
  String? _connectionMessage;

  @override
  void initState() {
    super.initState();
    final api = Provider.of<ApiService>(context, listen: false);
    _urlController.text = api.baseUrl;
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    _urlController.dispose();
    super.dispose();
  }

  Future<void> _testConnection() async {
    setState(() {
      _isTestingConnection = true;
      _isConnectionSuccess = null;
      _connectionMessage = null;
    });

    final api = Provider.of<ApiService>(context, listen: false);
    final result = await api.pingBackend(_urlController.text);

    setState(() {
      _isTestingConnection = false;
      _isConnectionSuccess = result['success'];
      _connectionMessage = result['message'];
    });
  }

  Future<void> _saveConnectionUrl() async {
    final api = Provider.of<ApiService>(context, listen: false);
    await api.setBaseUrl(_urlController.text);
    setState(() {
      _successMessage = 'FastAPI URL updated to: ${_urlController.text}';
    });
    await _testConnection();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    final api = Provider.of<ApiService>(context, listen: false);
    final state = Provider.of<AppState>(context, listen: false);

    try {
      if (_isLoginMode) {
        await api.login(_emailController.text.trim(), _passwordController.text);
        final profile = await api.getProfile();
        state.setUserSession(_emailController.text.trim(), profile.name);
        
        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const HomeShell()),
          );
        }
      } else {
        await api.register(
          _emailController.text.trim(),
          _passwordController.text,
          _nameController.text.trim(),
        );
        setState(() {
          _isLoginMode = true;
          _successMessage = 'Account successfully registered in your PostgreSQL database! Please log in.';
        });
      }
    } catch (e) {
      setState(() {
        String err = e.toString().replaceAll('Exception: ', '');
        if (err.contains('Failed host lookup') || err.contains('Connection refused')) {
          _errorMessage = 'Could not connect to FastAPI backend at "${api.baseUrl}". Ensure your server is running and CORS is fully configured.';
        } else {
          _errorMessage = err;
        }
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top Bar Configuration Toggle
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '🌱 LifePulse',
                    style: TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      Icons.settings_outlined,
                      color: _showSettings ? const Color(0xFF059669) : Colors.grey,
                    ),
                    onPressed: () {
                      setState(() {
                        _showSettings = !_showSettings;
                      });
                    },
                  ),
                ],
              ),

              // Connection Panel
              if (_showSettings) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'FastAPI Connection Settings',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _urlController,
                        style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
                        decoration: const InputDecoration(
                          labelText: 'Base API URL',
                          border: OutlineInputBorder(),
                          contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          ElevatedButton(
                            onPressed: _isTestingConnection ? null : _testConnection,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFE2E8F0),
                              foregroundColor: const Color(0xFF1E293B),
                              elevation: 0,
                            ),
                            child: Text(_isTestingConnection ? 'Testing...' : 'Test URL'),
                          ),
                          ElevatedButton(
                            onPressed: _saveConnectionUrl,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF059669),
                              foregroundColor: Colors.white,
                              elevation: 0,
                            ),
                            child: const Text('Save & Check'),
                          ),
                        ],
                      ),
                      if (_connectionMessage != null) ...[
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.all(8),
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: _isConnectionSuccess == true ? const Color(0xFFECFDF5) : const Color(0xFFFEF2F2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            _connectionMessage!,
                            style: TextStyle(
                              fontSize: 11,
                              color: _isConnectionSuccess == true ? const Color(0xFF065F46) : const Color(0xFF991B1B),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 40),

              // Title Header
              Text(
                _isLoginMode ? 'Welcome Back' : 'Create Account',
                style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                _isLoginMode 
                    ? 'Log in to sync health, water, habits, and scores live to PostgreSQL.' 
                    : 'Sign up to configure your unified dashboard metrics.',
                style: const TextStyle(fontSize: 14, color: Color(0xFF64748B)),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 32),

              // Form Inputs
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    if (!_isLoginMode) ...[
                      TextFormField(
                        controller: _nameController,
                        decoration: InputDecoration(
                          prefixIcon: const Icon(Icons.person_outline),
                          labelText: 'Your Name',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        validator: (v) => v == null || v.isEmpty ? 'Please enter your name' : null,
                      ),
                      const SizedBox(height: 16),
                    ],
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.mail_outline),
                        labelText: 'Email Address',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      validator: (v) => v == null || !v.contains('@') ? 'Please enter a valid email' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(
                          icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
                          onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                        ),
                        labelText: 'Password',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      validator: (v) => v == null || v.length < 6 ? 'Password must be at least 6 characters' : null,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Alert notifications
              if (_successMessage != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(12)),
                  child: Text(_successMessage!, style: const TextStyle(color: Color(0xFF047857), fontSize: 12)),
                ),
              if (_errorMessage != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(12)),
                  child: Text(_errorMessage!, style: const TextStyle(color: Color(0xFFB91C1C), fontSize: 12)),
                ),

              // Submit Button
              SizedBox(
                height: 54,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF059669),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(_isLoginMode ? 'Login' : 'Register Account', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),

              const SizedBox(height: 16),

              // Mode Toggles
              TextButton(
                onPressed: () {
                  setState(() {
                    _isLoginMode = !_isLoginMode;
                    _errorMessage = null;
                    _successMessage = null;
                  });
                },
                child: Text(
                  _isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Log In",
                  style: const TextStyle(color: Color(0xFF059669), fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
