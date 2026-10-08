# booking-driver-mobile

Driver app: go online, take jobs, run the ride steps, share location, see earnings. React Native + TypeScript on Expo SDK 57.

## Run on your phone (free)

1. Install **Expo Go** from the App Store or Play Store.
2. Start the backend from [booking-engine](https://github.com/RaminduSamarawickrama/booking-engine) with `GATEWAY_BIND=0.0.0.0`, or open a Cloudflare tunnel (`scripts/tunnel.sh`).
3. Here:

   ```sh
   cp .env.example .env   # set EXPO_PUBLIC_API_BASE_URL to your LAN IP or tunnel URL
   npm install
   npx expo start         # scan the QR code with your phone
   ```

On a phone, `localhost` means the phone itself, so use your computer's LAN IP or the tunnel URL. You can also change the backend from the panel in the app; it is saved in the device keychain.

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_API_BASE_URL` | Backend the app talks to by default |
| `EXPO_PUBLIC_ALLOW_API_OVERRIDE` | `false` hides the backend switcher (release builds) |

`EXPO_PUBLIC_` values are bundled into the app: never put secrets in them.

Add native modules with `npx expo install <package>` so versions match the SDK. Installable test builds can come later from Expo's free EAS Build tier; store publishing (Apple $99/yr, Google $25 once) needs approval first.

Enable the secret-blocking pre-commit hook once per clone: `git config core.hooksPath .githooks`

Part of the airport transfer booking platform:

| Repo | What it is |
| --- | --- |
| [booking-engine](https://github.com/RaminduSamarawickrama/booking-engine) | Spring Boot services, Docker Compose, infrastructure and planning docs |
| [booking-shared](https://github.com/RaminduSamarawickrama/booking-shared) | TypeScript shared by every client: backend switching, shared UI |
| [booking-customer-web](https://github.com/RaminduSamarawickrama/booking-customer-web) | Customer website (Vercel) |
| [booking-admin-web](https://github.com/RaminduSamarawickrama/booking-admin-web) | Operations dashboard (Vercel) |
| [booking-customer-mobile](https://github.com/RaminduSamarawickrama/booking-customer-mobile) | Customer app (Expo) |
| [booking-driver-mobile](https://github.com/RaminduSamarawickrama/booking-driver-mobile) | Driver app (Expo) |
