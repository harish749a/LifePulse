import 'package:flutter/material.dart';

import '../../services/auth_service.dart';

class ForgotPasswordScreen extends StatefulWidget {
	const ForgotPasswordScreen({super.key});

	@override
	State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
	final _emailController = TextEditingController();
	bool _loading = false;

	Future<void> _submit() async {
		final email = _emailController.text.trim();
		if (email.isEmpty) {
			ScaffoldMessenger.of(context).showSnackBar(
				const SnackBar(content: Text('Please enter your email')),
			);
			return;
		}

		setState(() => _loading = true);
		try {
			await AuthService().forgotPassword(email);
			if (!mounted) return;
			ScaffoldMessenger.of(context).showSnackBar(
				const SnackBar(content: Text('If this email exists, a reset link was sent.')),
			);
			Navigator.pop(context);
		} catch (e) {
			if (!mounted) return;
			ScaffoldMessenger.of(context).showSnackBar(
				SnackBar(content: Text(e.toString())),
			);
		} finally {
			if (mounted) setState(() => _loading = false);
		}
	}

	@override
	void dispose() {
		_emailController.dispose();
		super.dispose();
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(title: const Text('Forgot Password')),
			body: Padding(
				padding: const EdgeInsets.all(16.0),
				child: Column(
					crossAxisAlignment: CrossAxisAlignment.stretch,
					children: [
						const SizedBox(height: 16),
						const Text(
							'Enter your email to receive a password reset link.',
							style: TextStyle(fontSize: 16),
						),
						const SizedBox(height: 16),
						TextField(
							controller: _emailController,
							keyboardType: TextInputType.emailAddress,
							decoration: const InputDecoration(
								labelText: 'Email',
								border: OutlineInputBorder(),
							),
						),
						const SizedBox(height: 20),
						ElevatedButton(
							onPressed: _loading ? null : _submit,
							child: _loading
									? const SizedBox(
											height: 20,
											width: 20,
											child: CircularProgressIndicator(strokeWidth: 2),
										)
									: const Text('Send Reset Link'),
						),
					],
				),
			),
		);
	}
}
