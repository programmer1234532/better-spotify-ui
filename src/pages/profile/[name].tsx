import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiInstance from '../../axios';
import styles from '../styles/Home.module.css';
import { useAuth } from '../AuthProvider';

export default function HomePage() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const { setAccessToken, login, token } = useAuth();

  const fetchUserData = async (bearerToken: string, name: string) => {
    try {
      const { data } = await apiInstance.get(`/user/profile/${name}`, {
        headers: { Authorization: 'Bearer ' + bearerToken },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      const response = await apiInstance.get('/user/logout', {
        headers: { Authorization: 'Bearer ' + token },
      });

      if (response.status === 200) {
        router.push('/login');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getTopTracks = async (type: 'artits' | 'tracks') => {
    setHasMounted(false);
    try {
      const response = await apiInstance.get(`/user/getTopItems/${type}`, {
        headers: { Authorization: 'Bearer ' + token },
      });
    } catch (err) {
      console.log(err);
    }
    setHasMounted(true);
  };

  useEffect(() => {
    console.log('hello');
    if (router.isReady) {
      const { access_token, error, name } = router.query;
      console.log(name, 'name');
      if (error) {
        router.push('/login');
      } else if (
        access_token &&
        typeof access_token === 'string' &&
        typeof name === 'string'
      ) {
        login();
        setAccessToken(access_token);
        fetchUserData(access_token, name);
      } else {
        typeof name === 'string' && fetchUserData(token, name);
      }
    }
  }, [router.isReady]);

  return (
    <main>
      <button onClick={logout}>Logout</button>
      <button onClick={() => getTopTracks('tracks')}>Get Top Tracks</button>
    </main>
  );
}