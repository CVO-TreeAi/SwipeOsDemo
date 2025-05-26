import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function V3Redirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to SwipeOS...</h1>
        <p className="text-gray-400">V3 is now the main version at /</p>
      </div>
    </div>
  );
} 