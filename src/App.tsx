import { type ReactNode, useEffect, useState } from 'react';
import { get } from './util/http';
import BlogPosts, { BlogPost } from './components/BlogPosts';
import ErrorMessage from './components/ErrorMessage';

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>('');
  useEffect(() => {
    async function fetch() {
      setIsFetching(true);
      try {
        const data = (await get(
          'https://jsonplaceholder.typicode.com/posts'
        )) as RawDataBlogPost[];
        const blogPosts: BlogPost[] = data.map(raw => {
          return {
            id: raw.id,
            title: raw.title,
            text: raw.body,
          };
        });
        setFetchedPosts(blogPosts);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }

      setIsFetching(false);
    }
    fetch();
  }, []);

  let content: ReactNode;
  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }
  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (isFetching) {
    content = <p id="loading-fallback">Loading Post...</p>;
  }
  return (
    <main>
      <img src="data-fetching.png" alt="img" />
      {content}
    </main>
  );
}

export default App;
