'use client';

import { useEffect, useState } from 'react';

/**
 * Hook for managing WebAuthn (Biometric) Authentication
 */
export function useBiometrics() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    // Check if the browser supports WebAuthn and platform authenticators (TouchID/FaceID)
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => setIsSupported(available))
        .catch(() => setIsSupported(false));
      
      const enrolled = localStorage.getItem('prophetbase-biometrics-enrolled') === 'true';
      setIsEnrolled(enrolled);
    }
  }, []);

  const enroll = async (username: string) => {
    if (!isSupported) return false;

    try {
      // In a real app, these values would come from the server
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: { name: "ProphetBase", id: window.location.hostname },
        user: {
          id: Uint8Array.from(username, c => c.charCodeAt(0)),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }], // ES256
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      if (credential) {
        localStorage.setItem('prophetbase-biometrics-enrolled', 'true');
        setIsEnrolled(true);
        console.log('Successfully enrolled biometric credential:', credential);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric enrollment failed:', error);
      return false;
    }
  };

  const authenticate = async () => {
    if (!isSupported || !isEnrolled) return false;

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        rpId: window.location.hostname,
        userVerification: "required",
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      if (assertion) {
        console.log('Successfully authenticated with biometrics:', assertion);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  };

  const disable = () => {
    localStorage.removeItem('prophetbase-biometrics-enrolled');
    setIsEnrolled(false);
  };

  return {
    isSupported,
    isEnrolled,
    enroll,
    authenticate,
    disable,
  };
}
