import { Redirect } from 'expo-router';

/** Legacy route — forwards to live My QR screen. */
export default function QRCodeRedirect() {
  return <Redirect href="/my-qr" />;
}
