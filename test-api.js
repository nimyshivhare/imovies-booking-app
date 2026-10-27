const testAuth = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@imovies.com', password: 'user123' }),
    });
    const data = await res.json();
    console.log('Login Test Succeeded:', data.name, '| Role:', data.role, '| JWT Token Generated:', !!data.token);

    const moviesRes = await fetch('http://localhost:5000/api/movies');
    const movies = await moviesRes.json();
    console.log('Movies Fetched:', movies.length, 'movies in catalogue.');
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
};

testAuth();
