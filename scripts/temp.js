// Temp scripts //

// Try to Create a new blog post //
() => {
  return fetch('/api/blogs', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({ title: 'My Title', content: 'My Content' })
  });
}

// Try to Get the list of blog posts //
() => {
  return fetch('/api/blogs', {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type':'application/json'
    }
  });
}