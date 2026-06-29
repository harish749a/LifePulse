import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class StorageService {

  static const _storage =
      FlutterSecureStorage();

  static const _accessToken =
      "access_token";

  static const _refreshToken =
      "refresh_token";

  static Future<void> saveAccessToken(
      String token) async {

    await _storage.write(

      key: _accessToken,

      value: token,
    );
  }

  static Future<String?> getAccessToken() {

    return _storage.read(

      key: _accessToken,
    );
  }

  static Future<void> saveRefreshToken(
      String token) async {

    await _storage.write(

      key: _refreshToken,

      value: token,
    );
  }

  static Future<String?> getRefreshToken() {

    return _storage.read(

      key: _refreshToken,
    );
  }

  static Future<void> clearTokens() async {

    await _storage.delete(

      key: _accessToken,
    );

    await _storage.delete(

      key: _refreshToken,
    );
  }
}


// import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// class StorageService {
//   static const _storage = FlutterSecureStorage();

//   static Future<void> saveAccessToken(String token) async {
//     await _storage.write(key: "access_token", value: token);
//   }

//   static Future<void> saveRefreshToken(String token) async {
//     await _storage.write(key: "refresh_token", value: token);
//   }

//   static Future<String?> getAccessToken() async {
//     return _storage.read(key: "access_token");
//   }

//   static Future<String?> getRefreshToken() async {
//     return _storage.read(key: "refresh_token");
//   }

//   static Future<void> clearTokens() async {
//     await _storage.deleteAll();
//   }
// }