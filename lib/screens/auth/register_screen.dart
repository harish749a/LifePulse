import 'package:flutter/material.dart';

import '../../routes/app_router.dart';
import '../../services/auth_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() =>
      _RegisterScreenState();
}

class _RegisterScreenState
    extends State<RegisterScreen> {
  final first = TextEditingController();
  final last = TextEditingController();
  final email = TextEditingController();
  final phone = TextEditingController();
  final password = TextEditingController();

  bool loading = false;

  Future register() async {
    setState(() {
      loading = true;
    });

    try {
      await AuthService().register(
        firstName: first.text,
        lastName: last.text,
        email: email.text,
        phone: phone.text,
        password: password.text,
      );

      if (!mounted) return;

      Navigator.pushReplacementNamed(
        context,
        AppRouter.login,
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
        ),
      );
    }

    setState(() {
      loading = false;
    });
  }

  Widget input(
      TextEditingController controller,
      String label,
      {bool hide = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: TextField(
        controller: controller,
        obscureText: hide,
        decoration: InputDecoration(
          labelText: label,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:
          AppBar(title: const Text("Register")),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: ListView(
          children: [

            input(first, "First Name"),
            input(last, "Last Name"),
            input(email, "Email"),
            input(phone, "Phone"),
            input(password, "Password",
                hide: true),

            ElevatedButton(
              onPressed:
                  loading ? null : register,
              child: const Text("Register"),
            )
          ],
        ),
      ),
    );
  }
}

// import 'package:flutter/material.dart';

// class RegisterScreen extends StatelessWidget {
//   const RegisterScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return const Scaffold(
//       body: Center(
//         child: Text("Register Screen"),
//       ),
//     );
//   }
// }